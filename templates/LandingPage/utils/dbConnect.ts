import mongoose from "mongoose";

const dbConnect = async () => {
  if (global.mongoose?.conn) {
    console.log("Using existing MongoDB connection.");
    return global.mongoose.conn;
  }

  try {
    const MONGODB_URI = process.env.MONGODB_URI as string;

    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables.");
    }

    // Jika tidak ada promise, buat koneksi baru
    if (!global.mongoose?.promise) {
      global.mongoose = {
        conn: null,
        promise: mongoose.connect(MONGODB_URI).then((mongooseInstance) => {
          console.log("Connected to MongoDB successfully!");
          return mongooseInstance.connection;
        }),
      };
    }

    // Tunggu hingga koneksi selesai
    global.mongoose.conn = await global.mongoose.promise;
    return global.mongoose.conn;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB.");
  }
};

export default dbConnect;
