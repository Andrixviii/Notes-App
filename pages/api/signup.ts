import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import dbConnect from "../../templates/LandingPage/utils/dbConnect";
import User from "../../models/user";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await dbConnect();
  } catch (error) {
    console.error("Database connection failed:", error);
    return res.status(500).json({ message: "Database connection failed." });
  }

  try {
    if (req.method === "POST") {
      const { email, password } = req.body;

      if (!email || !password) {
        // Validasi input
        return res
          .status(400)
          .json({ message: "Email and password are required." });
      }

      // Validasi kekuatan password (panjang minimal 6 karakter)
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long." });
      }

      // Cek apakah user sudah ada
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        // Respons umum untuk keamanan
        return res.status(400).json({ message: "Signup failed." });
      }

      // Hash password menggunakan bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // Buat user baru
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();

      // Kirim respon sukses
      return res.status(201).json({ message: "User created successfully!" });
    } else {
      // Jika metode bukan POST
      return res.status(405).json({ message: "Method not allowed." });
    }
  } catch (error) {
    // Tangani error
    if (error instanceof Error) {
      console.error("Error:", error.message);
      return res.status(500).json({ message: error.message });
    } else {
      console.error("Unknown error:", error);
      return res.status(500).json({ message: "An unknown error occurred." });
    }
  }
};

export default handler;
