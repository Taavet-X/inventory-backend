const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const quotationSchema = new Schema({
    reference:String,
    items:{
        type:[{
            _id:Number,
            name:String,
            quantity:Number,            
            sale_price:Number,
            subtotal:Number,
        }]
    },
    total:Number,
    status:String,
},{
    timestamps: true
  });

const Quotation = model('Quotation', quotationSchema);
module.exports = Quotation;