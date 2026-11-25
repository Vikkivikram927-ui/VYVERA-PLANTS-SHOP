
import "dotenv/config"
import express from "express"
import cors from "cors"
import multer from "multer"
import path from "path"
import fs from "fs"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"

const port = process.env.PORT || 4000
const baseUrl = process.env.BASE_URL || `http://localhost:${port}`
const app = express()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.use(express.json())
app.use(cors())

fs.mkdirSync("./upload/images", { recursive: true })

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("mongodb connected"))
    .catch((err) => console.error("mongodb error:", err.message))

app.get('/', (req, res) => {
    res.send("the express server is running successful")
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: { allowed_formats: ["jpg", "jpeg", "png", "webp"] }
})
const upload = multer({ storage })

app.use('/images', express.static("upload/images"))

app.post('/upload', upload.single('productimage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "the file isn't uploaded" })
    }
    res.json({
        success: true,
        image_URL: req.file.path
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

       const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = new Users({
        name: req.body.username,
        password: hashedPassword,
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
        const passCompare = await bcrypt.compare(req.body.password, user.password) 
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

app.post('/deletefromcart', fetchUser, async (req, res) => {
    try {
        const itemId = req.body.itemId
        await Users.findByIdAndUpdate(
            req.user.id,
            { $set: { [`cartData.${itemId}`]: 0 } }
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

//orders schema creation
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    items: [{
        productId: Number,
        name: String,
        image: String,
        price: Number,      // price at the time of purchase
        quantity: Number
    }],
    address: {
        fullName: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        pincode: String
    },
    paymentMethod: { type: String, enum: ["cod", "online"], required: true },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
    subtotal: Number,
    discount: Number,
    deliveryCharge: Number,
    total: Number,
    status: {
        type: String,
        enum: ["placed", "packed", "shipped", "delivered", "cancelled"],
        default: "placed"
    }
}, { timestamps: true })   // adds createdAt and updatedAt

const Orders = mongoose.model("orders", orderSchema)

// keep these the same as the cart page and the checkout page
const FREE_SHIPPING_MIN = 599
const DELIVERY_CHARGE = 50
const DISCOUNT_PERCENT = 10

function validateAddress(a = {}) {
    const required = ["fullName", "phone", "street", "city", "state", "pincode"]
    for (const field of required) {
        if (!a[field] || !String(a[field]).trim()) return `${field} is required`
    }
    if (!/^\d{10}$/.test(a.phone)) return "Phone must be 10 digits"
    if (!/^\d{6}$/.test(a.pincode)) return "Pincode must be 6 digits"
    return null
}

//place an order (items and prices come from the DATABASE, not from the browser)
app.post('/orders', fetchUser, async (req, res) => {
    try {
        const { address, paymentMethod } = req.body

        if (!["cod", "online"].includes(paymentMethod)) {
            return res.status(400).json({ success: false, message: "Choose a payment method" })
        }
        const addressError = validateAddress(address)
        if (addressError) {
            return res.status(400).json({ success: false, message: addressError })
        }

        // the user's saved cart is the source of truth
        const user = await Users.findById(req.user.id)
        const cart = (user && user.cartData) || {}
        const ids = Object.keys(cart).filter((key) => cart[key] > 0).map(Number)

        if (ids.length === 0) {
            return res.status(400).json({ success: false, message: "Your cart is empty" })
        }

        const products = await Productschema.find({ id: { $in: ids } })
        const orderItems = products.map((p) => ({
            productId: p.id,
            name: p.name,
            image: p.image,
            price: p.price,
            quantity: cart[p.id]
        }))

        if (orderItems.length === 0) {
            return res.status(400).json({ success: false, message: "Your cart is empty" })
        }

        const subtotal = orderItems.reduce((t, i) => t + i.price * i.quantity, 0)
        const discount = subtotal * (DISCOUNT_PERCENT / 100)
        const deliveryCharge = subtotal >= FREE_SHIPPING_MIN ? 0 : DELIVERY_CHARGE
        const total = subtotal - discount + deliveryCharge

        const order = await Orders.create({
            user: req.user.id,
            items: orderItems,
            address,
            paymentMethod,
            // DEMO: "online" is marked paid without a real gateway.
            // Razorpay verification will replace this later.
            paymentStatus: paymentMethod === "online" ? "paid" : "pending",
            subtotal,
            discount,
            deliveryCharge,
            total
        })

        // empty the saved cart after the order is created
        const emptyCart = {}
        for (let i = 0; i < 300; i++) {
            emptyCart[i] = 0
        }
        await Users.findByIdAndUpdate(req.user.id, { cartData: emptyCart })

        res.status(201).json({ success: true, orderId: order._id })
    } catch (err) {
        console.error(err)
        res.status(500).json({ success: false, message: "Could not place the order" })
    }
})

//get all orders of the logged-in user (keep this ABOVE "/orders/:id")
app.get('/orders/my', fetchUser, async (req, res) => {
    try {
        const orders = await Orders.find({ user: req.user.id }).sort({ createdAt: -1 })
        res.json({ success: true, orders })
    } catch (err) {
        console.error(err)
        res.status(500).json({ success: false, message: "Could not load orders" })
    }
})

//get one order (only its owner can see it)
app.get('/orders/:id', fetchUser, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ success: false, message: "Order not found" })
        }
        const order = await Orders.findOne({ _id: req.params.id, user: req.user.id })
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" })
        }
        res.json({ success: true, order })
    } catch (err) {
        console.error(err)
        res.status(500).json({ success: false, message: "Could not load the order" })
    }
})



app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ success: false, message: err.message })
})

app.listen(port, () => {
    console.log(`server is running successful at ${port}`)
})