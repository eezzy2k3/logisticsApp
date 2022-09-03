const Shipment = require("../models/Shipment")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middlewares/asyncHandler")
const sendMail = require("../utils/sendMail")
const User = require("../models/Usermodel")
const Cart = require("../models/cartmodel")
const Order = require("../models/orderModel")
const Flutterwave = require('flutterwave-node-v3');

const checkout = asyncHandler(async(req,res,next)=>{
    
    const owner = req.user.id
   
    const ref = Math.floor(Math.random()*1000000+1)
    
    const mref = `rf${ref}`

    const user = await User.findById(owner)

    const cart = await Cart.findOne({owner})

    const shipment = await Shipment.findOne({owner})

    const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);


if(cart){
    let payload =  {
        card_number: req.body.card_number,
        cvv: req.body.cvv,
        expiry_month: req.body.expiry_month,
        expiry_year: req.body.expiry_year,
        currency: "NGN",
        amount: cart.bill,
        redirect_url: "https://www.google.com",
        fullname: req.body.fullname,
        email: user.email,
        "phone_number": user.phoneNumber,
        "enckey": process.env.FLW_ENCRYPTION_KEY,
        "tx_ref": mref
    
    }
    
    
    const response = await flw.Charge.card(payload)
//    console.log(response)
   if (response.meta.authorization.mode === 'pin') {
        let payload2 = payload
        payload2.authorization = {
            "mode": "pin",
            "fields": [
                "pin"
            ],
            "pin": 3310
        }
        const reCallCharge = await flw.Charge.card(payload2)

        const callValidate = await flw.Charge.validate({
            "otp": "12345",
            "flw_ref": reCallCharge.data.flw_ref
        })
        console.log(callValidate)
        if(callValidate.status === 'success') {
            
            // create a new order
            const order = await Order.create({
                owner,
                items:cart.items,
                bill: cart.bill
            })

           
            // change shipment status from proceees to packing

            // get all the productid of items in cart
           const productid = cart.items.map((product)=>{
              return product.productId
            })
            
            // loop through the producid and change status
            for(i=0;i<productid.length;i++){
               const index = shipment.products.findIndex(product=>product._id==productid[i])
                
               const product = shipment.products[index]
               
               product.status = "Packing"

               product.trackingHistory.push(`Shipment has been paid for and ready for outbound ship out.Time: ${Date()}`)
              
               await shipment.save()
            }

            try {
                await sendMail({
                    email:user.email,
                    subject:"Thank you for your payment",
                    message:`your shipment ${cart.items} is being packed`
                })
            } catch (error) {
                console.log(error.message)
                return res.status(500).json({success:false,msg:"message could not be sent"})
            }

           
           
            
                
                
            
            //delete cart
             await Cart.findByIdAndDelete({_id: cart._id})
            return res.status(201).json({success:true,msg:"payment successful","flw_ref": reCallCharge.data.flw_ref,data:order})
        } else {
            res.status(400).send('payment failed')
        }
    }
    if( response.meta.authorization.mode === 'redirect') {

        let url = response.meta.authorization.redirect
        open(url)
    }

} else {
    return next(new ErrorResponse("no cart found"),404)
}

})

module.exports = checkout