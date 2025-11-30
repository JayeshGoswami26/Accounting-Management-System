import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    username: string;
    email: string;
    role: "admin" | "staff" | "manager" | "accountant";
    name: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "User not found or inactive" });
    }
    req.user = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
};

// Role-based access helpers
export const canViewInternalData = (role: string): boolean => {
  return ["admin", "manager", "accountant"].includes(role);
};

export const canEditSettings = (role: string): boolean => {
  return ["admin", "manager"].includes(role);
};

export const canDeleteData = (role: string): boolean => {
  return role === "admin";
};

export const canManageUsers = (role: string): boolean => {
  return ["admin", "manager"].includes(role);
};



