const { default: mongoose } = require("mongoose");

const orderSchema = mongoose.Schema({
    owner:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    items:{
        type:Array
    },
    bill:{
        type:String
    }
},{timestamps:true})

const Order = mongoose.model("Order",orderSchema)

module.exports = Order