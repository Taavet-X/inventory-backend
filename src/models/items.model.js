const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const itemSchema = new Schema({
    _id:Number, 
    name:{
        type:String, 
        unique:true, 
        index:true, 
        required:true},
    stock:{
        type:Number,
        min: [0,"No hay suficiente producto"]},
    purchase_price:Number,
    sale_price:Number
});

itemSchema.index({name:'text'})

const Item = model('Item', itemSchema);
module.exports = Item;