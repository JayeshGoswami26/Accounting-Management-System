import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/User";

dotenv.config();

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/travel_accounting";

async function initAdmin() {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Check if admin exists
    const existingAdmin = await User.findOne({ username: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Create default admin user
    const admin = new User({
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
    const manager = new User({
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
    const accountant = new User({
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
    const staff = new User({
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
  } catch (error) {
    console.error("Error initializing admin:", error);
    process.exit(1);
  }
}

initAdmin();



