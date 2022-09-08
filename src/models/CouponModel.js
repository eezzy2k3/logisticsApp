const mongoose = require("mongoose")

const couponSchema = mongoose.Schema({
    couponCode:{
        type:String,
        required:true,
        unique:true
    },
    expiresAt:{
        type:Date,
        required:true
    },
    discount:{
        type:Number,
        required:true
    }
},{timestamps:true})

const Coupon = mongoose.model("Coupon",couponSchema)

module.exports = Coupon