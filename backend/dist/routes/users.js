"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticate);
// Get all users (admin, manager only)
router.get("/", (0, auth_1.authorize)("admin", "manager"), async (req, res) => {
    try {
        const users = await User_1.User.find().select("-password").sort({ createdAt: -1 });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
});
// Get single user
router.get("/:id", async (req, res) => {
    try {
        // Users can view their own profile, admins/managers can view any
        if (req.user._id !== req.params.id && !["admin", "manager"].includes(req.user.role)) {
            return res.status(403).json({ message: "Insufficient permissions" });
        }
        const user = await User_1.User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch user", error: error.message });
    }
});
// Create user (admin, manager only)
router.post("/", (0, auth_1.authorize)("admin", "manager"), async (req, res) => {
    try {
        const { username, email, password, role, name } = req.body;
        if (!username || !email || !password || !name) {
            return res.status(400).json({ message: "Username, email, password, and name are required" });
        }
        const existingUser = await User_1.User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or email already exists" });
        }
        const user = new User_1.User({
            username,
            email,
            password,
            role: role || "staff",
            name,
        });
        await user.save();
        const userObj = user.toObject();
        delete userObj.password;
        res.status(201).json(userObj);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create user", error: error.message });
    }
});
// Update user
router.put("/:id", async (req, res) => {
    try {
        // Users can update their own profile (except role), admins/managers can update any
        if (req.user._id !== req.params.id && !["admin", "manager"].includes(req.user.role)) {
            return res.status(403).json({ message: "Insufficient permissions" });
        }
        const user = await User_1.User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Only admins can change roles
        if (req.body.role && req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admins can change user roles" });
        }
        // Users cannot change their own role
        if (req.body.role && req.user._id === req.params.id) {
            return res.status(403).json({ message: "You cannot change your own role" });
        }
        Object.assign(user, req.body);
        if (req.body.password) {
            user.password = req.body.password;
        }
        await user.save();
        const userObj = user.toObject();
        delete userObj.password;
        res.json(userObj);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update user", error: error.message });
    }
});
// Delete user (admin only)
router.delete("/:id", (0, auth_1.authorize)("admin"), async (req, res) => {
    try {
        if (req.user._id === req.params.id) {
            return res.status(400).json({ message: "You cannot delete your own account" });
        }
        const user = await User_1.User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete user", error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map