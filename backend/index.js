import "dotenv/config"
import "./config/db.js"
import app from "./app.js"

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`server is running successful at ${port}`)
})