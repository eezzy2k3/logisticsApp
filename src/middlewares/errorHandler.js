const ErrorResponse = require("../utils/errorResponse")

const errorHandler = (err,req,res,next)=>{
    console.log(err)
    let error = {...err}
    error.message = err.message
   
    //  duplicate error
    if(err.code === 11000){
        const message = "Duplicate field entered"
        error = new ErrorResponse(message,400)
    }
    // mongoose bad objectId
    if(err.name === "CastError"){
        const message =`Resource not found with id ${err.value}`
        error = new ErrorResponse(message,404)
    }
    // mongoose validation error
    if(err.name === "ValidationError"){
        const message = Object.values(err.errors).map(value=>value.message)
        error = new ErrorResponse(message,400)
    }
    res.status(error.statusCode||500).json({success:false,error:error.message||"server error"})
    


}

module.exports = errorHandler