// src/login.ts
import bcrypt from "npm:bcrypt";
import jwt from "npm:jsonwebtoken";
import { Request, Response } from "npm:express";
import User from "./models/User.ts";

const JWT_SECRET = "your_jwt_secret_key";
// Store securely in environment variables in production
export default async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    // Check the password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id, username: user.username, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error logging in" });
  }
}