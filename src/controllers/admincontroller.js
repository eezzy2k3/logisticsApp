const Admin = require("../models/Adminmodel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middlewares/asyncHandler")
const Shipment = require("../models/Shipment")

// desc => register admin
// route => POST/api/v1/shipment

const registerAdmin = asyncHandler(async(req,res,next)=>{

    let {name,password,email} = req.body

    password = await bcrypt.hash(password,12)

    const user = await Admin.create({name,password,email})

    res.status(200).json({success:true,data:user})

})

// desc => login a user
// route => POST/api/v1/auth/login
const login = asyncHandler(async(req,res,next)=>{
    const {email,password} = req.body

     // check for empty field(email,password)
     if(!email||!password) return next(new ErrorResponse(`enter email and password`,400))


    // check for user in DB
    const user = await Admin.findOne({email}).select("+password")
   
    if(!user) return next(new ErrorResponse(`invalid credentials`,400))

    // compare password with hashed password
    const correctPassword = await bcrypt.compare(password,user.password)
    if(!correctPassword) return next(new ErrorResponse(`invalid credentials`,400))

    sendCookie(user,200,res)

})

// sendcookie function

const sendCookie = (user,statusCode,res)=>{
    const token = jwt.sign({id:user._id,email:user.email,role:user.role},process.env.JWT_SECRET,{expiresIn:"30d"})

    const options = ({
        expires:new Date(Date.now()+2592000000),
        httpOnly:true
    })
    res.status(statusCode).cookie("token",token,options).json({success:true,token})
}

// desc => get a logged in user
// route => GET/api/v1/auth
// access private/admin

const getMe =asyncHandler(async(req,res,next)=>{
    const id = req.user.id

    // get user from Db
    const user = await Admin.findById(id)

    res.status(200).json({success:true,data:user})
})


// desc => get a user shipment
// route => GET/api/v1/admin/:id
// access private/admin
const userShipment = asyncHandler(async(req,res,next)=>{
   
    const id = req.params.id

    const shipment = await Shipment.findById(id)

    if(!shipment) return next(new ErrorResponse(`You have no shipment yet`,404))


    res.status(200).json({success:true,data:shipment})
})

// desc => get a specificshipment
// route =>  GET/api/v1/admin/:id/:productid
// access private/admin

const specificShipment = asyncHandler(async(req,res,next)=>{
   
    const id = req.params.id

    const productid = req.params.productid

    const shipment = await Shipment.findById(id)

    if(!shipment) return next(new ErrorResponse(`You have no shipment yet`,404))

    const index = shipment.products.findIndex(product=>product._id==productid)

    if(index < 0) return next(new ErrorResponse("No shipment found",404))
  
   const product = shipment.products[index]


    res.status(200).json({success:true,data:product})
})


// desc => modify shipment
// route => POST/api/v1/admin/updateshipment
// access => Private/admin
const updateShipment = asyncHandler(async(req,res,next)=>{
    
    const {uniqueId,trackingNumber,weight,amountPerKg,newTrackingNumber} = req.body
   
   
    const shipment = await Shipment.findOne({uniqueId})

    if(!shipment) return next(new ErrorResponse(`You have no shipment yet`,404))

    const index = shipment.products.findIndex(product=>product.trackingNumber==trackingNumber)

    if(index < 0) return next(new ErrorResponse("No shipment found",404))
  
   const product = shipment.products[index]

    if(newTrackingNumber){
        product.trackingNumber = newTrackingNumber
        await shipment.save()
    }

   if(weight){
       product.weight = weight

       const amount = amountPerKg * Math.ceil(weight)

       product.amount = amount
       await shipment.save()
   }

  
  
   res.status(200).json({success:true,data:product})

})




module.exports = {registerAdmin,login,getMe,userShipment,specificShipment,updateShipment}


// update cart pament
