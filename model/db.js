const { ObjectId } = require("mongodb");

require("dotenv").config()
const MongoClient = require("mongodb").MongoClient

const url = process.env.DATABASE_URL;
// const url = "mongodb://127.0.0.1:27017/aflozz";


const { decryption, encryption } = require("./crypto");

// const clint = new MongoClient(url)
const  clint= new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

const db = "aflozz"

async function connect() {

    try {

        await clint.connect()
        console.log("Connected successfully to MongoDB");
        return clint

    } catch (e) {
        console.log("err");
        console.log(e);
    }

}
// connect()
const db_user = clint.db(db).collection("user")
const db_admin = clint.db(db).collection("admin")
const db_product = clint.db(db).collection("products")
const db_order = clint.db(db).collection("order")
const db_category = clint.db(db).collection("category")
const db_otp = clint.db(db).collection("Otp")
const db_coupon = clint.db(db).collection("coupon")
const db_community = clint.db(db).collection("community")
const db_notification =clint.db(db).collection("notification")
const db_subscription =clint.db(db).collection("subscription")
const db_banner =clint.db(db).collection("banner")
module.exports = {
    db_banner,
    db_order,
    db_user,
    db_admin,
    db_product,
    db_category,
    db_otp,
    db_coupon,
    db_community,
    db_notification,
    db_subscription,
    connect,
}

// async function storeOtp(data) {

//     const nodemailer = require("./nodemailer")
//     const digits = '0123456789';
//     let OTP = '';
//     for (let i = 0; i < 4; i++) {
//         OTP += digits[Math.floor(Math.random() * 10)];
//     }
//     data.otp = OTP
//     console.log(data.otp);
//     console.log(data.Email);
//     await nodemailer.sendmail(data.user.Email, data.otp, data.Name)
//     return await db_otp.insertOne(data)

// }

// async function findOtp(params) {

//     const data = await db_otp.findOne({ otp: params })
//     await db_otp.deleteOne({ otp: params })
//     return data

// }


// // async function find_and(collection, value) {

// //     return await clint.db(db).collection(collection).findOne({ value })

// // }
// // --------------------------------------it's for user-------------------------------------------------

// // async function update_pass(Password, Email) {
// //     Password = encryption(Password)
// //     console.log(Password);
// //     return await db_user.updateOne({Email}, { $set:{ Password } })
// // }
// async function find_insert(data) {
//     try {
//         const Email = data.Email
//         const user = await db_user.find({ Email }).toArray()
//         if (user.length === 0) {
//             return true
//         } else {
//             throw "An account with this email already exists"
//         }
//     } catch (error) {
//         console.log(error);
//         throw error
//     }
// }
// async function insert_user(data) {
//     console.log(data.Password);
//     data.Password = encryption(data.Password)
//     console.log(data.Password);
//     data.status = true
//     return await db_user.insertOne(data)
// }
// async function find(data) {
//     try {
//         let Email = data.Email
//         let user = await db_user.findOne({ Email })
//         if (user) {
//             user.Password = decryption(user.Password)
//             console.log(user.Password);
//             if (user.Password === data.Password) {
//                 if (user.status === false) {
//                     throw { status: 404, err: "Email blocked" }
//                 }
//                 return user

//             } else {

//                 throw { status: 406, err: "password incorrect" }
//             }
//         } else {

//             throw { status: 404, err: "Email incorrect" }
//         }
//     } catch (err) {
//         console.log(err);
//         throw err

//     }



// }


// async function user_status(data) {
//     try {
//         if (data.status === "true") {
//             data.status = true
//         } else {
//             data.status = false
//         }
//         return await db_user.updateOne({ _id: new ObjectId(data._id) }, { $set: { status: data.status } })
//     } catch (errr) {
//         console.log(errr);
//         throw errr
//     }
// }
// async function findeOne_user(Email) {
//     try {

//         return await db_user.findOne({ Email })
//     } catch (errr) {
//         console.log(errr);
//         throw errr
//     }
// }
// async function all_user() {
//     return await db_user.find().toArray()
// }

// -----------------------------------this for admin ------------------------------------------------------------------
// async function admin_find(data) {

