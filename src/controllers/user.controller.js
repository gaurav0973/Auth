import {userRegisterValidator} from "../validations/index.js"
import asyncHandler from "../utils/async-handler.js"
import User from "../models/user.model.js"
import {ApiError} from "../utils/api-error.js"
import { sendEmail, emailVerificationMailgenContent } from "../utils/mail.js"
import {ApiResponse} from "../utils/api-response.js"  // Add this import


export const registerUser = asyncHandler(async (req, res) => {
    //1. get the user details
    const {username, email, password} = req.body;
    
    //2. validate the user => middleware => route me

    // 3. check if user already exists in the db
    const existingUser = await User.findOne({email});
    if(existingUser){
        throw new ApiError(400, "User already exists")
    }
    

    // 4. create the user 
    const user = await User.create({
        username,
        email,
        password,
    });
    
    if(!user){
        throw new ApiError(400, "User Registration Failed")
    }

    // 5. email verification token
    const token = user.generateTemporaryToken();
    user.emailVerificationToken = token.unHashedToken;
    user.emailVerificationExpiry = token.tokenExpiry;
    await user.save()
    
    // 6. send verification email
    await sendEmail({
        email,
        subject: "Please Verify your email",
        mailgenContent: emailVerificationMailgenContent(
          username,
          `${process.env.BASE_URL}/api/v1/users/verifyEmail/${token.unHashedToken}`,
        ),
      });
    //7. send Response
    return res.json(
        new ApiResponse(200, {user}, "User Registered Successfully")
    )
})



export const verifyEmail = asyncHandler(async (req, res)=> {

    // Add debug logs
    console.log("Route hit: verifyEmail");
    console.log("Token from params:", req.params.token);

    // 1. get the token
    const token = req.params.token;
    
    // 2. find the user with the verification token in DB
    const user = await User.findOne({emailVerificationToken: token});

    // 3. check if user exists
    if (!user) {
        throw new ApiError(400, "Invalid verification token")
    }

    // 4. check if token is expired
    if(Date.now() > user.emailVerificationExpiry) {  // Changed condition
        throw new ApiError(400, "Token has expired")
    }

    // 5. update user verification status
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save();

    // 6. send response
    return res.status(200).json(
        new ApiResponse(200, {user}, "Email verified successfully")
    )
})