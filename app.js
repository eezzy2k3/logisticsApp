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


const colors = require("colors")

const connectDb = require("./config/config")

// accept body data in json format
app.use(express.json())

app.use(express.urlencoded({extended:true}))

app.use(cookieparser())

connectDb()

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

