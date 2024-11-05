// src/register.ts
import bcrypt from "npm:bcrypt";
import { Request, Response } from "npm:express";
import User from "./models/User.ts";

export default async function register(req: Request, res: Response) {
  try {
    const { username, password, name, email } = req.body; // Destructure role

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user with name, email, and role
    const newUser = new User({ username, password: hashedPassword, name, email });
    await newUser.save();

    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error registering user" });
  }
}