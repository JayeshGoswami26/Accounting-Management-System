"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.canManageUsers = exports.canDeleteData = exports.canEditSettings = exports.canViewInternalData = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await User_1.User.findById(decoded.userId).select("-password");
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
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Insufficient permissions" });
        }
        next();
    };
};
exports.authorize = authorize;
// Role-based access helpers
const canViewInternalData = (role) => {
    return ["admin", "manager", "accountant"].includes(role);
};
exports.canViewInternalData = canViewInternalData;
const canEditSettings = (role) => {
    return ["admin", "manager"].includes(role);
};
exports.canEditSettings = canEditSettings;
const canDeleteData = (role) => {
    return role === "admin";
};
exports.canDeleteData = canDeleteData;
const canManageUsers = (role) => {
    return ["admin", "manager"].includes(role);
};
exports.canManageUsers = canManageUsers;
//# sourceMappingURL=auth.js.map