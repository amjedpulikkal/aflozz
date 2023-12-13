const { ObjectId } = require("mongodb");
const { db_user, db_order, db_product, db_otp, db_coupon, db_community, db_notification, db_subscription, db_banner, db_category } = require("./db");
const { decryption, encryption } = require("./crypto");

// Other required modules and dependencies

module.exports = {
    async bannser() {
        return await db_banner.find().toArray()
    },
    async returnOrder(id, data, userId) {
        data.date = new Date()
        // return await db_order.updateOne({_id:new ObjectId(id)},})
        const product = await db_order.findOneAndUpdate({ _id: new ObjectId(id) }, { $push: { return: data } })

        console.log(product.value);
        if (product.return >= 1) {
            await db_user.updateOne({ _id: new ObjectId(userId) }, { $set: { wallet: product.value.totalMRP } })
        }
        return product
    },
    async getMessage(data) {
        return await db_community.find().sort({ 'data.date': -1 }).limit(5).toArray()
    },
    async addMessage(id, data) {
        data.date = new Date()
        return await db_community.insertOne({ userId: new ObjectId(id), data })
    },
    async findCoupon(code, userId) {
        console.log(code);
        return await db_coupon.findOne({ code, Limit: { $gt: 0 }, user: { $not: { $elemMatch: { $eq: new ObjectId(userId) } } }, exDate: { $gte: new Date() } })
    },
    async claimCoupon(id, userId) {
        return await db_coupon.findOneAndUpdate({ _id: new ObjectId(id), Limit: { $gt: 0 }, user: { $not: { $elemMatch: { $eq: new ObjectId(userId) } } }, exDate: { $gte: new Date() } }, { $inc: { Limit: -1 }, $push: { user: new ObjectId(userId) } })
    },
    async updataUserPresence(id, presence) {
        console.log(presence);
        console.log(id)
        return await db_user.updateOne({ _id: new ObjectId(id) }, { $set: { presence } })
    },
    async checkUserPresence(id) {
        return await db_user.findOne({ _id: new ObjectId(id), presence: "online" })
    },
    async findaddress(id, index) {
        const user = await db_user.findOne({ _id: new ObjectId(id) })
        return user.address[index]
    },
    async changePassword(id, data) {


        const userData = await db_user.findOne({ _id: new ObjectId(id) })
        const password = decryption(userData.Password)
        console.log(password);
        console.log(data.oldPassword);
        if (password === data.oldPassword) {
            const Password = encryption(data.Password)
            return await db_user.updateOne({ _id: new ObjectId(id) }, { $set: { Password } })
        } else {

            throw "Password is incorrect"
        }


    },
    async cancelOrder(id, userId) {

        const product = await db_order.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { cancel: true } })

        console.log(product.value);

        if (['online', 'wallet'].includes(product.value.paymentType)) {
            console.log("yessssssssssssssssssssssssssss ");
            const re = await db_user.updateOne({ _id: new ObjectId(userId) }, { $inc: { wallet: product.value.price } })
            console.log(re)
        }
        product.value.products.forEach(async (element) => {
            const n = element.quantity
            await db_product.updateOne({ _id: element._id }, { $inc: { stock: n } })
        });
        return product
    },
    // async orderReturn(id) {

    //     const product = await db_order.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { return: true } })
    //     console.log(product.value);

    //         await db_user.updateOne({_id:new ObjectId(userId)},{$set:{wallet:product.value.totalMRP}})

    //     // product.value.products.forEach(async (element) => {
    //     //     const n = element.quantity
    //     //     await db_product.updateOne({ _id: element._id }, { $inc: { stock: n } })
    //     // });
    //     return product
    // },
    async removeAddress(id, index) {
        await db_user.updateOne({ _id: new ObjectId(id) }, { $unset: { [`address.${index}`]: 1 } })
        await db_user.updateOne({ _id: new ObjectId(id) }, { $pull: { address: null } })
        return null

    },
    async updateOrderStatus(id, data) {

        return await db_order.findOneAndUpdate({ _id: new ObjectId(id) }, { $push: { status: data } })
    },
    async updateReturnOrder(id, data) {

        return await db_order.findOneAndUpdate({ _id: new ObjectId(id) }, { $push: { return: data } })
    },
    async orderDetails(id) {
        return await db_order.findOne({ _id: new ObjectId(id) })
    },
    async orderProduct(id) {
        console.log(ObjectId.isValid(id))
        const order = await db_order.aggregate([
            {
                $match: {
                    "_id": new ObjectId(id)
                }
            },
            {
                $unwind: "$products"
            },
            {
                $lookup: {
                    from: "products",
                    localField: "products._id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $unwind: "$product"
            },
            {
                $group: {
                    _id: "$_id",
                    products: {
                        $push: {
                            _id: "$product._id",
                            name: "$product.name",
                            brand: "$product.brand",
                            price: "$product.price",
                            discount: "$product.discount",
                            quantity: "$products.quantity",
                            image: "$product.image"
                        }
                    }
                }
            }]).toArray()
        // console.log(order[0].products);

        return order[0]?.products

    }
    ,
    async getOrders(id) {

        return await db_order.find({ user_id: new ObjectId(id) }).sort({ date: -1 }).toArray()

    },

    async removeCart(id) {
        return await db_user.updateOne({ _id: new ObjectId(id) }, { $set: { cart: [] } })
    }
    ,
    async orderAddres(id, index) {
        const address = db_user.aggregate([
            { $match: { _id: new ObjectId(id) } },
            {
                $project: {
                    valueAtIndex2: { $arrayElemAt: ["$address", index] }
                }
            }
        ]).toArray()
        return address

    },
    async getAmount(id) {
        const user = await db_user.aggregate([
            {
                $match: { "_id": id }
            },
            {
                $unwind: "$cart"
            },
            {
                $lookup: {
                    from: "products",
                    localField: "cart._id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $unwind: "$product"
            },
            {
                $lookup: {
                    from: "category",
                    localField: "product.category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: { path: "$category", preserveNullAndEmptyArrays: true }
            },
            {
                $addFields: {
                    "product.discountToApply": {
                        $cond: [
                            { $gt: ["$product.discount", "$category.offer"] }, // Check if product offer is greater
                            "$product.discount", // Use product offer
                            "$category.offer" // Use category offer
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    totalCartPrice: {
                        $sum: {
                            $multiply: [
                                {
                                    $subtract: [
                                        "$product.price",
                                        { $multiply: ["$product.price", { $divide: ["$product.discountToApply", 100] }] }
                                    ]
                                },
                                "$cart.quantity"
                            ]
                        }
                    }
                }
            }
        ]).toArray()
        // const user = await db_user.aggregate([
        //     {
        //         $match: {
        //             "_id": new ObjectId(id)
        //         }
        //     },
        //     {
        //         $unwind: "$cart"
        //     },
        //     {
        //         $lookup: {
        //             from: "products",
        //             localField: "cart._id",
        //             foreignField: "_id",
        //             as: "product"
        //         }
        //     },
        //     {
        //         $unwind: "$product"
        //     },
        //     {
        //         $group: {
        //             _id: "$_id",
        //             cart: {
        //                 $push: {
        //                     _id: "$product._id",
        //                     price: "$product.price",
        //                     discount: "$product.discount",
        //                     quantity: "$cart.quantity"
        //                 }
        //             }
        //         }
        //     },
        //     {
        //         $project: {
        //             totalCartPrice: {
        //                 $sum: {
        //                     $map: {
        //                         input: "$cart",
        //                         as: "item",
        //                         in: {
        //                             $multiply: [
        //                                 {
        //                                     $subtract: ["$$item.price", { $multiply: ["$$item.price", { $divide: ["$$item.discount", 100] }] }]
        //                                 },
        //                                 "$$item.quantity"
        //                             ]
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // ]).toArray()


        // Access the total discounted MRP from the aggregation result
        const totalDiscountedMRP = user[0]?.totalCartPrice;

        console.log(totalDiscountedMRP);
        return totalDiscountedMRP
    },
    async newAdress(id, data) {
        return await db_user.updateOne({ _id: new ObjectId(id) }, { $push: { address: data } })
    },
    async newOrder(user_id, data) {
        data.date = new Date()
        data.user_id = new ObjectId(user_id)
        console.log(data.products);
        data.products.forEach(async (element) => {
            const n = element.quantity
            await db_product.updateOne({ _id: element._id }, { $inc: { stock: -n } })
        });
        return await db_order.insertOne(data)
    },
    async cartRemove(user_id, pro_id) {
        return await db_user.updateOne({ _id: new ObjectId(user_id) }, { $pull: { cart: { _id: new ObjectId(pro_id) } } })
    },
    async findCart(id) {
        const user = await db_user.aggregate([
            {
                $match: {
                    "_id": new ObjectId(id)
                }
            },
            {
                $unwind: "$cart" // Unwind the cart array
            },
            {
                $lookup: {
                    from: "products",
                    localField: "cart._id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $unwind: "$product"
            },
            {
                $lookup: {
                    from: "category",
                    localField: "product.category", // Field in product collection referring to category ID
                    foreignField: "_id",      // Field in category collection to match
                    as: "category"        // New field name to store joined category information
                }
            },
            {
                $group: {
                    _id: "$_id",
                    cart: {
                        $push: {
                            _id: "$product._id",
                            name: "$product.name",
                            category: "$product.category",
                            brand: "$product.brand",
                            price: "$product.price",
                            discount: "$product.discount",
                            stock: "$product.stock",
                            details: "$product.details",
                            image: "$product.image",
                            status: "$product.status",
                            quantity: "$cart.quantity",
                            category: "$category"
                        }
                    }
                }
            }
        ]).toArray()

        // const cart = await db_user.findOne({ _id: new ObjectId(id) })
        // console.log(cart);
        console.log(user[0]);
        if (user[0]) {

            return user[0].cart
        }
        return null

    },
    async addTocart(user_id, product_id, quantity) {
        try {
            const cursor = db_user.aggregate([
                {
                    $match: {
                        _id: new ObjectId(user_id)
                    }
                },
                {
                    $project: {
                        cart: {
                            $filter: {
                                input: '$cart',
                                as: 'item',
                                cond: { $eq: ['$$item._id', new ObjectId(product_id)] }
                            }
                        }
                    }
                },
                {
                    $unwind: "$cart"
                },
                {
                    $project: {
                        _id: "$cart._id",
                        quantity: "$cart.quantity"
                    }
                }
            ]);
            const data = await cursor.toArray();

            console.log("---------------------------------data")
            console.log(data)
            console.log("---------------------------------data")
            // console.log(data)
            if (!quantity) {
                if (data.length > 0) {
                    const maxquantity = await db_product.findOne({ _id: new ObjectId(data[0]._id) })
                    console.log(maxquantity.stock)
                    if (data[0].quantity <= maxquantity.stock) {
                        console.log("yes----------------")
                        return await db_user.updateOne({ _id: new ObjectId(user_id), 'cart._id': new ObjectId(product_id) }, { $inc: { 'cart.$.quantity': 1 } })
                    } else {
                        throw "limit"
                    }
                } else {
                    console.log("no----------------")
                    return await db_user.updateOne({ _id: new ObjectId(user_id) }, { $push: { cart: { _id: new ObjectId(product_id), quantity: 1 } } })
                }
            } else {
                return await db_user.updateOne({ _id: new ObjectId(user_id), "cart._id": new ObjectId(product_id) }, { $set: { 'cart.$.quantity': Number(quantity) } })
            }
        } catch (err) {
            console.log("err");
            throw err

        }

    },
    async ufind_product(data) {
        try {
            return await db_product.find({ $and: [{ stock: { $ne: "0" } }, { status: true }] }).toArray()
        } catch (errr) {
            console.log(errr);
            throw errr
        }
    },
    async update_pass(Password, Email) {
        Password = encryption(Password);
        console.log(Password);
        return await db_user.updateOne({ Email }, { $set: { Password } });
    },
    async findeOne_user(Email) {
        try {

            return await db_user.findOne({ Email })
        } catch (errr) {
            console.log(errr);
            throw errr
        }
    },

    async find_insert(data) {
        try {
            const Email = data.Email;
            const user = await db_user.find({ Email }).toArray();
            if (user.length === 0) {
                return true;
            } else {
                throw "An account with this email already exists";
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    async insert_user(data) {
        console.log(data.Password);
        data.Password = encryption(data.Password);
        console.log(data.Password);
        data.status = true;
        data.cart = []
        data.address = []
        data.presence = true
        return await db_user.insertOne(data);
    },

    async find(data) {
        try {
            let Email = data.Email;
            console.log(Email);
            let user = await db_user.findOne({ Email });
            if (user) {
                user.Password = decryption(user.Password);
                console.log(user.Password);
                if (user.Password === data.Password) {
                    if (user.status === false) {
                        throw { status: 404, err: "Email blocked" };
                    }
                    return user;
                } else {
                    throw { status: 406, err: "password incorrect" };
                }
            } else {
                throw { status: 404, err: "Email incorrect" };
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async user_status(data) {
        try {
            if (data.status === "true") {
                data.status = true;
            } else {
                data.status = false;
            }
            return await db_user.updateOne(
                { _id: new ObjectId(data._id) },
                { $set: { status: data.status } }
            );
        } catch (errr) {
            console.log(errr);
            throw errr;
        }
    },

    async findOne_user(Email) {
        try {
            return await db_user.findOne({ Email });
        } catch (errr) {
            console.log(errr);
            throw errr;
        }
    },

    async all_user() {
        return await db_user.find().toArray();
    },
    async findOtp(params) {

        const data = await db_otp.findOne({ otp: params })
        await db_otp.deleteOne({ otp: params })
        return data

    },
    async storeOtp(data) {

        const nodemailer = require("./nodemailer")
        const digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 4; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        data.otp = OTP
        console.log(data.otp);
        console.log(data.Email);
        await nodemailer.sendmail(data.user.Email, data.otp, data.Name)
        return await db_otp.insertOne(data)

    },
    async webPush(id, webPush) {
        webPush.userId = new ObjectId(id)
        console.log("webPush")
        console.log(webPush)
        console.log("webPush")
        return await db_subscription.updateOne({ endpoint: webPush.endpoint }, { $set: webPush }, {
            upsert: true, 
            returnOriginal: false 
        })
    },
    async wallet(id, amount) {
        return await db_user.updateOne({ _id: new ObjectId(id) }, { $set: { wallet: amount } })
    },
    async claimReferral(code) {
        return await db_user.findOneAndUpdate({ referral: code }, { $inc: { wallet: 200 } })
    },
    async getUserCoupon(id) {
        return await db_coupon.find({ user: { $nin: [new ObjectId(id)] } }).toArray()
    }

};
