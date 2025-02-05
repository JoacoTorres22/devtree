import mongoose from "mongoose";
import colors from 'colors'
import User, { IUser } from "./models/User";

export const connectDB = async () => {
    try {
        const url = process.env.MONGO_URI
        const { connection } = await mongoose.connect(url)
        console.log(colors.magenta(`MongoDB Conectada en ${url}`))
    } catch (error) {
        console.log(colors.red(error))
        process.exit(1)
    }
}