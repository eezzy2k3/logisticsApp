const mongoose = require("mongoose")

const adminSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    email:{
        type:String,
        required:true  
    },
    role:{
        type:String,
        required:true,
        default:"admin"  
    }
})

const Admin = mongoose.model("Admin",adminSchema)

module.exports = Admin
