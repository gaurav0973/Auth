import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import asyncHandler from "../utils/async-handler.js"
import { ApiError } from "../utils/api-error.js"

export const isLoggedIn = asyncHandler(async (req, res, next) => {
    
    // 1. get the jwt token
    const jwtToken = req.cookies.jwtToken
    if(!jwtToken){
        throw new ApiError(401, "Unauthorized Access")
    }
    
    try {
        // 2. verify and extract userId from token
        const decodedData = jwt.verify(jwtToken, process.env.JWT_TOKEN_SECRET)
        
        // 3. find user and attach to request
        const user = await User.findById(decodedData._id)
        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, "Invalid Access Token")
    }
})



