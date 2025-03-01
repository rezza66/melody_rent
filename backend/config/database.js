import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect('mongodb://localhost:27017/melody-rent-db', {
            family: 4,
            
        });
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};