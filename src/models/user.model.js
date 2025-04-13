import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

// hook
userSchema.pre("save", async function (next) {
  // this have context of user
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//check for password correction
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// JWT Token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_TOKEN_SECRET,
    { expiresIn: process.env.JWT_TOKEN_EXPIRY }
  );
};

// email verification token
userSchema.methods.generateTemporaryToken = function () {
  const unHashedToken = crypto.randomBytes(20).toString("hex");
  const tokenExpiry = Date.now() + 20 * 60 * 1000; // 20 minutes;
  return {unHashedToken, tokenExpiry };
};

const User = mongoose.model("User", userSchema);

export default User;
