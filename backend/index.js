
import "dotenv/config"
import express from "express"
import cors from "cors"
import multer from "multer"
import path from "path"
import fs from "fs"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"

const port = process.env.PORT || 4000
const baseUrl = process.env.BASE_URL || `http://localhost:${port}`
const app = express()

app.use(express.json())
app.use(cors())

fs.mkdirSync("./upload/images", { recursive: true })

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("mongodb connected"))
    .catch((err) => console.error("mongodb error:", err.message))

app.get('/', (req, res) => {
    res.send("the express server is running successful")
})

const storage = multer.diskStorage({
    destination: "./upload/images",
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({ storage })

app.use('/images', express.static("upload/images"))

app.post('/upload', upload.single('productimage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "the file isn't uploaded" })
    }
    res.json({
        success: true,
        image_URL: `${baseUrl}/images/${req.file.filename}`
    })
})

//products schema creation for products
const Productschema = mongoose.model('products', {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    categery: { type: String, required: true },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true }
})

//add the products to database
app.post('/addproducts', async (req, res, next) => {
    try {
        const products = await Productschema.find({})
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
app.post("/removeproducts", async (req, res, next) => {
    try {
        await Productschema.findOneAndDelete({ id: req.body.id })
        res.json({ success: true, name: req.body.name })
    } catch (err) {
        next(err)
    }
})

//getting all products data

app.get("/allproductsdata", async (req, res, next) => {

    res.send(await Productschema.find({}))
    console.log('all products data fetched')

})


//users schema creation
const Users = mongoose.model('Users', {
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

//creating endpoint for user register
app.post('/signup', async (req, res) => {
    let check = await Users.findOne({ email: req.body.email })
    if (check) {
        return res.status(400).json({ success: false, errors: "existing email id found" })
    }

    let cart = {}
    for (let i = 0; i < 300; i++) {
        cart[i] = 0
    }

    const user = new Users({
        name: req.body.username,
        password: req.body.password,
        email: req.body.email,
        cartData: cart,
    })

    await user.save()

    const data = {
        user: {
            id: user.id
        }
    }

    const token = jwt.sign(data, process.env.JWT_SECRET);
    res.json({ success: true, token })

})

//creating userlogin point 
app.post("/login", async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            };

            const token = jwt.sign(data, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, errors: "wrong password" });
        }
    } else {
        res.json({ success: false, errors: "Wrong email id" });
    }
});

//creating endpoint for home page products list
app.get('/homepageproducts', async (req, res) => {
    let products = await Productschema.find({ categery: "plants" }).limit(8)
    console.log('homepage products data fetched')
    res.send(products)
})

// creating middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ errors: "Please authunticate valid token" })
    } else {
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            req.user = data.user
            next();
        } catch (error) {
            res.status(401).send({ error: "please auhtunticate a valid token" })
        }
    }
}

//creating endpoint for adding products to cartdata
app.post('/addtocart', fetchUser, async (req, res) => {
    try {
        await Users.findOneAndUpdate(
            { _id: req.user.id },
            { $inc: { [`cartData.${req.body.itemId}`]: 1 } }
        )
        res.json({ success: true })
    } catch (err) {
        console.error(err)
        res.status(500).json({ success: false })
    }
})

//remove products from the cart
app.post('/removefromcart', fetchUser, async (req, res) => {
    try {
        const itemId = req.body.itemId

        // only decrement if the current quantity is greater than 0
        await Users.findOneAndUpdate(
            { _id: req.user.id, [`cartData.${itemId}`]: { $gt: 0 } },
            { $inc: { [`cartData.${itemId}`]: -1 } }
        )

        res.json({ success: true })
    } catch (err) {
        console.error(err)
        res.status(500).json({ success: false })
    }
})

//get cart data from the backend
app.post('/getcart', fetchUser, async (req, res) => {
    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData.cartData);
})

//stores schema creation
const Storeschema = mongoose.model('stores', {
    name: { type: String, required: true, trim: true, uppercase: true },
    address: { type: [String], required: true },   // each line of the address is one item
    phone: { type: String, required: true, trim: true },
    timing: { type: String, required: true, trim: true },
    available: { type: Boolean, default: true },
    date: { type: Date, default: Date.now }
})

//add a store
app.post('/addstore', async (req, res, next) => {
    try {
        const { name, address, phone, timing } = req.body

        if (!name || !Array.isArray(address) || address.length === 0 || !phone || !timing) {
            return res.status(400).json({ success: false, message: "name, address (array), phone and timing are required" })
        }

        const newStore = new Storeschema({ name, address, phone, timing })
        await newStore.save()
        res.json({ success: true, name: newStore.name })
    } catch (err) {
        next(err)
    }
})

//get all stores
app.get('/allstores', async (req, res, next) => {
    try {
        const stores = await Storeschema.find({ available: true })
        res.json(stores)
    } catch (err) {
        next(err)
    }
})

//search products by name, category or description
app.get('/searchproducts', async (req, res, next) => {
    try {
        const q = (req.query.q || "").trim()
        if (!q) return res.json([])

        // escape special characters so "seeds (rare)" doesn't break the regex
        const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        const regex = new RegExp(safe, "i")   // "i" = ignore upper/lower case

        const products = await Productschema.find({
            available: true,
            $or: [
                { name: regex },
                { categery: regex },
                { description: regex }
            ]
        })
        res.json(products)
    } catch (err) {
        next(err)
    }
})


app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ success: false, message: err.message })
})

app.listen(port, () => {
    console.log(`server is running successful at ${port}`)
})