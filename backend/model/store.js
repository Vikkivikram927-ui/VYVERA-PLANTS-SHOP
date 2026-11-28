import mongoose from "mongoose";

//stores schema creation
const Stores = mongoose.model('stores', {
    name: { type: String, required: true, trim: true, uppercase: true },
    address: { type: [String], required: true },   // each line of the address is one item
    phone: { type: String, required: true, trim: true },
    timing: { type: String, required: true, trim: true },
    available: { type: Boolean, default: true },
    date: { type: Date, default: Date.now }
})

export default Stores