// src/models/User.ts
import mongoose, { Schema, Document } from "npm:mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  name: string;
  email: string;
  role: string; // Add role field
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true, default: "user" }, // Default role is "user"
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;