const {registerAdmin,login,getMe, specificShipment, userShipment, updateShipment} = require("../controllers/admincontroller")
const {authorize,access} = require("../middlewares/authorize")
const express = require("express")

const router = express.Router()

router.post("/",registerAdmin)

router.post("/login",login)

router.use(authorize)
router.use(access("admin"))

router.get("/",getMe)

router.get("/:id/:productid",specificShipment)

router.get("/:id",userShipment)

router.post("/updateshipment",updateShipment)




module.exports = router