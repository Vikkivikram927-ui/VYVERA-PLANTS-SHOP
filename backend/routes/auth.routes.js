import { Router } from "express";
import Users from "../model/user.js"

const router =Router()

//creating endpoint for user register
router.post('/signup', async (req, res) => {
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
router.post("/login", async (req, res) => {
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


export default router