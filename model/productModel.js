const { db_product, db_order } = require("./db")
const { ObjectId } = require("mongodb");

module.exports = {
    async ufind_product() {
        try {
            return await db_product.aggregate([
                { $match: { stock: { $ne: "0" }, status: true } },
                { $sample: { size: 4 } }
            ]).toArray();

        } catch (errr) {
            console.log(errr);
            throw errr
        }
    },
    async add_product(data) {
        try {
            data.price = Number(data.price)
            data.discount = Number(data.discount)
            data.stock = Number(data.stock)
            data.category = new ObjectId(data.category)
            return await db_product.insertOne(data)
        } catch (errr) {
            console.log(errr);
            throw errr
        }
    },
    async find_product(data) {
        try {
            return await db_product.find({}).toArray()
        } catch (errr) {
            console.log(errr);
            throw errr
        }
    },
    async ufind_product(limit) {
        try {

            const products = await db_product.aggregate([
                {
                    $match: {
                        $and: [
                            { stock: { $gt: 0 } },
                            { status: true }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: "category",
                        localField: "category", // Field in product collection referring to category ID
                        foreignField: "_id",      // Field in category collection to match
                        as: "category"        // New field name to store joined category information
                    }
                }
            ]).skip(limit).limit(8).toArray()

            const totalproduct = await db_product.countDocuments({ $and: [{ stock: { $gt: 0 } }, { status: true }] })
            return { products, totalproduct }
        } catch (errr) {
            console.log(errr);
            throw errr
        }
    },
    async ufind_category(data) {
        try {
            return await db_category.find().toArray()
        } catch (errr) {
            console.log(errr);
            throw errr
        }
    },
    async findOne_product(id) {
        try {
            console.log(id);

            return await db_product.findOne({ _id: new ObjectId(id) })

        } catch (errr) {
            console.log(errr);
            throw errr
        }
    },
    async update_product(data) {
        try {
            const id = data.id
            delete data._id
            const image = data.image
            delete data.image
            console.log(id);
            console.log(data);
            data.stock = Number(data.stock)
            data.category = new ObjectId(data.category)
            await db_product.updateOne({ _id: new ObjectId(id) }, { $set: data }).then(async e => {

                return await db_product.updateOne({ _id: new ObjectId(id) }, { $set: image })
            })
        } catch (errr) {
            console.log(errr);
            throw errr
        }
    },
    async delete_product(id) {
        try {
            return await db_product.deleteOne({ _id: new ObjectId(id) })
        } catch (errr) {
            console.log(errr);
            throw errr
        }
    },

    async update_status(data) {

        try {
            if (data.status === "true") {
                data.status = true
            } else {
                data.status = false
            }
            return await db_product.updateOne({ _id: new ObjectId(data._id) }, { $set: { status: data.status } })
        } catch (errr) {
            console.log(errr);
            throw errr
        }
    },
    async search(data, category, size) {
        data = data || ''
        const regexPattern = new RegExp(data, 'i'); // 'i' for case-insensitive
        const query = {
            $or: [
                { name: { $regex: regexPattern } },
                { title: { $regex: regexPattern } },

            ]
        };

        if (category.length) {
            const categoryIds = category.map(i => new ObjectId(i));
            query.category = { $in: categoryIds };
        }
        if (size.length) {
            query.size = { $in: size };
        }
        console.log(query)
        return await db_product.find(query).toArray()

    },
    async updateStock(value, id) {

        const product = await db_order.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { "return.1.stock": value } });
        console.log(product);
        if (value === "increment") {
            const productUpdates = product.value.products.map((element) => ({
                updateOne: {
                    filter: { _id: element._id },
                    update: { $inc: { stock: element.quantity } }
                }
            }));
            await db_product.bulkWrite(productUpdates);
        }
        return ""
    }

}