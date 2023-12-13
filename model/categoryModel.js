const categoryModel = require("./db").db_category
const { ObjectId } = require("mongodb");


module.exports = {
    async ufind_category(data) {
     
            return await categoryModel.find().toArray()
       
    },
    async delete_category(id) {
        try {
            return await categoryModel.deleteOne({ _id: new ObjectId(id) })
        } catch (errr) {
            console.log(errr);
            throw errr
        }
    },
    async add_category(data) {
        try {

            const category = await categoryModel.findOne({ category: data.category })
            if (!category) {

                return await categoryModel.insertOne(data)

            } else {
                throw ("category alreody exists")

            }
        } catch (err) {
            console.log(err);
            throw err


        }
    },
    async find_category(p) {
        return await categoryModel.find(p).toArray()
    },
    async findOne_category(id) {
        return await categoryModel.findOne({ _id: new ObjectId(id) })
    },
    async update_category(data) {
        const _id = data.id
        delete data.id
        data.offer = Number(data.offer)
        return await categoryModel.updateOne({ _id: new ObjectId(_id) }, { $set: data })
    },

    async find_category_is_true(d) {
        return await categoryModel.find(d).toArray()
    },

    async category_status(data) {
        try {
            data.status === "true" ? data.status = true : data.status = false;
            return await categoryModel.updateOne({ _id: new ObjectId(data._id) }, { $set: { status: data.status } })
        } catch (errr) {
            console.log(errr);
            throw errr
        }
    }

}