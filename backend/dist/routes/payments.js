"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const Payment_1 = require("../models/Payment");
const Booking_1 = require("../models/Booking");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Optional authentication for payments
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
    const query = {};
    if (req.query.customerId) {
        query.customerId = req.query.customerId;
    }
    if (req.query.bookingId) {
        query.bookingId = req.query.bookingId;
    }
    if (req.query.method) {
        query.method = req.query.method;
    }
    const payments = await Payment_1.Payment.find(query).sort({ date: -1 }).populate("bookingId customerId createdBy updatedBy");
    res.json(payments);
});
const updateBookingPayment = async (bookingId) => {
    const booking = await Booking_1.Booking.findById(bookingId);
    if (booking) {
        const payments = await Payment_1.Payment.find({ bookingId });
        const totalReceived = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        booking.totalReceived = totalReceived;
        const remainingBalance = (booking.soldAt || 0) - totalReceived;
        booking.remainingBalance = remainingBalance;
        if (remainingBalance <= 0) {
            booking.paymentStatus = "paid";
        }
        else if (totalReceived > 0) {
            booking.paymentStatus = "partial";
        }
        else {
            booking.paymentStatus = "unpaid";
        }
        await booking.save();
    }
};
router.post("/", optionalAuth, async (req, res) => {
    const payment = new Payment_1.Payment({
        ...req.body,
        createdBy: req.user?._id ? new mongoose_1.default.Types.ObjectId(req.user._id) : null,
    });
    await payment.save();
    await updateBookingPayment(payment.bookingId);
    const populated = await Payment_1.Payment.findById(payment._id).populate("bookingId customerId createdBy");
    res.status(201).json(populated);
});
router.put("/:id", optionalAuth, async (req, res) => {
    const payment = await Payment_1.Payment.findByIdAndUpdate(req.params.id, { ...req.body, updatedBy: req.user?._id ? new mongoose_1.default.Types.ObjectId(req.user._id) : null }, { new: true });
    if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
    }
    await updateBookingPayment(payment.bookingId);
    const populated = await Payment_1.Payment.findById(payment._id).populate("bookingId customerId createdBy updatedBy");
    res.json(populated);
});
router.delete("/:id", async (req, res) => {
    const payment = await Payment_1.Payment.findById(req.params.id);
    if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
    }
    const bookingId = payment.bookingId;
    await Payment_1.Payment.findByIdAndDelete(payment._id);
    await updateBookingPayment(bookingId);
    res.json({ message: "Payment deleted" });
});
exports.default = router;
//# sourceMappingURL=payments.js.map