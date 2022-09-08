require("dotenv").config()

const express = require("express")

const app = express()

const errorHandler = require("./src/middlewares/errorHandler")

const cookieparser = require("cookie-parser")

const authRouter = require("./src/routes/authRoute")

const shipmentRouter = require("./src/routes/shipmentRoute")

const adminRouter = require("./src/routes/adminRoute")

const cartRouter = require("./src/routes/cartRoute")

const orderRouter = require("./src/routes/orderroute")

const mongoSanitize = require('express-mongo-sanitize')

const helmet = require("helmet")

const xss = require("xss-clean")

const rateLimit = require('express-rate-limit')

const hpp = require("hpp")

const cors = require("cors")


const colors = require("colors")

const connectDb = require("./config/config")

// accept body data in json format
app.use(express.json())

app.use(express.urlencoded({extended:true}))

app.use(cookieparser())

connectDb()

// sanitize data
app.use(mongoSanitize())

// set security headers
app.use(helmet())

// prevent xss attack
app.use(xss())

// set rate limit
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 150, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

// allow cors
app.use(cors())

app.use(hpp())

// mount routers
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/shipment",shipmentRouter)
app.use("/api/v1/admin",adminRouter)
app.use("/api/v1/cart",cartRouter)
app.use("/api/v1/order",orderRouter)




// handels error
app.use(errorHandler)


app.listen(5000,()=>{
    console.log("app is listening on port 5000".yellow)
})

