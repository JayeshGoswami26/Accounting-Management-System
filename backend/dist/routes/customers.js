"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const Customer_1 = require("../models/Customer");
const Booking_1 = require("../models/Booking");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Optional authentication - if token provided, use it
const optionalAuth = async (req, res, next) => {
    try {
        await (0, auth_1.authenticate)(req, res, () => { });
        next();
    }
    catch {
        next();
    }
};
router.get("/", optionalAuth, async (req, res) => {
    const customers = await Customer_1.Customer.find().sort({ createdAt: -1 }).populate("createdBy updatedBy");
    res.json(customers);
});
router.post("/", optionalAuth, async (req, res) => {
    const customer = new Customer_1.Customer({
        ...req.body,
        createdBy: req.user?._id ? new mongoose_1.default.Types.ObjectId(req.user._id) : null,
    });
    await customer.save();
    const populated = await Customer_1.Customer.findById(customer._id).populate("createdBy");
    res.status(201).json(populated);
});
router.put("/:id", optionalAuth, async (req, res) => {
    const customer = await Customer_1.Customer.findByIdAndUpdate(req.params.id, { ...req.body, updatedBy: req.user?._id ? new mongoose_1.default.Types.ObjectId(req.user._id) : null }, { new: true });
    if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
    }
    const populated = await Customer_1.Customer.findById(customer._id).populate("createdBy updatedBy");
    res.json(populated);
});
router.get("/:id/summary", async (req, res) => {
    const customerId = req.params.id;
    const customer = await Customer_1.Customer.findById(customerId);
    if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
    }
    const bookings = await Booking_1.Booking.find({ customerId }).sort({ travelDate: -1 });
    const totalProfit = bookings.reduce((sum, b) => sum + (b.profit || 0), 0);
    const outstanding = bookings.reduce((sum, b) => sum + (b.remainingBalance || 0), 0);
    res.json({ customer, bookings, totalProfit, outstanding });
});
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin", "manager"), async (req, res) => {
    const customerId = req.params.id;
    if (!customerId) {
        return res.status(400).json({ message: "Customer ID required" });
    }
    const customer = await Customer_1.Customer.findById(customerId);
    if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
    }
    const { Payment } = await Promise.resolve().then(() => __importStar(require("../models/Payment")));
    const { Invoice } = await Promise.resolve().then(() => __importStar(require("../models/Invoice")));
    const customerIdObj = customerId;
    await Payment.deleteMany({ customerId: customerIdObj });
    await Invoice.deleteMany({ customerId: customerIdObj });
    await Booking_1.Booking.deleteMany({ customerId: customerIdObj });
    await Customer_1.Customer.findByIdAndDelete(customerId);
    res.json({ message: "Customer and all associated data deleted" });
});
exports.default = router;
//# sourceMappingURL=customers.js.map