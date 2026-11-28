import express from "express"
import cors from "cors"
import fs from "fs"

import uploadRoutes from "./routes/upload.routes.js"
import productRoutes from "./routes/product.routes.js"
import authRoutes from "./routes/auth.routes.js"
import cartRoutes from "./routes/cart.routes.js"
import storeRoutes from "./routes/store.routes.js"
import orderRoutes from "./routes/order.routes.js"
import errorHandler from "./middleware/errorHandler.js"

const app = express()

app.use(express.json())
app.use(cors())

fs.mkdirSync("./upload/images", { recursive: true })
app.use("/images", express.static("upload/images"))

app.get("/", (req, res) => {
    res.send("the express server is running successful")
})

app.use(uploadRoutes)
app.use(productRoutes)
app.use(authRoutes)
app.use(cartRoutes)
app.use(storeRoutes)
app.use(orderRoutes)

app.use(errorHandler)

export default app