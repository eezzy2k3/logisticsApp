const mongoose = require("mongoose")

const cartSchema = mongoose.Schema({
    owner:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    items:[{
        productId:{
            type:String,
            required:true
        },
        productName:{
            type:String
        },
        weight:{
            type:Number,
            required:true
        }
       
    }],
    bill:{
        type:Number
    }
},{timestamps:true})

const Cart = mongoose.model("Cart",cartSchema)

module.exports = Cart