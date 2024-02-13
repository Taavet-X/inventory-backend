const mongoose = require('mongoose');
const Quotation = require('../models/quotations.model');
const Item = require('../models/items.model');
require('dotenv').config()

mongoose.connect(process.env.URI)

async function create(body){    
    const quotation = new Quotation(body);
    return await quotation.save();
}

async function findAll(query){
    var filter = {}        
    if(query.searchValue){                         
        filter["reference"] = {'$regex': searchValue, $options:'i'}
    }    
    const statusFilter = []
    if(query.pending == "true") statusFilter.push('Pendiente')
    if(query.confirmed == "true") statusFilter.push('Confirmada')
    if(query.completed == "true") statusFilter.push('Completada')
    if(statusFilter.length>0){
        filter["status"] = {"$in":statusFilter}
    } else {
        filter["status"] = 'noone'
    }    
    console.log(query)
    console.log(filter)
    const quotations = await Quotation.find(filter).sort({createdAt: -1}).skip(5*query.page).limit(5)
    return quotations
}

async function findOne(code){        
    return await Quotation.findOne({_id:code })
}

async function update(code, body){
    const quotation = await Quotation.findOne({_id:code})
    Object.keys(body).forEach( key =>{
        quotation[key] = body[key]
    })
    return await quotation.save()
}

async function updateStatus(code, body){    
    const session = await mongoose.startSession();
    try {        
        session.startTransaction();
        const quotation = await Quotation.findOne({_id:code})    
        quotation.status = body.status
        if(body.status == "Completada"){
            const items = quotation.items
            for(let i = 0; i < items.length; i++){
                const item = items[i]
                const itemDoc = await Item.findOne({_id:item._id})
                if(itemDoc == null){
                    throw new Error("No se encontro el producto " + item._id)
                }
                if(itemDoc.stock -item.quantity < 0) {
                    throw new Error("No hay suficiente producto " + itemDoc._id)
                }
                await Item.findOneAndUpdate({_id:item._id}, {$inc : {stock : -item.quantity}})
            }        
        }
        const result = await quotation.save()
        await session.commitTransaction();
        return result
    } catch (error) {
        await session.abortTransaction();
        console.error(error);
        throw new Error(error)
    }
    
}

async function updateStock(code, value){
    console.log(code, value)
    return await Quotation.findOneAndUpdate({code}, {$inc : {stock : value}})   
}

async function remove(code){
    await Quotation.deleteOne({_id:code})
}

async function deleteAll(){
    await Quotation.deleteMany({})
}

module.exports = {
    create,
    findAll,
    findOne,
    update,
    remove,
    updateStatus,
    deleteAll
}