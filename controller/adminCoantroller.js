const webpush = require('web-push');
const db = require("../model/adminModel");
const userModel = require("../model/userModel");
const { db_notification } = require('../model/db');
// const {userSockets} = require("./userCantroller")
const logger = require("../model/winstonLogger").adminLogger

const vapidKeys = {
    publicKey: process.env.webPush_publicKey,
    privateKey: process.env.webPush_privatekey
};

webpush.setVapidDetails(
    'mailto:manuamjed32@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);
module.exports = {
    getSales: (req, res) => {
        try {

            res.render("admin/salesReport", { layout: 'admin/layout' })
        } catch (error) {
            console.log(error)
            logger.error(error)

            return res.status(500).render("500", { layout: "login/layout" })
        }

    },
    notification: async (req, res) => {
        try {
            const data = await db.getNotification()
            console.log(data);
            res.render("admin/notification", { layout: 'admin/layout', data })
        } catch (error) {
            logger.error(error)
            console.log(error)
            return res.status(500).render("500", { layout: "login/layout" })
        }

    },
    returnOrder: async (req, res) => {
        try {
            const orders = await db.getReturnOrders()
            const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
            orders.forEach(i => { i.date = new Date(i.date).toLocaleDateString('en-US', options) });
            orders.forEach(i => { i.status.forEach(i => { i.date = new Date(i.date).toLocaleDateString('en-US', options) }) });
            console.log(orders[0]?.status[0]?.date);
            res.render("admin/orderReturn", { layout: 'admin/layout', orders })
        } catch (error) {
            logger.error(error)

            return res.status(500).render("500", { layout: "login/layout" })
        }

    },
    postCoupon: async (req, res) => {
        try {
            console.log(req.body);
            console.log(req.body.exDate);
            console.log(new Date(req.body.exDate));
            req.body.exDate = new Date(req.body.exDate)
            req.body.Limit = Number(req.body.Limit)
            await db.newCoupon(req.body)
            res.redirect("/admin/coupon")
        } catch (error) {
            logger.error(error)

            return res.status(500).render("500", { layout: "login/layout" })
        }

    },
    coupon: async (req, res) => {
        try {
            const coupon = await db.getCoupons()
            res.render("admin/coupon", { layout: "admin/layout", coupon })
        } catch (error) {
            logger.error(error)

            return res.status(500).render("500", { layout: "login/layout" })
        }


    },
    updateOrder: async (req, res) => {
        try {
            const id = req.params.id
            const data = req.body
            console.log(data);
            data.date = new Date()
            const data2 = await userModel.updateOrderStatus(id, data)
            console.log(data2);
            res.redirect("/admin/orders/" + id)
            const io = require("../model/socket")
            const userId = data2.value.user_id.toString()
            console.log("--------------------------");
            const userIO = io.userSockets.get(userId)
            userIO?.emit("status", { orderID: data2.value._id, status: data2.value.status.length })
            console.log("--------------------------"+data2.value.status.length);
            
            if(data2.value.status.length>1){
                const notificationPayload = {
                    title:  'Your Order has been Delivered!',
                    body: "Great news! Your order has been successfully delivered. Thank you for shopping with us!",
                    icon: '/image/logo.png', // Use an icon that represents the offer.
                    badge: '/image/logo.png', // You can use the same logo as the badge.
                    image: "/image/notification/1702307891551NaNExperience_Excellence_in_Delivery_with_Costemar.jpg",
                    sound: '/interface-124464.mp3',
                    actions: [
                        {
                            action: "action-1",
                            title: 'View Offer', // Action button to view the offer details.
    
                        },
                        {
                            action: 'action-2',
                            title: 'Dismiss', // Action button to dismiss the notification.
                        },
                    ],
                    data: {
                        customKey:"",
                        link: "https://aflozz.shop/account/orders"
                    },
                };

                const data = await  db.UserSubscription(req.session.user._id)
                data.forEach(data=>{
                    webpush.sendNotification(data, JSON.stringify(notificationPayload)).then(() => {
                        console.log('Notification sent successfully to:');
                    }).catch((error) => {
                        console.error('Error sending notification to', error);
                    });
                })



                // 
            }
        } catch (error) {
            logger.error(error)
            return res.status(500).render("500", { layout: "login/layout" })
        }


        //    const userId = data2.userId
        //    const socket = userSockets.get(userId)
        //    console.log(socket);
    },
    updateReturnOrder: async (req, res) => {
        try {
            const id = req.params.id
            const data = req.body
            console.log(data);
            data.date = new Date()
            const data2 = await userModel.updateReturnOrder(id, data)
            console.log(data2);
            res.redirect("/admin/orders")
            const io = require("../model/socket")
            const userId = data2.value.user_id.toString()
            console.log("--------------------------");
            const userIO = io.userSockets.get(userId)
            userIO?.emit("status", { orderID: data2.value._id, status: data2.value.status.length })
            console.log("--------------------------");

        } catch (error) {
            logger.error(error)

            return res.status(500).render("500", { layout: "login/layout" })
        }

        //    const userId = data2.userId
        //    const socket = userSockets.get(userId)
        //    console.log(socket);
    },
    orderD: async (req, res) => {
        try {
            const id = req.params.id
            const data = await userModel.orderDetails(id)
            const products = await userModel.orderProduct(id)
            data.status = data.status
            res.render("admin/orderDitel", { layout: 'admin/layout', products, data })
        } catch (error) {
            logger.error(error)
            return res.status(500).render("500", { layout: "login/layout" })
        }


    },

    getOrder: async (req, res) => {
        try {
            const orders = await db.getOrders()
            const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
            orders.forEach(i => { i.date = new Date(i.date).toLocaleDateString('en-US', options) });
            orders.forEach(i => { i.status.forEach(i => { i.date = new Date(i.date).toLocaleDateString('en-US', options) }) });
            res.render("admin/order", { layout: 'admin/layout', orders })
        } catch (error) {
            logger.error(error)
            return res.status(500).render("500", { layout: "login/layout" })
        }

    },

    salesReport: async (req, res) => {
        try {
            const { start, end, method } = req.body
            const data = await db.weekReport(start, end, method)
            res.json(data)
        } catch (error) {
            logger.error(error)
            return res.status(500).render("500", { layout: "login/layout" })
        }

    },
    getAdmin: async (req, res) => {
        try {
            
            const yearlyOrders = await db.totalSales()
            const OneDay = await db.OneDay()
            const chart = await db.Report()
            res.render("admin/admin", { layout: 'admin/layout', yearlyOrders: yearlyOrders[0], OneDay: OneDay[0], chart })
        } catch (error) {
            logger.error(error)
            return res.status(500).render("500", { layout: "login/layout" })
        }

    },
    getLogin: (req, res) => {
        try {
            res.render("admin/login", { layout: 'login/layout-log' })
        } catch (error) {
            logger.error(error)
            return res.status(500).render("500", { layout: "login/layout" })
        }

        // res.render("admin/addproduct", { layout: 'admin/layout' })
    },
    postLogin: (req, res) => {
        try {
            let admin = req.body

            db.admin_find(admin).then(data => {
               
                req.session.admin = data
                const url = req.session?.adminUrl?req.session.adminUrl:"/admin"
                console.log(url)
                res.status(200).json("/admin"+url)
            }).catch(err => {
                console.log(err.err);
                res.status(err.status).json(err.err)
            })

        } catch (error) {
            logger.error(error)
            return res.status(500).render("500", { layout: "login/layout" })
        }

    },
    send: async (req, res) => {
        try {
           

            const body = req.body
            body.date = new Date()
        
            const { notification } = require("../app")
            await db_notification.insertOne(body)
            const notificationPayload = {
                title: body.title,
                body: body.body,
                icon: '/image/logo.png', // Use an icon that represents the offer.
                badge: '/image/logo.png', // You can use the same logo as the badge.
                image: "/image/notification/" + body.image,
                sound: '/interface-124464.mp3',
                actions: [
                    {
                        action: "action-1",
                        title: 'View Offer', // Action button to view the offer details.

                    },
                    {
                        action: 'action-2',
                        title: 'Dismiss', // Action button to dismiss the notification.
                    },
                ],
                data: {
                    customKey: body.details,
                    link: body.link
                },
            };
       
            notification(notificationPayload)
            const data = await db.subscription()

            res.redirect("/admin/notification")
            data.forEach(data=>{
                webpush.sendNotification(data, JSON.stringify(notificationPayload)).then(() => {
                }).catch((error) => {
                    logger.error(error);
                });
            })
        } catch (error) {
            logger.error(error)
            return res.status(500).render("500", { layout: "login/layout" })
        }

    },
    banner: async (req, res) => {
        try {
        
            req.body.date = new Date()
            req.body.status = true
            await db.createBanner(req.body)
            res.redirect("/admin/banner")
        } catch (error) {
            logger.error(error)
            return res.status(500).render("500", { layout: "login/layout" })
        }

    },
    getBanner: async (req, res) => {
        try {
            const data = await db.findBanner()
            res.render("admin/banner", { layout: "admin/layout", data })
        } catch (error) {
            logger.error(error)
            return res.status(500).render("500", { layout: "login/layout" })
        }

    }

}