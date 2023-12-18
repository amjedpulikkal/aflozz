const { unlinkSync } = require("fs-extra");
const categoryModel = require("../model/categoryModel")
const path = require("path")
const logger = require("../model/winstonLogger").adminLogger

module.exports = {
    getCategory: async (req, res) => {
        try {
            const products = await categoryModel.find_category()
            res.render("admin/category_list", { layout: 'admin/layout', products })
        } catch (error) {
            logger.error(error)
            return res.status(500).render("500", { layout: "login/layout" })
        }

    },
    addCategory: (req, res) => {
        try {
            res.render("admin/addCategory", { layout: 'admin/layout' })
        } catch (error) {
            logger.error(error)
            return res.status(500).render("500", { layout: "login/layout" })
        }

    },
    postAddCategory: async (req, res) => {
        try {
            let data = req.body
            data.status = false
            categoryModel.add_category(data).then(data => {
                res.redirect("/admin/category")
            }).catch(err => {
                res.status(400).send(err)
            })
        } catch (error) {
            logger.error(error)
            return res.status(500).render("500", { layout: "login/layout" })
        }

    },
    delete: async (req, res) => {
        try {

            const { image, id } = req.query
            unlinkSync(path.join(__dirname, "../public/image/products/", image))
            const products = await categoryModel.delete_category(id)
            if (products) {
                res.redirect("/admin/category")
            } else {
                res.json()
            }
        } catch (error) {
            logger.error(error)
            return res.status(500).render("500", { layout: "login/layout" })
        }

    },
    getUpdate: async (req, res) => {
        try {
            const data = await categoryModel.findOne_category(req.params.id)
            res.render("admin/updateCategory", { layout: 'admin/layout', data })
        } catch (error) {
            logger.error(error)
            return res.status(500).render("500", { layout: "login/layout" })
        }

    },
    postUpdate: async (req, res) => {
        try {

            categoryModel.update_category(req.body)
            res.redirect("/admin/category")
        } catch (error) {
            logger.error(error)
            return res.status(500).render("500", { layout: "login/layout" })
        }

    },
    unlist: async (req, res) => {
        try {
            await categoryModel.category_status(req.query)
            res.status(200).json("OK")
        } catch (error) {
            logger.error(error)
            return res.status(500).render("500", { layout: "login/layout" })
        }

    }
}