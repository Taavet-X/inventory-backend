const mongoose = require('mongoose');
const Item = require('../models/items.model');
require('dotenv').config()

mongoose.connect(process.env.URI)

async function create(body){    
    const item = new Item(body);
    return await item.save();
}

async function findAll(searchValue, page){
    var filter = {}        
    if(searchValue != ""){        
        //filter = { $text: { $search: '"'+searchValue+'"' } }
        if(!isNaN(searchValue)){
            filter = {$or:[ {_id:searchValue}, {name:{'$regex': searchValue, $options:'i'}}]}   
        } else {            
            filter = {name: {'$regex': searchValue, $options:'i'}}          
        }                
    }    
    console.log(filter)
    const items = await Item.find(filter).sort('_id').skip(20*page).limit(20)
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