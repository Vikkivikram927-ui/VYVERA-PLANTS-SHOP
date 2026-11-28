import mongoose from "mongoose";

//orders schema creation
const Order = new mongoose.Schema({
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

export const Orders = mongoose.model("orders",Order)