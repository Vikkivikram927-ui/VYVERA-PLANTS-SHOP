import { Router } from "express";
import Stores from "../model/store.js";

const router =Router()

//add a store
router.post('/addstore', async (req, res, next) => {
    try {
        const { name, address, phone, timing } = req.body

        if (!name || !Array.isArray(address) || address.length === 0 || !phone || !timing) {
            return res.status(400).json({ success: false, message: "name, address (array), phone and timing are required" })
        }

        const newStore = new Stores({ name, address, phone, timing })
        await newStore.save()
        res.json({ success: true, name: newStore.name })
    } catch (err) {
        next(err)
    }
})

//get all stores
router.get('/allstores', async (req, res, next) => {
    try {
        const stores = await Stores.find({ available: true })
        res.json(stores)
    } catch (err) {
        next(err)
    }
})


export default router