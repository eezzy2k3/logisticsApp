const User = require("../models/Usermodel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middlewares/asyncHandler")
const sendMail = require("../utils/sendMail")


// desc => register new user
// route => POST/api/v1/auth
const register = asyncHandler(async(req,res,next)=>{
    let {name,phoneNumber,email,password,homeAddress,} = req.body
    // generate a unique ID
    const unique = Math.floor(Math.random()*1000000+1)
    
    const uniqueId = `NG${unique}`

    // check if mail is already in use
    const checkMail = await User.findOne({email})
    if(checkMail) return next(new ErrorResponse(`${email} has already been used by another user`,400))

    // hash password
    password = await bcrypt.hash(password,12)
    
    // craete a new accout
    const user = await User.create({name,phoneNumber,email,homeAddress,uniqueId,password})

    res.status(201).json({success:true,msg:"account successfully created",data:user})


    
    
})

// desc => login a user
// route => POST/api/v1/auth/login
const login = asyncHandler(async(req,res,next)=>{
    const {email,password} = req.body

     // check for empty field(email,password)
     if(!email||!password) return next(new ErrorResponse(`enter email and password`,400))


    // check for user in DB
    const user = await User.findOne({email}).select("+password")
   
    if(!user) return next(new ErrorResponse(`invalid credentials`,400))

    // compare password with hashed password
    const correctPassword = await bcrypt.compare(password,user.password)
    if(!correctPassword) return next(new ErrorResponse(`invalid credentials`,400))

    sendCookie(user,200,res)

})

// sendcookie function

const sendCookie = (user,statusCode,res)=>{
    const token = jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:"30d"})

    const options = ({
        expires:new Date(Date.now()+2592000000),
        httpOnly:true
    })
    res.status(statusCode).cookie("token",token,options).json({success:true,token})
}

// desc => get a logged in user
// route => GET/api/v1/auth

const getMe =asyncHandler(async(req,res,next)=>{
    const id = req.user.id

    // get user from Db
    const user = await User.findById(id)

    res.status(200).json({success:true,data:user})
})

// desc => delete user
// route => DELETE/api/v1/auth
const deleteMe =asyncHandler(async(req,res,next)=>{
    const id = req.user.id

    // get user from Db and delete
    const user = await User.findByIdAndDelete(id)

    res.status(200).json({success:true,data:{}})
})


// desc => update user
// route => PUT/api/v1/auth
const updateMe = asyncHandler(async(req,res,next)=>{
     const id = req.user.id
    const {phoneNumber,homeAddress} = req.body

    // accepted data to update
    const fieldToUpdate = {phoneNumber,homeAddress}

    const user = await User.findByIdAndUpdate(id,fieldToUpdate,{new:true})

    res.status(200).json({success:true,data:user})


})

// desc => change password
// route => Put/api/v1/auth/changepassword

const changePassword = asyncHandler(async(req,res,next)=>{
    let {password,newPassword} = req.body
    const id = req.user.id

    let user = await User.findById(id).select("+password")

    // compare old password
    const validPassword = await bcrypt.compare(password,user.password)
    if(!validPassword) return next(new ErrorResponse("invalid password",400))

    newPassword = await bcrypt.hash(newPassword,12)

user = await User.findByIdAndUpdate(id,{password:newPassword},{new:true})

    res.status(200).json({success:true,msg:`password successfully changed`})
})

// desc => generate reset token for password reset
// route => post/api/v1/auth/generatetoken

const generateToken = asyncHandler(async(req,res,next)=>{
    const {email} = req.body

    const user = await User.findOne({email})

    if(!user) return next (new ErrorResponse(`user with ${email} does not exist`,404))

    const resetToken = jwt.sign({email:user.email},process.env.JWT_SECRET)

    // set token to expire in 10 minutes
    const resetTokenExpire = Date.now()+600000

    user.resetToken = resetToken

    user.resetTokenExpire = resetTokenExpire

   await user.save()

    
    //   create a message 
    const message = `click on the link to reset password :\n\n ${req.protocol}://${req.get("host")}/api/v1/auth/resettoken/${user.resetToken}`

    // send token to email
    try{
       await sendMail({
            email:user.email,
            subject:"click on this link to reset your password",
            message
        })
    }catch(error){
        console.log(error.message)
        user.resetToken = undefined
        user.resetTokenExpire = undefined
        await user.save()
        next(new ErrorResponse("message could not be sent",500))
    }
   
res.status(200).json({success:true,msg:"We have sent you an email to reset your password. Please check your email and follow the directions provided to retrieve your password."})

})

// desc => reset password
// route => PUT/api/v1/auth/resetpassword
const resetPassword = asyncHandler(async(req,res,next)=>{
    const resetToken = req.params.resetToken

    let password = req.body.password

    const user = await User.findOne({resetToken,resetTokenExpire:{$gt:Date.now()}})

    // check if token is valid   
    if(!user) return next(new ErrorResponse("Invalid token",400))

    password = await bcrypt.hash(password,12)

    user.password = password

    user.resetToken = undefined

    user.resetTokenExpire = undefined

    await user.save()

    res.status(200).json({success:true,msg:"password reset successful"})
    
})






module.exports ={register,login,getMe,updateMe,changePassword,generateToken,resetPassword,deleteMe} 
