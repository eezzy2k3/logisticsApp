const {authorize,access} = require("../middlewares/authorize")
const express = require("express")

const checkout = require("../controllers/orderscontroller")


const router = express.Router()
router.use(authorize)
router.post("/checkout",checkout)


module.exports = router