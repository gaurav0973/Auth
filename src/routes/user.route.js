import express from "express"
import { registerUser, login, logout, getProfile, verifyEmail } from "../controllers/user.controller.js"
import { userLoginValidator, userRegisterValidator } from "../validations/index.js"
import { validate } from "../middlwares/validate.middleware.js"
import { isLoggedIn } from "../middlwares/isLoggedIn.middleware.js"

const userRoute = express.Router()

userRoute.post("/register",userRegisterValidator(),validate, registerUser)
userRoute.get("/verifyEmail/:token", verifyEmail)
userRoute.post("/login",userLoginValidator(),validate, login)
userRoute.get("/getProfile", isLoggedIn, getProfile)
userRoute.post("/logout", isLoggedIn, logout)

export default userRoute