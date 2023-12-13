const productModel = require("../model/productModel")
const categoryModel = require("../model/categoryModel")
const fs = require("fs")
const path = require("path")
// const {  } = require("mongo")
module.exports = {

    getProducts: async (req, res) => {
        try {
            const products = await productModel.find_product()
            res.render("admin/product-list", { layout: 'admin/layout', products })
        } catch (error) {
            console.log(error)
            return res.status(500).render("500", { layout: "login/layout" })
        }

    },
    getAddProdct: async (req, res) => {
        try {
            const data = await categoryModel.find_category({ status: true })
            res.render("admin/addProduct", { layout: 'admin/layout', category: data })
        } catch (error) {
            console.log(error)
            return res.status(500).render("500", { layout: "login/layout" })
        }

    },
    postAddProduct: async (req, res) => {
        try {
            if (!req.files) {
                console.log("No files uploaded");
            } else {
                let data = req.body
                console.log(data);
                await productModel.add_product(data)
                res.redirect("/admin/products")
            }
        } catch (error) {
            console.log(error)
            return res.status(500).render("500", { layout: "login/layout" })
        }


    },
    delete: async (req, res) => {
        try {
            console.log(req.query);
            const { image, id } = req.query
            const images = image.split(',')
            console.log(images)
            if (image) {
                images.forEach(image => {
                    fs.unlinkSync(path.join(__dirname, "../public/image/products/", image), (info, err) => {
                        console.log(err);
                    })
                })
            }
            const products = await productModel.delete_product(id)
            console.log(products);
            if (products.deletedCount > 0) {
                res.redirect("/admin/products")
            } else {
                res.json()
            }

        } catch (error) {
            console.log(error)
            return res.status(500).render("500", { layout: "login/layout" })
        }

    },
    getUpdate: async (req, res) => {
        try {
            const category = await categoryModel.find_category()
            const product = await productModel.findOne_product(req.params.id)
            res.render("admin/updateProduct", { layout: 'admin/layout', product, category })
        } catch (error) {
            console.log(error)
            return res.status(500).render("500", { layout: "login/layout" })
        }


    },
    postUpdate: async (req, res) => {
        try {
            console.log(req.files);
            const data = req.body
            data.size = req.body.size.replace(/,\s*$/, '').split(',').map(Number)
            data.price = Number(data.price)
            data.discount = Number(data.discount)
            console.log(data);
            productModel.update_product(data).then(d => {
                res.redirect("/admin/products")
            })
        } catch (error) {
            console.log(error)
            return res.status(500).render("500", { layout: "login/layout" })
          }
      

    },
    unlist: async (req, res) => {
        try {

            console.log(req.query)
            await productModel.update_status(req.query).then(s => {
                res.redirect("/admin/products")
            })
        } catch (error) {
            console.log(error)
            return res.status(500).render("500", { layout: "login/layout" })
          }
      


    },
    returnStock: async (req, res) => {
        try{
        const { value, orderId } = req.body
        console.log("rweweeeeee");
        console.log(req.body);

        let resp = await productModel.updateStock(value, orderId)
        console.log(resp);
        res.status(200).json("")
    } catch (error) {
        console.log(error)
        return res.status(500).render("500", { layout: "login/layout" })
      }
  
    }

}