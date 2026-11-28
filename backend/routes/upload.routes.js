import { Router } from "express";
import upload from "../middleware/upload.js"

const router = Router();

router.post('/upload', upload.single('productimage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "the file isn't uploaded" })
    }
    res.json({
        success: true,
        image_URL: req.file.path
    })
})

export default router