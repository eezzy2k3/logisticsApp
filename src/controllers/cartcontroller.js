const Shipment = require("../models/Shipment")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middlewares/asyncHandler")
const sendMail = require("../utils/sendMail")
const User = require("../models/Usermodel")
const Cart = require("../models/cartmodel")

const createCart = asyncHandler(async(req,res,next)=>{
    
    const owner = req.user.id
    
    const productId = req.body.productId
   
    const amountPerKg = req.body.amountPerKg
   
    // get shippment from DB
    const shipment = await Shipment.findOne({owner})

    if(!shipment) return next(new ErrorResponse(`No shipment found`,404))

    // only shipment with status processed can be added to cart
    let shipmentProccessed = []
   
    shipment.products.map((product)=>{
        if(product.status === "Processed"){
            shipmentProccessed.push(product)
        }
    })
    
    // get cart from DB
    const cart = await Cart.findOne({owner}).populate({path:"owner",select:"name uniqueId" })
   
    // get product index
    const findIndex = shipmentProccessed.findIndex(product=>product._id==productId) 

//    check if product exist
    if(findIndex < 0) return next(new ErrorResponse(`No shipment found`,404))
   
    const product = shipmentProccessed[findIndex]
   

    // if there is an existing cart 
    if(cart){
        
        // check if shipment is in cart
        const index = cart.items.findIndex(product=>product.productId==productId)
       
        // if shipment is not in cart
        if(index<0){
           cart.items.push({productId,weight:product.weight,productName:product.productName})
           let weightSum = 0
           cart.items.map((product)=>{
               weightSum += product.weight
           })
          
           cart.bill = Math.ceil(weightSum)*amountPerKg
          
           await cart.save()
          
           return res.status(200).json({success:true,data:cart})

        // if shipment in cart already
        }else{
            return next(new ErrorResponse(`product with tracking number ${product.trackingNumber} has been added to cart already`,400))
        }
    
        // if no cart,create a new cart  
    }else{
        const cart = await Cart.create({owner,items:[{productId,weight:product.weight,productName:product.productName}],bill:product.amount})
       
        return res.status(201).json({success:true,data:cart})
    }

})

const getCart = asyncHandler(async(req,res,next)=>{
    
    const owner = req.user.id
   
    const cart = await Cart.findOne({owner})
   
    if(!cart) return next(new ErrorResponse("No cart found",404))

    res.status(200).json({success:true,count:cart.items.length,data:cart})

})

module.exports = {createCart,getCart} 