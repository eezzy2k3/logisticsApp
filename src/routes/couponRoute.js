const { createCoupon, getCoupon, delCoupon, allCoupon } = require("../controllers/couponController")

const {authorize,access} = require("../middlewares/authorize")

const express = require("express")

const router = express.Router()

router.use(authorize)
router.use(access("admin"))

router.route("/")
.post(createCoupon)
.get(allCoupon)

router.route("/:id")
.get(getCoupon)
.delete(delCoupon)



module.exports = router