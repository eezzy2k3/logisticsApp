const { createCoupon } = require("../controllers/couponController")

const express = require("express")

const router = express.Router()

router.route("/")
.post(createCoupon)

module.exports = router