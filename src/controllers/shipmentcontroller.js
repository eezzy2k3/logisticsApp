const Shipment = require("../models/Shipment")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middlewares/asyncHandler")
const sendMail = require("../utils/sendMail")
const User = require("../models/Usermodel")


// desc => create shipment
// route => POST/api/v1/shipment
// access => Private/admin
const createShipment = asyncHandler(async(req,res,next)=>{
    
    const {productName,weight,trackingNumber,uniqueId,amountPerKg} = req.body
   
    const trackingHistory = `Package has been received and processed at the warehouse ${Date()}`

    let user = await User.findOne({uniqueId})


    if(!user) return next(new ErrorResponse(`user with ${uniqueId} not found`,404))

     // get owner id from db
     owner = user._id

    // the weight is rounded up th the nearest integer
    const amount = amountPerKg * Math.ceil(weight)

    let shipment = await Shipment.findOne({uniqueId})

        // if the owner has an existing shipment
    if(shipment){

        shipment.products.push({productName,weight,trackingNumber,amount,trackingHistory})

        await shipment.save()
      
        // send newly added shipment to user email
        const findIndex = shipment.products.findIndex(product=>product.trackingNumber===trackingNumber)
      
        // newly added shipment
        let product = shipment.products[findIndex]

         // send mail to the user to notify of new shipment

    try {
        await sendMail({
            email:user.email,
            subject:"new shipment received",
            message:`Hi ${user.name} your order with tracking number ${trackingNumber} has been proceesed at our warehouse this are the details ${product}}`
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success:false,msg:"message could not be sent"})
    }
        
        

       return res.status(201).json({success:true,data:product})

    }

    // if no shipment create a new one
    shipment = await Shipment.create({products:[{weight,trackingNumber,amount,productName,trackingHistory}],owner,uniqueId})

    // send mail to the user to notify of new shipment

    try {
        await sendMail({
            email:user.email,
            subject:"new shipment received",
            message:`Hi ${user.name} your order with tracking number ${trackingNumber} has been proceesed at our warehouse this are the details ${shipment.products}}`
        })
    } catch (error) {
        console.log(error.message)
        shipment = undefined
        return res.status(500).json({success:false,msg:"message could not be sent"})
    }
        
   return res.status(201).json({success:true,data:shipment})
    

})

// desc => get all shippment for a logged in user
// route => get/api/v1/shipment
// access => Private
const getShipment = asyncHandler(async(req,res,next)=>{
    const owner = req.user.id

    const shipment = await Shipment.findOne({owner}).populate({path:"owner",select:"name"})

    if(!shipment) return next(new ErrorResponse(`You have no shipment yet`,404))

    res.status(200).json({success:true,count:shipment.products.length,data:shipment})
})

// desc => get all shippment with status == processed for a logged in user
// route => get/api/v1/shipmentprocessed
// access => Private
const getShipmentProcessed = asyncHandler(async(req,res,next)=>{
    const owner = req.user.id

    const shipment = await Shipment.findOne({owner}).populate({path:"owner",select:"name"})

    if(!shipment) return next(new ErrorResponse(`You have no shipment yet`,404))
  
    // arrray to push all shipment with status processed
    let shipmentProcessed = []
   
    for (let i = 0; i < shipment.products.length; i++) {
            
        if(shipment.products[i].status === "Processed"){
          shipmentProcessed.push(shipment.products[i])
          
        }
    }
    // if no processed shipment
   if(shipmentProcessed < 1) return next(new ErrorResponse(`No shipment found`,404))

    return res.status(200).json({success:true,count:shipmentProcessed.length,data:shipmentProcessed})
})


// desc => get all shippment with status == packing for a logged in user
// route => get/api/v1/shipmentpacking
// access => Private
const getShipmentPacking = asyncHandler(async(req,res,next)=>{
    const owner = req.user.id

    const shipment = await Shipment.findOne({owner}).populate({path:"owner",select:"name"})

    if(!shipment) return next(new ErrorResponse(`You have no shipment yet`,404))
   
    // arrray to push all shipment with status packing
    let shipmentpPacking = []
   
    shipment.products.map((product)=>{
        if(product.status === "Packing"){
            shipmentpPacking.push(product)
        }
    })
    // if no shipment with Packing status
   if(shipmentpPacking < 1) return next(new ErrorResponse(`No shipment found`,404))
    
   return res.status(200).json({success:true,count:shipmentpPacking.length,data:shipmentpPacking})
})


