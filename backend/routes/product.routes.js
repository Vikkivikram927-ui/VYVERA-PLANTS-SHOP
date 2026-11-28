import { Router } from "express";
import Products from "../model/product.js"

const router =Router()

//add the products to database
router.post('/addproducts', async (req, res, next) => {
    try {
        const products = await Products.find({})
        const id = products.length > 0 ? products.slice(-1)[0].id + 1 : 1
        const newProduct = new Productschema({
            id,
            name: req.body.name,
            price: req.body.price,
            image: req.body.image,
            description: req.body.description,
            categery: req.body.categery
        })
        await newProduct.save()
        res.json({ success: true, name: req.body.name })
    } catch (err) {
        next(err)
    }
})

//delete the products from the database
router.post("/removeproducts", async (req, res, next) => {
    try {
        await Products.findOneAndDelete({ id: req.body.id })
        res.json({ success: true, name: req.body.name })
    } catch (err) {
        next(err)
    }
})

//getting all products data

router.get("/allproductsdata", async (req, res, next) => {

    res.send(await Products.find({}))
    console.log('all products data fetched')

})

//creating endpoint for home page products list
router.get('/homepageproducts', async (req, res) => {
    let products = await Products.find({ categery: "plants" }).limit(8)
    console.log('homepage products data fetched')
    res.send(products)
})

//search products by name, category or description
router.get('/searchproducts', async (req, res, next) => {
    try {
        const q = req.query.q

        if (!q) return res.json([])

        const products = await Products.find({
            $or: [
                { name:        { $regex: q, $options: 'i' } },
                { categery:    { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ]
        })

        res.json(products)
    } catch (err) {
        next(err)
    }
})

export default router