import { body } from "express-validator";


// register user validator
export const userRegisterValidator = () => {
    return [
      body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),
      body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLowercase()
        .withMessage("Username must be lowercase")
        .isLength({ min: 3 })
        .withMessage("Username must be at lease 3 characters long"),
      body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required"),
    ]
}
  

// login user validator
export const userLoginValidator = ()=>{
  return [
      body('email')
        .trim().notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email is invalid"),
      body('password')
        .notEmpty().withMessage("Password cannot be empty")
        .isLength({min : 3}),
  ]
}