// desc => get all shippment with status == shipped for a logged in user
// route => get/api/v1/shipmentshipped
// access => Private
const getShipmentShipped = asyncHandler(async(req,res,next)=>{
    const owner = req.user.id

    const shipment = await Shipment.findOne({owner}).populate({path:"owner",select:"name"})

    if(!shipment) return next(new ErrorResponse(`You have no shipment yet`,404))
   
    // arrray to push all shipment with status shipped
    let shipmentpShipped = []
   
    shipment.products.map((product)=>{
        if(product.status === "Shipped"){
            shipmentpShipped.push(product)
        }
    })
    // if no shipment with shipped status
   if(shipmentpShipped < 1) return next(new ErrorResponse(`No shipment found`,404))
    
   return res.status(200).json({success:true,count:shipmentpShipped.length,data:shipmentpShipped})
})



// desc => get all shippment with status == arrived for a logged in user
// route => get/api/v1/shipmentarrived
// access => Private
const getShipmentArrived = asyncHandler(async(req,res,next)=>{
    const owner = req.user.id

    const shipment = await Shipment.findOne({owner}).populate({path:"owner",select:"name"})

    if(!shipment) return next(new ErrorResponse(`You have no shipment yet`,404))
   
    // arrray to push all shipment with status arrived
    let shipmentpArrived = []
   
    shipment.products.map((product)=>{
        if(product.status === "Arrived"){
            shipmentpArrived.push(product)
        }
    })

    // if no shipment with status arrived
   if(shipmentpArrived < 1) return next(new ErrorResponse(`No shipment found`,404))
    
   return res.status(200).json({success:true,count:shipmentpArrived.length,data:shipmentpArrived})
})



// desc => get all shippment with status == dispatched for a logged in user
// route => get/api/v1/shipmentdispatched
// access => Private
const getShipmentDispatched = asyncHandler(async(req,res,next)=>{
    const owner = req.user.id

    const shipment = await Shipment.findOne({owner}).populate({path:"owner",select:"name"})

    if(!shipment) return next(new ErrorResponse(`You have no shipment yet`,404))
   
    // arrray to push all shipment with status dispatched
    let shipmentpDispatched = []
   
    shipment.products.map((product)=>{
        if(product.status === "Dispatched"){
            shipmentpDispatched .push(product)
        }
    })

    // if no shippment with status dispatched
   if(shipmentpDispatched  < 1) return next(new ErrorResponse(`No shipment found`,404))
    
   return res.status(200).json({success:true,count:shipmentpDispatched .length,data:shipmentpDispatched})
})


// desc => get all shippment with status == delivered for a logged in user
// route => get/api/v1/shipmentdelivered
// access => Private
const getShipmentDelivered = asyncHandler(async(req,res,next)=>{
    const owner = req.user.id

    const shipment = await Shipment.findOne({owner}).populate({path:"owner",select:"name"})

    if(!shipment) return next(new ErrorResponse(`You have no shipment yet`,404))
   
    // arrray to push all shipment with status delivered
    let shipmentDelivered = []
   
    shipment.products.map((product)=>{
        if(product.status === "Delivered"){
            shipmentDelivered.push(product)
        }
    })

   if(shipmentDelivered < 1) return next(new ErrorResponse(`No shipment found`,404))
    
   return res.status(200).json({success:true,count:shipmentDelivered.length,data:shipmentDelivered})
})

// desc => get tracking history of a user
// route => get/api/v1/shipment/trackinghistory
// access => Private

