const {createShipment,getShipment, getShipmentProcessed, getShipmentPacking, getShipmentShipped, getShipmentArrived, getShipmentDispatched, getShipmentDelivered, getAllShipment, allShipmentProcessed, allShipmentshipped, allShipmentArrived, allShipmentDispatched, allShipmentDelivered, allShipmentPacking, updateStatus} = require("../controllers/shipmentcontroller")
const authorize = require("../middlewares/authorize")
const express = require("express")

const router = express.Router()

router.route("/")
.post(createShipment)
.get(authorize,getShipment)

router.get("/shipmentprocessed",authorize,getShipmentProcessed)
router.get("/shipmentpacking",authorize,getShipmentPacking)
router.get("/shipmentshipped",authorize,getShipmentShipped)
router.get("/shipmentarrived",authorize,getShipmentArrived)
router.get("/shipmentdispatched",authorize,getShipmentDispatched)
router.get("/shipmentdelivered",authorize,getShipmentDelivered)

router.get("/allshipment",getAllShipment)

router.get("/allshipmentprocessed",allShipmentProcessed)
router.get("/allshipmentpacking",allShipmentPacking)
router.get("/allshipmentshipped",allShipmentshipped)
router.get("/allshipmentarrived",allShipmentArrived)
router.get("/allshipmentdispatched",allShipmentDispatched)
router.get("/allshipmentDelivered",allShipmentDelivered)

router.post("/updatestatus",updateStatus)









module.exports = router