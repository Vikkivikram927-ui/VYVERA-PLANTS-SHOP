import { Router } from "express"
import fetchUser from "../middleware/auth.js"
import Users from "../model/user.js"

const router =Router()


//creating endpoint for adding products to cartdata
router.post('/addtocart', fetchUser, async (req, res) => {
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
router.post('/removefromcart', fetchUser, async (req, res) => {
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

router.post('/deletefromcart', fetchUser, async (req, res) => {
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
router.post('/getcart', fetchUser, async (req, res) => {
    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData.cartData);
})


export default router