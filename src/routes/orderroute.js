const {authorize,access} = require("../middlewares/authorize")
const express = require("express")

const {checkout,getOrder} = require("../controllers/orderscontroller")


const router = express.Router()
router.use(authorize)
router.post("/checkout",checkout)
router.get("/",getOrder)


module.exports = router