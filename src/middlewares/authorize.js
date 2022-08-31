const req = require("express/lib/request");
const jwt = require("jsonwebtoken")



const authorize = (req,res,next)=>{
    let token;
    const authHeader = req.headers.authorization

    if(authHeader&&authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1]
    }
    if(req.cookies.token){
        token = req.cookies.token
    }

    if(!token) return next(new ErrorResponse("unauthorize user",401))

    const verified = jwt.verify(token,process.env.JWT_SECRET)

    req.user = verified
    
    next()

}

module.exports = authorize