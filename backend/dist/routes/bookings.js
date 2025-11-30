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
const Booking_1 = require("../models/Booking");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Optional authentication for bookings
const optionalAuth = async (req, res, next) => {
    try {
        await (0, auth_1.authenticate)(req, res, () => { });
        next();
    }
    catch {
        next();
    }
};
router.get("/", async (req, res) => {
    const query = {};
    if (req.query.customerId) {
        query.customerId = req.query.customerId;
    }
    if (req.query.paymentStatus) {
        query.paymentStatus = req.query.paymentStatus;
    }
    const bookings = await Booking_1.Booking.find(query).sort({ travelDate: -1 }).populate("customerId createdBy updatedBy");
    res.json(bookings);
});
router.post("/", optionalAuth, async (req, res) => {
    const body = req.body || {};
    const feesAdjustments = body.feesAdjustments || 0;
    const trueCost = (body.supplierCost || 0) + feesAdjustments;
    const profit = (body.soldAt || 0) - trueCost;
    const initialReceived = body.totalReceived || 0;
    const remainingBalance = (body.soldAt || 0) - initialReceived;
    let paymentStatus = "unpaid";
    if (remainingBalance <= 0) {
        paymentStatus = "paid";
    }
    else if (initialReceived > 0) {
        paymentStatus = "partial";
    }
    const booking = new Booking_1.Booking({
        ...body,
        feesAdjustments,
        trueCost,
        profit,
        totalReceived: 0,
        remainingBalance: body.soldAt || 0,
        paymentStatus: "unpaid",
        createdBy: req.user?._id ? new mongoose_1.default.Types.ObjectId(req.user._id) : null,
    });
    await booking.save();
    if (initialReceived > 0) {
        const { Payment } = await Promise.resolve().then(() => __importStar(require("../models/Payment")));
        const initialPayment = new Payment({
            bookingId: booking._id,
            customerId: booking.customerId,
            amount: initialReceived,
            date: new Date(),
            method: body.paymentMethod || "cash",
            accountOrCompany: body.paymentAccountOrPortal || "",
            createdBy: req.user?._id ? new mongoose_1.default.Types.ObjectId(req.user._id) : null,
        });
        await initialPayment.save();
        const payments = await Payment.find({ bookingId: booking._id });
        const totalReceived = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        booking.totalReceived = totalReceived;
        booking.remainingBalance = (booking.soldAt || 0) - totalReceived;
        if (booking.remainingBalance <= 0) {
            booking.paymentStatus = "paid";
        }
        else if (totalReceived > 0) {
            booking.paymentStatus = "partial";
        }
        await booking.save();
    }
    const populated = await Booking_1.Booking.findById(booking._id).populate("customerId createdBy");
    res.status(201).json(populated);
});
router.put("/:id", optionalAuth, async (req, res) => {
    const body = req.body || {};
    const booking = await Booking_1.Booking.findById(req.params.id);
    if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
    }
    Object.assign(booking, body);
    booking.updatedBy = req.user?._id ? new mongoose_1.default.Types.ObjectId(req.user._id) : null;
    const feesAdjustments = booking.feesAdjustments || 0;
    const trueCost = (booking.supplierCost || 0) + feesAdjustments;
    const profit = (booking.soldAt || 0) - trueCost;
    // Recalculate totalReceived from all Payment records
    const { Payment } = await Promise.resolve().then(() => __importStar(require("../models/Payment")));
    const payments = await Payment.find({ bookingId: booking._id });
    const totalReceived = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const remainingBalance = (booking.soldAt || 0) - totalReceived;
    let paymentStatus = "unpaid";
    if (remainingBalance <= 0) {
        paymentStatus = "paid";
    }
    else if (totalReceived > 0) {
        paymentStatus = "partial";
    }
    booking.trueCost = trueCost;
    booking.profit = profit;
    booking.totalReceived = totalReceived;
    booking.remainingBalance = remainingBalance;
    booking.paymentStatus = paymentStatus;
    await booking.save();
    const populated = await Booking_1.Booking.findById(booking._id).populate("customerId createdBy updatedBy");
    res.json(populated);
});
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin", "manager"), async (req, res) => {
    const booking = await Booking_1.Booking.findById(req.params.id);
    if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
    }
    const { Payment } = await Promise.resolve().then(() => __importStar(require("../models/Payment")));
    const { Invoice } = await Promise.resolve().then(() => __importStar(require("../models/Invoice")));
    await Payment.deleteMany({ bookingId: booking._id });
    await Invoice.deleteMany({ bookingId: booking._id });
    await Booking_1.Booking.findByIdAndDelete(booking._id);
    res.json({ message: "Booking and all associated data deleted" });
});
router.get("/reports/profit", async (req, res) => {
    const from = req.query.from ? new Date(String(req.query.from)) : undefined;
    const to = req.query.to ? new Date(String(req.query.to)) : undefined;
    const match = {};
    if (from || to) {
        match.travelDate = {};
        if (from)
            match.travelDate.$gte = from;
        if (to)
            match.travelDate.$lte = to;
    }
    const data = await Booking_1.Booking.find(match);
    const totalProfit = data.reduce((sum, b) => sum + (b.profit || 0), 0);
    res.json({ totalProfit, count: data.length, items: data });
});
router.get("/reports/loss-bookings", async (req, res) => {
    const items = await Booking_1.Booking.find({ profit: { $lt: 0 } }).sort({ travelDate: -1 });
    res.json(items);
});
exports.default = router;
//# sourceMappingURL=bookings.js.map