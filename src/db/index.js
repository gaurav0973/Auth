import mongoose from "mongoose"


export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("📅MongoDB is connected");
    } catch (error) {
        console.log("Error connecting MongoDB : ", error)
        process.exit(1)
    }
}

