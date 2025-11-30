"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("../models/User");
dotenv_1.default.config();
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/travel_accounting";
async function initAdmin() {
    try {
        await mongoose_1.default.connect(mongoUri);
        console.log("Connected to MongoDB");
        // Check if admin exists
        const existingAdmin = await User_1.User.findOne({ username: "admin" });
        if (existingAdmin) {
            console.log("Admin user already exists");
            process.exit(0);
        }
        // Create default admin user
        const admin = new User_1.User({
            username: "admin",
            email: "admin@travelaccounting.com",
            password: "admin123", // Change this in production!
            role: "admin",
            name: "Administrator",
            isActive: true,
        });
        await admin.save();
        console.log("✅ Default admin user created:");
        console.log("   Username: admin");
        console.log("   Password: admin123");
        console.log("   ⚠️  Please change the password after first login!");
        // Create default manager
        const manager = new User_1.User({
            username: "manager",
            email: "manager@travelaccounting.com",
            password: "manager123",
            role: "manager",
            name: "Manager",
            isActive: true,
        });
        await manager.save();
        console.log("✅ Default manager user created:");
        console.log("   Username: manager");
        console.log("   Password: manager123");
        // Create default accountant
        const accountant = new User_1.User({
            username: "accountant",
            email: "accountant@travelaccounting.com",
            password: "accountant123",
            role: "accountant",
            name: "Accountant",
            isActive: true,
        });
        await accountant.save();
        console.log("✅ Default accountant user created:");
        console.log("   Username: accountant");
        console.log("   Password: accountant123");
        // Create default staff
        const staff = new User_1.User({
            username: "staff",
            email: "staff@travelaccounting.com",
            password: "staff123",
            role: "staff",
            name: "Staff Member",
            isActive: true,
        });
        await staff.save();
        console.log("✅ Default staff user created:");
        console.log("   Username: staff");
        console.log("   Password: staff123");
        process.exit(0);
    }
    catch (error) {
        console.error("Error initializing admin:", error);
        process.exit(1);
    }
}
initAdmin();
//# sourceMappingURL=initAdmin.js.map