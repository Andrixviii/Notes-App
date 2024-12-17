import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import dbConnect from "../../templates/LandingPage/utils/dbConnect";
import User from "../../models/user";

const JWT_SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await dbConnect();
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Bandingkan password yang dimasukkan dengan password yang tersimpan
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = await new SignJWT({ userId: user._id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("30m")
      .sign(JWT_SECRET_KEY);

    // Simpan token ke cookie
    const isDevelopment = process.env.NODE_ENV === "development";
    res.setHeader(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; ${
        isDevelopment ? "" : "Secure;"
      } SameSite=Strict; Max-Age=1800`
    );

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
