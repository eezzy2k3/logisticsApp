const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    phoneNumber:{
        type:String,
        required:true,
        match:[/((^090)([23589]))|((^070)([1-9]))|((^080)([2-9]))|((^081)([0-9]))(\d{7})/,"Please enter a valid phone number"]
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:[/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,"Please enter a valid email address"]
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    homeAddress:{
        type:String,
        required:true
    },
    uniqueId:{
        type:String,
        required:true,
        unique:true
    },
    usaDeliveryAddress:{
        addressline1:{
            type:String,
            required:true,
            default:"83939 Snid Harrow Blvd"
        },
        addressline2:{
            type:String,
            required:true,
            default:"Suite 06"
        },
        city:{
            type:String,
            required:true,
            default:"Houston"
        },
        state:{
            type:String,
            required:true,
            default:"Texas(TX)"
        },
        zip:{
            type:String,
            required:true,
            default:"89074-6758"
        },
        country:{
            type:String,
            required:true,
            default:"USA"
        },
        phoneNumber:{
            type:String,
            required:true,
            default:"+1-672-000-5672"
        }
        
    },
    resetToken:String,
    resetTokenExpire:Date

},{timestamps:true})

const User = mongoose.model("User",userSchema)

module.exports = User