import express from "express"
import { registerUser, verifyEmail } from "../controllers/user.controller.js"
import { userRegisterValidator } from "../validations/index.js"
import { validate } from "../middlwares/validate.middleware.js"

const userRoute = express.Router()

userRoute.post("/register",userRegisterValidator(),validate, registerUser)
userRoute.get("/verifyEmail/:token", verifyEmail)

export default userRoute