const Coupon = require("../models/CouponModel")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middlewares/asyncHandler")

const createCoupon = asyncHandler(async(req,res,next)=>{
   
    let {expireIn,couponCode,discount} = req.body
    
    // set expiration date   
    expireIn = expireIn * 24 * 60 * 60 * 1000

    const expiresAt = new Date(Date.now()+expireIn)

    const coupon = await Coupon.create({expiresAt,couponCode,discount})

    res.status(201).json({success:true,data:coupon})

})

const getCoupon = asyncHandler(async(req,res,next)=>{
    const id = req.params.id
  
    const coupon = await Coupon.findById(id)

    if(!coupon) return next(new ErrorResponse(`coupon does not exist`,404))

    res.status(200).json({success:true,data:coupon})
})

const allCoupon = asyncHandler(async(req,res,next)=>{
    
    const coupon = await Coupon.find()

    if(!coupon) return next(new ErrorResponse(`No coupon found`,404))

    res.status(200).json({success:true,count:coupon.length,data:coupon})
})

const delCoupon = asyncHandler(async(req,res,next)=>{
    const id = req.params.couponCode
  
    const coupon = await Coupon.findByIdAndDelete(id)

    if(!coupon) return next(new ErrorResponse(`coupon with code number ${couponCode} does not exist`,404))

    res.status(200).json({success:true,data:{}})
})


module.exports = {createCoupon,getCoupon,allCoupon,delCoupon}

