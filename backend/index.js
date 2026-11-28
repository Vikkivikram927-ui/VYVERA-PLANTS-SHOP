import express from "express"
import cors from "cors"
import userRouter from "./routes/user.js"   // adjust the path to where your router file is

const app = express()

app.use(express.json())   // lets you read req.body
app.use(cors())           // allows your frontend (different port) to call the API

app.use("/", userRouter)  // gives you POST /signup and POST /login

export default app