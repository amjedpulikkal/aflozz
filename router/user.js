const express = require("express")
const router = express.Router()
const db = require("../model/db")
const jwt = require("../model/JWT")
const nocache = require("nocache")
const { ifuser, nouser } = require("../model/aouth")
const userController = require("../controller/userCantroller")




router.get("/",ifuser,userController.getHome) 
router.route("/login").get(nouser,userController.getlogin).post(nouser,userController.psotLgin)
router.get("/category", ifuser,userController.goetCategory)
router.get("/product/:id", ifuser,userController.getProduct)
router.post("/signup", nouser,userController.postSignup)
router.post("/signup-otp", nouser,userController.psotSingOtp)
router.post("/one-time-password-varify", nouser,userController.postOtp)
router.route("/forgot/password").get(nouser, userController.getForgotpassword).post(nouser,userController.postforgot)
router.get("/forgot/password/:link", nouser, userController.getForgotpasswordWithLink)
router.post("/reste/password/", nouser, userController.psotResatPassword)
router.post("/logout", ifuser,userController.logout)

router.get("/cart",ifuser,userController.getCart)
router.post("/cart/:id",ifuser,userController.addToCart)
router.get("/cart/remove/:id",ifuser,userController.cartRemove)
router.post("/cart",ifuser,userController.incresCart)
router.get("/cart/address",ifuser,userController.address)
// router.post("/wallat",ifuser,userController.wallet)


router.get("/account/profile",ifuser,userController.profil)
router.post("/address",ifuser,userController.newAdress)
router.get("/account/orders",ifuser,userController.order)
router.get("/account/orders/details/:id",ifuser,userController.orderDetails)
router.get("/address/remove/:index",ifuser,userController.addressRemove)


router.post("/change/password",ifuser,userController.changePassword)
router.post("/change/profil",ifuser,userController.changeProfil)

router.get("/address/edit/:id",ifuser,userController.editAddress)
router.get("/new-address",ifuser,userController.newAddress)
router.post("/new-order",ifuser,userController.newOrder)
router.get("/order/cancel/:id",ifuser,userController.cancelOrder)
router.post("/order/return/:id",ifuser,userController.returnOrder)
router.get("/account",ifuser,userController.getAccount)
router.route("/search").get(ifuser,userController.search).post(ifuser,userController.postSearch)


router.post("/subscribe",ifuser,userController.webPush)
router.post("/checkSubscribe",ifuser,userController.checkWebPush)
router.post("/unsubscribe",ifuser,userController.unsubscribe)


// router.get("/socket/status",ifuser,userController.orderStatus)

router.post("/online-payment-createid",ifuser,userController.onlinePayment)

router.get("/promo/:code",ifuser,userController.couponCode)

router.route("/chat").get(ifuser,userController.chat).post(ifuser,userController.sendMassage)
// router.get("/re")




// router.post('/subscribe', (req, res) => {
//     const subscription = req.body;
//     console.log(subscription);
//      subscription = 

//     subscriptions.push(subscription);

//     // You can save the subscription in a database for later use
//     console.log("Subscription successfully")
//     res.status(201).json({ message: 'Subscription added successfully' });
// });
// router.get("/not",(req,res)=>res.render("push",{layout: "user/layout" ,titel:"df"}))
// router.get('/send-notification', (req, res) => {
//     const notificationPayload = {
//         data: {
//             title: 'New Notification',
//             body: 'This is a push notification from your server!',
//             icon: 'your-icon-url',
//         },
//     };

//     Promise.all(subscriptions.map(subscription =>
//         webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
//     ))
//         .then(() => {
//             console.log('Push notifications sent successfully.');
//             res.status(200).json({ message: 'Push notifications sent successfully' });
//         })
//         .catch(error => {
//             console.error('Error sending push notifications:', error);
//             res.status(500).json({ error: 'Error sending push notifications' });
//         });
// });



module.exports = router





