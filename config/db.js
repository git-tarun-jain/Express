import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
    const MONGODB_URI = process.env.MONGO_URI;

    await mongoose.connect(MONGODB_URI).then(() => {
        console.log('database connected')
    })
}