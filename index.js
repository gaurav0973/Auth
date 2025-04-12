import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./src/db/index.js"
import userRoute from "./src/routes/user.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"

dotenv.config({
    path : "./.env"
})
const app = express()
const port = process.env.PORT

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(
    cors({
      origin: "http://localhost:8808",
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: "GET, POST, PUT, DELETE",
    })
  );
  app.use(cookieParser());

app.get("/", (req,res) => {
    res.send("Kya haal hai")
})
app.use("/api/v1/user", userRoute)



// database connection
connectDB()


app.listen(port, () => {console.log("🛞  Server is running at port : ", port)})