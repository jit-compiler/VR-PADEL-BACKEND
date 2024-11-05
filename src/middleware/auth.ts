// src/middleware/auth.ts
import jwt, { JwtPayload } from "npm:jsonwebtoken";
import { Request, Response, NextFunction } from "npm:express";

// Middleware to authenticate JWT tokens
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get the token from the header

  if (!token) return res.status(401).send({ message: "Access denied" }); // If there is no token, return Unauthorized

  jwt.verify(token, "your_jwt_secret_key", (err: jwt.VerifyErrors | null, user: JwtPayload | undefined) => {
    if (err) return res.status(403).send({ message: "Invalid token" }); // If the token is invalid, return Forbidden
    req.user = user;
    next();
  });
};

// Middleware to check if the user is an admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== "admin") {
    return res.status(403).send({ message: "Access denied" }); // If the user is not an admin, return Forbidden
  }
  next();
};