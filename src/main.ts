// src/main.ts
import express, { Request, Response } from "npm:express";
import mongoose from "npm:mongoose";
import bodyParser from "npm:body-parser";
import login from "./login.ts";
import register from "./register.ts";
import { authenticateToken, isAdmin } from "./middleware/auth.ts";
import User from "./models/User.ts";

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/vr-padel")
  .then(() => console.log("MongoDB connected"))
  .catch((err : unknown) => console.error("MongoDB connection error:", err));

// Routes
app.post("/register", async (req: Request, res: Response) => {
  console.log("Registering a new user...");
  await register(req, res);
});

app.post("/login", async (req: Request, res: Response) => {
  console.log("Logging in a user...");
  await login(req, res);
});

// Protected Profile Route
app.get("/profile", authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.userId).select('-password'); // Exclude password from response
    if (!user) return res.status(404).send({ message: "User not found" });
    res.json({ name: user.name, email: user.email, username: user.username }); // Return user's name and email
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error fetching user" });
  }
});

// Admin Route to Get All Users
app.get("/admin/users", authenticateToken, isAdmin, async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password'); // Exclude passwords from response
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error fetching users" });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});