const trackingHistory = asyncHandler(async(req,res,next)=>{
   
    const owner = req.user.id
    
    const id = req.params.id

    const shipment = await Shipment.findOne({owner})

    if(!shipment) return next(new ErrorResponse(`No shipment in Data base`,404))

    const findIndex = shipment.products.findIndex(product=>product._id == id)

    if(findIndex < 0) return next(new ErrorResponse("No shipment found",404))

    const product = shipment.products[findIndex]

    const trackingHistory = product.trackingHistory
    const data = {trackingHistory,
        weight:product.weight,
        productName:product.productName}

    res.status(200).json({success:true,data})



})


// desc => get all shippment in DB
// route => get/api/v1/shipmentprocessed
// access => Private/admin

const getAllShipment = asyncHandler(async(req,res,next)=>{
    const shipment = await Shipment.find().populate({path:"owner",select:"name"})

    if(!shipment) return next(new ErrorResponse(`No shipment in Data base`,404))

    res.status(200).json({success:true,count:shipment.length,data:shipment})
})

// desc => get all Processed shippment in DB
// route => get/api/v1/allshipmentprocessed
// access => Private/admin

const allShipmentProcessed = asyncHandler(async(req,res,next)=>{
    const shipment = await Shipment.find().populate({path:"owner",select:"name"})

    if(!shipment) return next(new ErrorResponse(`No shipment in Data base`,404))
       
     let shipmentProcessed = []
   
        for (let i = 0; i < shipment.length; i++) {
            
        shipment[i].products.map((product)=>{
            if(product.status === "Processed"){
              shipmentProcessed.push(product)
            }
           
        })
       
    }

    if(shipmentProcessed < 1) return next(new ErrorResponse(`No shipment found`,404))

    res.status(200).json({success:true,count:shipmentProcessed.length,data:shipmentProcessed})
   
})



// desc => get all packing shippment in DB
// route => get/api/v1/allshipmentpacking
// access => Private/admin

const allShipmentPacking= asyncHandler(async(req,res,next)=>{
    
    const shipment = await Shipment.find().populate({path:"owner",select:"name"})

    if(!shipment) return next(new ErrorResponse(`No shipment in Data base`,404))
        
    let shipmentPacking = []
   
    for (let i = 0; i < shipment.length; i++) {
            
        shipment[i].products.map((product)=>{
            if(product.status === "Packing"){
              shipmentPacking.push(product)
            }
           
        })
       
    }

    if(shipmentPacking < 1) return next(new ErrorResponse(`No shipment found`,404))

    res.status(200).json({success:true,count:shipmentPacking.length,data:shipmentPacking})
   
})



// desc => get all shipped shippment in DB
// route => get/api/v1/allshipmentshipped
// access => Private/admin

const allShipmentshipped = asyncHandler(async(req,res,next)=>{
   
    const shipment = await Shipment.find().populate({path:"owner",select:"name"})

    if(!shipment) return next(new ErrorResponse(`No shipment in Data base`,404))
        let shipmentShipped = []
    for (let i = 0; i < shipment.length; i++) {
            
        shipment[i].products.map((product)=>{
            if(product.status === "Shipped"){
                shipmentShipped .push(product)
            }
           
        })
       
    }

    if(shipmentShipped  < 1) return next(new ErrorResponse(`No shipment found`,404))

    res.status(200).json({success:true,count:shipmentShipped .length,data:shipmentShipped })
   
})


// desc => get all arrived shippment in DB
// route => get/api/v1/allshipmentarrived

const allShipmentArrived = asyncHandler(async(req,res,next)=>{
    
    const shipment = await Shipment.find().populate({path:"owner",select:"name"})

    if(!shipment) return next(new ErrorResponse(`No shipment in Data base`,404))
       
    let shipmentArrived = []
   
        for (let i = 0; i < shipment.length; i++) {
            
        shipment[i].products.map((product)=>{
            if(product.status === "Arrived"){
                shipmentArrived .push(product)
            }
           
        })
       
    }

    if(shipmentArrived  < 1) return next(new ErrorResponse(`No shipment found`,404))

    res.status(200).json({success:true,count:shipmentArrived.length,data:shipmentArrived })
   
})



// desc => get all dispatched shippment in DB
// route => get/api/v1/allshipmentdispatched
// access => Private/admin

