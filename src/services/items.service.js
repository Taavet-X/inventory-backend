const mongoose = require('mongoose');
const Item = require('../models/items.model');
require('dotenv').config()
var _ = require('lodash');

mongoose.connect(process.env.URI)

async function create(body){    
    body.name = _.deburr( body.name.toUpperCase(), ) 
    if(body.stock < 0){
        throw new Error("La cantidad debe ser mayor a 0")
    } 
    if(body.stock.includes(".")){
        throw new Error("La cantidad debe ser un numero entero")
    }
    const item = new Item(body);
    let error = item.validateSync();    
    //assert.equal(error.errors['stock'].message,"No hay suficiente producto")
    return await item.save();
}

async function findAll(searchValue, page, low_quantity){
    var filter = {}        
    if(searchValue != ""){        
        //filter = { $text: { $search: '"'+searchValue+'"' } }
        if(!isNaN(searchValue)){
            filter = {$or:[ {_id:searchValue}, {name:{'$regex': searchValue, $options:'i'}}]}   
        } else {            
            filter = {name: {'$regex': searchValue, $options:'i'}}          
            //filter = { $text: { $search: searchValue }}          
        }                
    }    
    if(low_quantity=='true'){
        filter = {stock:{$lte:3}}
    }
    console.log(filter)
    const items = await Item.find(filter).sort('stock').skip(20*page).limit(20)
    return items
}

async function findOne(_id){        
    return await Item.findOne({ _id })
}

async function update(_id, body){
    const item = await Item.findOne({_id})
    Object.keys(body).forEach( key =>{
        item[key] = body[key]
    })
    return await item.save()
}

async function updateStock(_id, value){ 
    const item = await Item.findOne({_id})
    if(item.stock + value < 0) {
        throw new Error("No hay suficiente producto")
    }
    return await Item.findOneAndUpdate({_id}, {$inc : {stock : value}})   
}

async function remove(_id){
    await Item.deleteOne({_id})
}

async function deleteAll(){
    await Item.deleteMany({})
}


module.exports = {
    create,
    findAll,
    findOne,
    update,
    remove,
    updateStock,
    deleteAll
}