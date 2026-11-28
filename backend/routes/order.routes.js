import { Router } from "express"
import mongoose from "mongoose"
import fetchUser from "../middleware/auth.js"
import { Orders } from "../model/order.js"
import Products from "../model/product.js"
import {
    FREE_SHIPPING_MIN,
    DELIVERY_CHARGE,
    DISCOUNT_PERCENT,
    CART_SIZE
} from "../config/constants.js"
import Users from "../model/user.js"

const router = Router()

function validateAddress(a = {}) {
    const required = ["fullName", "phone", "street", "city", "state", "pincode"]
    for (const field of required) {
        if (!a[field] || !String(a[field]).trim()) return `${field} is required`
    }
    if (!/^\d{10}$/.test(a.phone)) return "Phone must be 10 digits"
    if (!/^\d{6}$/.test(a.pincode)) return "Pincode must be 6 digits"
    return null
}

// place an order (items and prices come from the DATABASE, not from the browser)
router.post("/orders", fetchUser, async (req, res) => {
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

        const products = await Products.find({ id: { $in: ids } })
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

        const order = await Order.create({
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
        for (let i = 0; i < CART_SIZE; i++) {
            emptyCart[i] = 0
        }
        await Users.findByIdAndUpdate(req.user.id, { cartData: emptyCart })

        res.status(201).json({ success: true, orderId: order._id })
    } catch (err) {
        console.error(err)
        res.status(500).json({ success: false, message: "Could not place the order" })
    }
})

// all orders of the logged-in user (keep this ABOVE "/orders/:id")
router.get("/orders/my", fetchUser, async (req, res) => {
    try {
        const orders = await Orders.find({ user: req.user.id }).sort({ createdAt: -1 })
        res.json({ success: true, orders })
    } catch (err) {
        console.error(err)
        res.status(500).json({ success: false, message: "Could not load orders" })
    }
})

// one order (only its owner can see it)
router.get("/orders/:id", fetchUser, async (req, res) => {
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

export default router