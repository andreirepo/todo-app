import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './config/config.env' });

export function connectDB(): void {
  const uri = process.env.MONGO_URI as string;
  
  mongoose.connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch((err: Error) => console.error('MongoDB connection error:', err));
}