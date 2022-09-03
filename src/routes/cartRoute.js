const {authorize,access}= require("../middlewares/authorize")
const express = require("express")
const  {createCart,getCart}  = require("../controllers/cartcontroller")

const router = express.Router()

router.use(authorize)
router.post("/",createCart)
router.get("/",getCart)


module.exports = router
