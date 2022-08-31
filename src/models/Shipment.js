const mongoose = require("mongoose")

const shipmentSchema = mongoose.Schema({
    owner:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    uniqueId :{
        type:String,
        required:true
    },
    products:[{
        productName:{
            type:String,
            required:true,
        },
        weight:{
            type:Number,
            required:true
        },
        amount:{
            type:Number,
            required:true
        },
        status:{
            type:String,
            enum:["Processed","Packing","Shipped","Arrived","Dispatched","Delivered"],
            default:"Processed"
        },
        trackingNumber:{
            type:String,
            required:true,
            unique:true
        },
        trackingHistory:{
            type:Array
        }
    }]

},{timestamps:true})

const Shipment = mongoose.model("Shipment",shipmentSchema)

module.exports = Shipment