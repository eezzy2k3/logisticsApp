const {register, login, getMe,changePassword,generateToken,resetPassword, updateMe,deleteMe} = require("../controllers/auth")
const authorize = require("../middlewares/authorize")
const express = require("express")

const router = express.Router()

router.route("/")
.post(register)
.get(authorize,getMe)
.put(authorize,updateMe)
.delete(authorize,deleteMe)

router.post("/login",login)
router.put("/changepassword",authorize,changePassword)
router.post("/generatetoken",generateToken)
router.put("/resetpassword/:resetToken",resetPassword)







module.exports = router