//     try {

//         let Email = data.Email

//         let admin = await db_admin.findOne({ Email })
//         console.log(admin)
//         if (admin) {
//             console.log(data.Password);
//             if (admin.Password === data.Password) {
//                 return admin
//             } else {

//                 throw { status: 406, err: "password incorrect" }
//             }
//         } else {

//             throw { status: 404, err: "Email incorrect" }
//         }
//     } catch (err) {
//         console.error(err)

//         throw err
//     }

// }
// -----------------------------------------this for products ----------------------------------------------------------------------------

// async function add_product(data) {
//     try {
//         return await db_product.insertOne(data)
//     } catch (errr) {
//         console.log(errr);
//         throw errr
//     }
// }
// async function find_product(data) {
//     try {
//         return await db_product.find({}).toArray()
//     } catch (errr) {
//         console.log(errr);
//         throw errr
//     }
// }
// async function ufind_product(data) {
//     try {
//         return await db_product.find({ $and: [{ stock: { $ne:"0"} }, { status: true }] }).toArray()
//     } catch (errr) {
//         console.log(errr);
//         throw errr
//     }
// }

// async function findOne_product(id) {
//     try {
//         return await db_product.findOne({ _id: new ObjectId(id) })
//     } catch (errr) {
//         console.log(errr);
//         throw errr
//     }
// }
// async function update_product(data) {
//     try {
//         const id = data.id
//         delete data._id
//         const image = data.image
//         delete data.image
//         console.log(id);
//         console.log(data);
//         console.log(image);
//         console.log(new ObjectId(id));
//        await db_product.updateOne({ _id: new ObjectId(id) }, { $set: data }).then(async e=>{

//             return await db_product.updateOne({ _id: new ObjectId(id) }, { $set: image })
//         })
//     } catch (errr) {
//         console.log(errr);
//         throw errr
//     }
// }
// async function delete_product(id) {
//     try {
//         return await db_product.deleteOne({ _id: new ObjectId(id) })
//     } catch (errr) {
//         console.log(errr);
//         throw errr
//     }
// }

// async function update_status(data) {

//     try {
//         if (data.status === "true") {
//             data.status = true
//         } else {
//             data.status = false
//         }
//         return await db_product.updateOne({ _id: new ObjectId(data._id) }, { $set: { status: data.status } })
//     } catch (errr) {
//         console.log(errr);
//         throw errr
//     }
// }
// async function update_product(id,data) {
//     try {

//         return await db_product.updateOne({_id: new ObjectId(id)},{$set:data})
//     } catch (errr) {
//         console.log(errr);
//         throw errr
//     }
// }
// --------------------------------------------------------this for category ------------------------------------
// async function delete_category(id) {
//     try {
//         return await db_category.deleteOne({ _id: new ObjectId(id) })
//     } catch (errr) {
//         console.log(errr);
//         throw errr
//     }
// }
// async function add_category(data) {
//     try {

//         const category = await db_category.findOne({ category: data.category })
//         if (!category) {

//             return await db_category.insertOne(data)

//         } else {
//             throw ("category alreody exists")

//         }
//     } catch (err) {
//         console.log(err);
//         throw err


//     }
// }
// async function find_category(p) {
//     return await db_category.find(p).toArray()
// }
// async function findOne_category(id) {
//     return await db_category.findOne({_id:new ObjectId(id)})
// }
// async function update_category(data) {
//     const _id = data.id
//     delete data.id 
//     return await db_category.updateOne({_id:new ObjectId(_id)},{$set:data})
// }

// async function find_category_is_true(d) {
//     return await db_category.find(d).toArray()
// }

// async function category_status(data) {
//     try {
//        data.status === "true"? data.status = true: data.status = false;
//         return await db_category.updateOne({ _id: new ObjectId(data._id) }, { $set: { status: data.status } })
//     } catch (errr) {
//         console.log(errr);
//         throw errr
//     }
// }

// async function ufind_category(data) {
//     try {
//         return await db_category.find().toArray()
//     } catch (errr) {
//         console.log(errr);
//         throw errr
//     }
// }



