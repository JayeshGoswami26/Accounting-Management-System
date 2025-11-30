import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
    const user = await User.findOne({ username, isActive: true });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

// Get current user
router.get("/me", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "User not found" });
    }
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Change password
router.post("/change-password", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password required" });
    }
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to change password", error: error.message });
  }
});

export default router;



