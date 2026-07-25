import mongoose from "mongoose";

let cached = (global as any).mongoose || { conn: null, promise: null };

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  if (cached.conn) {
    return;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((m) => m);
  }

  cached.conn = await cached.promise;
  console.log(`MongoDB connected: ${cached.conn.connection.host}`);
};

export default connectDB;