const allShipmentDispatched = asyncHandler(async(req,res,next)=>{
    
    const shipment = await Shipment.find().populate({path:"owner",select:"name"})

    if(!shipment) return next(new ErrorResponse(`No shipment in Data base`,404))
      
        let shipmentDispatched = []
    
       for (let i = 0; i < shipment.length; i++) {
            
        shipment[i].products.map((product)=>{
            if(product.status === "Dispatched"){
                shipmentDispatched.push(product)
            }
           
        })
       
    }

    if(shipmentDispatched < 1) return next(new ErrorResponse(`No shipment found`,404))

    res.status(200).json({success:true,count:shipmentDispatched.length,data:shipmentDispatched })
   
})


// desc => get all delivered shippment in DB
// route => get/api/v1/allshipmentdeliveed
// access => Private/admin

const allShipmentDelivered = asyncHandler(async(req,res,next)=>{
    
    const shipment = await Shipment.find().populate({path:"owner",select:"name"})

    if(!shipment) return next(new ErrorResponse(`No shipment found`,404))
      
        let shipmentDelivered = []
    
       for (let i = 0; i < shipment.length; i++) {
            
        shipment[i].products.map((product)=>{
            if(product.status === "Delivered"){
                shipmentDelivered.push(product)
            }
           
        })
       
    }

    if(shipmentDelivered < 1) return next(new ErrorResponse(`No shipment found`,404))

    res.status(200).json({success:true,count:shipmentDelivered.length,data:shipmentDelivered })
   
})

// desc => update status of a shipment
// route => get/api/v1/updatestatus
// access => Private/admin
const updateStatus = asyncHandler(async(req,res,next)=>{
   
    const {trackingNumber,uniqueId,status} = req.body
   
    const shipment = await Shipment.findOne({uniqueId})

    if(!shipment) return next(new ErrorResponse(`No shipment found`,404))

    const user = await User.findOne({uniqueId})
   
    const index = shipment.products.findIndex(product=>product.trackingNumber===trackingNumber)

    if(index < 0) return next(new ErrorResponse("No shipment found",404))
  
   const product = shipment.products[index]

   product.status = status

   await shipment.save()
   
   if(product.status === "Packing"){
   
    product.trackingHistory.push(`Shipment has been paid for and ready for outbound ship out.Time: ${Date()}`)
   
    await shipment.save()
      
    // send mail of status to user
    try {
            await sendMail({
                email:user.email,
                subject:"Change of status",
                message:`your shipment ${product} is being packed`
            })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({success:false,msg:"message could not be sent"})
        }
    }
   
    // set date of delivery
    const date = new Date();

    // Add 7 Days
    date.setDate(date.getDate() + 7)


    if(product.status === "Shipped"){
        
        product.trackingHistory.push(`Shipment has been shipped and headed to Lagos, Nigeria.Time: ${Date()}`)
       
        await shipment.save()
      
        // send mail of status to user
        try {
            await sendMail({
                email:user.email,
                subject:"Change of status",
                message:`your shipment ${product} is being shipped and should arrive our ware house in lagos at ${date}`
            })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({success:false,msg:"message could not be sent"})
        }
    }

    
    if(product.status === "Arrived"){
       
        product.trackingHistory.push(`Shipment has arrived Lagos and is ready for pickup Time: ${Date()}`)
       
        await shipment.save()
       
        // send mail of status to user
        try {
            await sendMail({
                email:user.email,
                subject:"Change of status",
                message:`your shipment ${product} has arrived our ware house in lagos on ${Date()}`
            })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({success:false,msg:"message could not be sent"})
        }
    }
 

  res.status(200).json({success:true,data:product})

})




module.exports = {createShipment,getShipment,getShipmentProcessed,getShipmentPacking,getShipmentShipped,getShipmentArrived,getShipmentDispatched,getShipmentDelivered,getAllShipment,
    allShipmentProcessed,allShipmentshipped,allShipmentArrived,allShipmentDispatched,allShipmentDelivered,allShipmentPacking,updateStatus,trackingHistory}