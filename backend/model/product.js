import mongoose from "mongoose";

//products schema creation for products
const Products = mongoose.model('products', {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    categery: { type: String, required: true },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true }
})

export default Products