
const { v4: uuidv4 } = require('uuid');
const jwt = require("../model/JWT")
const userModel = require("../model/userModel")
const productModel = require("../model/productModel")
const { sendmailForPassword } = require("../model/nodemailer")
const Razorpay = require("razorpay")
const { db_coupon, db_user, db_order, db_otp, db_product, db_subscription } = require("../model/db")
const { ObjectId } = require("mongodb");
const categoryModel = require('../model/categoryModel');
const logger = require("../model/winstonLogger").userLogger
require("dotenv").config()

function generateUniqueID() {
  const timestamp = Date.now().toString();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return timestamp.slice(-3) + randomNum.toString().slice(-3);
}
function generectCoupon() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let coupon = ""
  for (let i = 0; i < 7; i++) {

    const Index = Math.floor(Math.random() * letters.length)
    console.log(Index);
    coupon += letters.charAt(Index)
  }
  return coupon
}
module.exports = {
  getHome: async (req, res) => { // Code for handling home route

    try {
      const limit = parseInt(req.query.limit) || 0

      const { products, totalproduct } = await productModel.ufind_product(limit)
      const banner = await userModel.bannser()

      const newUser = req.session.newUser
      req.session.newUser = null
      res.render("user/home", { layout: "user/layout", products, titel: "Aflozz", cartLength: req.session.user.cart.length, user: req.session.user, totalproduct, limit, banner, newUser })
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }
  },
  getlogin: (req, res) => { // Code for rendering login page
    try {

      res.render("login/sign-login", { layout: "login/layout-log" })
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }
  },
  psotLgin: async (req, res) => {
    // Code for user login
    try {
      const data = req.body;
      userModel.find(data).then(data => {

        req.session.user = data
        res.status(200).json()
      }).catch(err => {

        res.status(err.status).json(err.err)
      })
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }
  },
  getProduct: async (req, res) => {// Code for getting a specific product

    try {

      const id = req.params.id
      const product = await productModel.findOne_product(id)
      res.render("user/products", { layout: "user/layout", product, titel: "Aflozz", cartLength: req.session.user.cart.length, user: req.session.user })
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }
  },
  goetCategory: async (req, res) => { // Code for getting categories
    // const category = await userModel.ufind_category() || []
    try {

      res.render("user/category", { layout: "user/layout", category })
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }
  },
  postSignup: async (req, res, next) => {
    try {
      const data = req.body
      data.status = true
      userModel.find_insert(data).then(data => {
        res.status(200).send("ok")
      }).catch(err => {
        console.log(err.message)
        res.status(409).json({ err })
      })
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  psotSingOtp: async (req, res, next) => {
    try {

      const data = req.body
      await userModel.storeOtp({ user: data, ex_date: new Date(new Date().getTime() + 2 * 60000) })
      res.render("login/onetime", { Email: data.Email, layout: "login/layout" })

    } catch (error) {
      logger.error(error)

      return res.status(500).render("500", { layout: "login/layout" })

    }

  },
  postOtp: async (req, res, next) => { // Logic to verify OTP for signup
    try {
      const data = req.body


      const userData = await userModel.findOtp(data.Otp)

      if (userData) {
        if (new Date() < userData.ex_date) {
          if (userData.otp === data.Otp) {
            if (userData.user.referral) {
              let data = await userModel.claimReferral(userData.user.referral)

              data.value ? userData.user.wallet = 100 : userData.user.wallet = 0
              req.session.newUser = true
            }
            userData.user.referral = generectCoupon()

            await userModel.insert_user(userData.user)
            req.session.user = userData.user
            res.redirect("/")
          } else {
            res.status(404).json("invalid OTP")
          }
        } else {
          res.status(404).json("invalid OTP")
        }
      } else {
        res.status(404).json("invalid OTP")
      }


    } catch (error) {
      logger.error(error)

      return res.status(500).render("500", { layout: "login/layout" })

    }

  },
  getForgotpassword: async (req, res, next) => { // Handles forgot password functionality
    // res.render("login/forgot", {layout: "login/layout-log"})
    try {
      res.render("login/email", { layout: "login/layout-log" })
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  postforgot: async (req, res, next) => { // Renders forgot password with link page
    // res.render("login/forgot", {layout: "login/layout-log"})
    try {
      const user = await userModel.findeOne_user(req.body.Email)

      if (user) {

        await sendmailForPassword(user.Email, user.Name, user._id)
        res.status(200).json("send")
      } else {
        res.status(409).json()

      }
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }


  },
  // Renders forgot password with link page
  getForgotpasswordWithLink: async (req, res, next) => {
    try {
      const token = jwt.varifyction(req.params.link)
      if (token) {
        res.render("login/forgot", { layout: "login/layout-log", Email: token.data.Email })
      } else {
        res.redirect("/")
      }
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },

  psotResatPassword: async (req, res, next) => {  // Handles resetting password
    try {
      const { Email, Password } = req.body

      await userModel.update_pass(Password, Email)
      res.status(200).json()
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },

  logout: async (req, res) => { // Logs out the user
    try {

      req.session.user = null
      res.redirect("/")
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  getAll: async (req, res) => {
    try {
      const user = await userModel.all_user()
      res.render("admin/user_list", { layout: 'admin/layout', user })
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  block: async (req, res) => { // Blocks user
    try {


      userModel.user_status(req.query).then(d => {

        res.redirect("/admin/all-user")
      }).catch(err => {
        return res.status(500).json({ message: 'Internal server error' });
      })
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  getCart: async (req, res) => { // Retrieves user's cart
    try {
      const products = await userModel.findCart(req.session.user._id)
      console.log(products);
      if (products) {
        const data = await userModel.getAmount(req.session.user._id)
        res.render("user/cart", { layout: "user/layout", titel: "Aflozz-cart", products, price: data, cartLength: req.session.user.cart.length, user: req.session.user })
      } else {

        res.render("user/cart-empty", { layout: "user/layout", titel: "Aflozz-cart", cartLength: req.session.user.cart.length, user: req.session.user })
      }
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  addToCart: async (req, res) => {
    try {
      const id = req.params.id
      const user_id = req.session.user._id

      await userModel.addTocart(user_id, id)
      res.status(200).json({ cartLength: req.session.user.cart.length + 1 })
    } catch (err) {
      res.status(400).json()
    }
  },
  cartRemove: async (req, res) => {  // Removes a product from the user's cart
    try {
      console.log(req.params)
      const data = await userModel.cartRemove(req.session.user._id, req.params.id)

      console.log(data);
      // res.redirect("/cart")
      res.status(200).json({ cartLength: req.session.user.cart.lengtgh - data.modifiedCount })

    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  incresCart: async (req, res) => {// Increases quantity of a product in the cart
    try {
      const { id, quantity } = req.body
      const user_id = req.session.user._id

      await userModel.addTocart(user_id, id, quantity).catch(err => {

        res.status(400).json(err)
      })
      res.status(200).json("")
    } catch (err) {


      res.status(400).json(err)
    }
  },
  address: async (req, res) => {// Retrieves user's addresses for checkout
    try {
      const address = req.session.user.address
      const Coupons = await userModel.getUserCoupon(req.session.user._id)

      const price = await userModel.getAmount(req.session.user._id)
      res.render("user/address", { layout: "user/layout", titel: "Aflozz-cart", price, address, cartLength: req.session.user.cart.length, coupon: req.session?.coupon, user: req.session.user, Coupons })
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  order: async (req, res) => { // Places a new order
    try {
      // console.log(new Date().getTime);
      // let items = await db_product.find().toArray()
      // let c =0
      // for (let i = 0; i < items.length; i++) {
      //   setTimeout(async ()=>{
      //     let no = generateUniqueID()
      //     await db_product.updateOne({_id:new ObjectId(items[i]._id)},{ $set:{no}})
      //     c++
      //     console.log(c);
      //   },1000)
      // }
      // console.log(new Date().getTime);
      const orders = await userModel.getOrders(req.session.user._id)
      const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
      orders.forEach(i => { i.date = new Date(i.date).toLocaleDateString('en-US', options) });
      orders.forEach(i => { i.status.forEach(i => { i.date = new Date(i.date).toLocaleDateString('en-US', options) }) });
      res.render("user/account/order", { layout: "user/layout", titel: "Aflozz-cart", selection: "order", orders, user: req.session.user, cartLength: req.session.user.cart.length, user: req.session.user })
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  newOrder: async (req, res) => {
    try {
      console.log(req.body)
      const id = req.session.user._id
      const data = {}
      const index = Number(req.body.index)
      data.no = generateUniqueID()
      data.address = await userModel.orderAddres(id, index)
      data.status = [{ date: new Date() }]
      data.price = await userModel.getAmount(id)
      data.products = req.session.user.cart
      data.totalMRP = req.body.totalMRP
      data.paymentType = req.body.paymentType
      console.log("---------------------------------------------------------------")
      if (req.body.wallet) {
        console.log("---------------wallet------------------------------------------------");
        if (data.price < req.session.user?.wallet) {
          console.log("resssssssssswalletssssssssssssssssssssss");
          console.log(req.session.user?.wallet)
          console.log(data.price)
          console.log(req.session.user?.wallet - data.price)
          const remaining = req.session.user?.wallet - data.price
          console.log(data.price)
          await userModel.wallet(req.session.user._id, remaining)

        } else {
          console.log("wwwwwwwwwwwwalletwwwwwsssssss");
          data.price -= req.session.user?.wallet
          await userModel.wallet(req.session.user._id, 0)
        }
      }
      console.log("----------------end-----------------------------------------------");

      if (req.session.coupon) {
        const discount = await userModel.claimCoupon(req.session.coupon?._id, req.session.user._id)
        if (discount?.value >= req.body.price) {
          console.log(discount);
          data.price -= discount?.value || 0
        }
      }
      req.session.coupon = null
      console.log(data.price);
      // await productModel.degress(data.products)
      await userModel.newOrder(id, data)
      await userModel.removeCart(id)
      res.status(200).json("ok")
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  getAccount: async (req, res) => {
    try {
      const address = req.session.user.address
      res.render("user/account/address", { layout: "user/layout", titel: "Aflozz-Account", selection: "address", address, user: req.session.user, cartLength: req.session.user.cart.length, user: req.session.user })
    } catch (error) {
      console.log(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  newAdress: async (req, res) => {
    try {
      const user_id = req.session.user._id
      const body = req.body
      console.log(body);
      await userModel.newAdress(user_id, body)
      res.status(200).json("ok")
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  orderDetails: async (req, res) => {
    try {
      const id = req.params.id
      console.log(id)
      console.log(ObjectId.isValid(id))
      console.log("dfd---");
      const orders = await userModel.orderDetails(id)
      console.log("dfd");
      const products = await userModel.orderProduct(id)
      console.log("_________");
      const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
      orders.status.forEach(i => { i.date = new Date(i.date).toLocaleDateString('en-US', options) })
      console.log(orders);
      console.log(products);
      res.render("user/account/order-items", { layout: "user/layout", titel: "Aflozz-Account", selection: "order", data: orders, products, user: req.session.user, cartLength: req.session.user.cart.length, user: req.session.user })
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  addressRemove: async (req, res) => {
    try {
      await userModel.removeAddress(req.session.user._id, req.params.index)
      res.redirect("/account")
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  profil: async (req, res) => {

    try {

      res.render("user/account/profile", { layout: "user/layout", titel: "Aflozz-Account", selection: "profil", user: req.session.user, cartLength: req.session.user.cart.length, user: req.session.user })
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  cancelOrder: async (req, res) => {
    try {
      const id = req.params.id
      console.log(id);
      console.log("---------------------------------------------");
      await userModel.cancelOrder(id, req.session.user._id)
      console.log("---------------------------------------------");
      res.status(200).json("ok")
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },


  changePassword: async (req, res) => {
    try {
      const id = req.session.user._id
      const data = req.body
      console.log(data);
      await userModel.changePassword(id, data).then(data => {

        res.status(200).json()
      }).catch(err => {
        console.log("Password is incorrect");
        res.status(400).json(err)
      })
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  newAddress: async (req, res) => {
    try {


      res.render("user/newAddress", { layout: "user/layout", titel: "Aflozz-Account", data: null, cartLength: req.session.user.cart.length, user: req.session.user })
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  editAddress: async (req, res) => {
    try {
      const index = req.params.id
      const data = await userModel.findaddress(req.session.user._id, index)
      console.log(data);
      res.render("user/newAddress", { layout: "user/layout", titel: "Aflozz-Account", data, cartLength: req.session.user.cart.length, user: req.session.user })
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  onlinePayment: async (req, res) => {
    try {
      console.log(req.body);
      if (ObjectId.isValid(req.body.discountID)) {
        const discount = await db_coupon.findOne({ _id: new ObjectId(req.body.discountID) })

        if (discount?.value <= req.body.price) {
          console.log(discount);
          req.body.price -= discount?.value || 0
        }
      }
      if (req.body.wallet) {
        if (req.body.wallet < req.session.user?.wallet) {
          req.body.price -= req.session.user?.wallet
        }
      }
      console.log(req.body);

      const instance = new Razorpay({
        key_id: process.env.key_id,
        key_secret: process.env.key_secret
      })
      const options = {
        amount: Number(req.body.price) * 100,
        currency: "INR",
        receipt: "order_rcptid_11"
      };

      console.log(req.body.price);
      const id = await instance.orders.create(options)
      console.log(id);
      res.status(200).json({ orderId: id })
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }



  },
  couponCode: async (req, res) => {
    try {
      const code = req.params.code
      const coupon = await userModel.findCoupon(code, req.session.user._id)
      console.log("coupon");
      console.log(coupon);
      if (coupon?.value) {
        req.session.coupon = coupon
        res.json(coupon)
      } else {
        res.json(false)
      }
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  chat: async (req, res) => {
    try {
      console.log(req.query);

      const product = ObjectId.isValid(req.query.id) ? await productModel.findOne_product(req.query.id) : null
      console.log(product);
      const message = await userModel.getMessage()
      res.render("user/chat", { layout: "user/layout", titel: "chat", message, cartLength: req.session.user.cart.length, user: req.session.user, product })
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  sendMassage: async (req, res) => {
    try {
      console.log("-------------------");
      console.log(req.body);
      console.log("-------------------");
      await userModel.addMessage(req.session.user._id, req.body)

      res.json("ok")
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  returnOrder: async (req, res) => {
    try {
      const id = req.params.id
      // const Reason = req.body.Reason
      console.log(req.body.Reason);
      await userModel.returnOrder(id, req.body, req.session.user._id)
      res.status(200).json("")
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  webPush: async (req, res) => {
    try {
      const {subscription,method} = req.body
      console.log(method);
      subscription.type = method 
      console.log(subscription)
      await userModel.webPush(req.session.user._id, subscription)
      res.status(200).json("")
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  search: async (req, res) => {
    try {

      const limit = parseInt(req.query.limit) || 0
      console.log(req.query)
      const category = await categoryModel.ufind_category()
      const { products, totalproduct } = await productModel.ufind_product(limit)
      res.render("user/search", { layout: "user/layout", titel: "Aflozz-Account", user: req.session.user, cartLength: req.session.user.cart.length, user: req.session.user, products, category })

    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }


  },
  postSearch: async (req, res) => {
    try {
      const query = req.query.query
      const category = req.body.categoryArray
      const size = req.body.size
      console.log(req.body);
      const products = await productModel.search(query,category,size)
      console.log(products.length);
      res.json(products)
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  updateImage: async (req, res) => {
    try {
      
      console.log(req.file)

    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  changeProfil: async (req, res) => {
    try {
      const data = req.body
      console.log(data);
      await db_user.updateOne({ _id: new ObjectId(req.session.user._id) }, { $set: data })
      res.redirect("/account/profile")
    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }

  },
  checkWebPush:async (req, res) => {
    try{
     const data = await db_subscription.findOne({"webPush.endpoint":req.body.subscribe,userId:new ObjectId(req.session.user._id)})
     res.status(200).json(data)

    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }
  },
  unsubscribe:async (req, res) => {
    try{
     const data = await db_subscription.deleteOne({"webPush.endpoint":req.body.subscribe})
     res.status(200).json(data)

    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }
  },
  walletHistory:async (req, res) => {
    try{
     
      res.render("user/account/history", { layout: "user/layout", titel: "Aflozz-Account", selection: "profile", user: req.session.user, cartLength: req.session.user.cart.length, user: req.session.user })

    } catch (error) {
      logger.error(error)
      return res.status(500).render("500", { layout: "login/layout" })
    }
  }

}