import mongoose from "mongoose";

declare global {
  // Deklarasi untuk cache koneksi Mongoose
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}
