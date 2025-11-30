"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const Refund_1 = require("../models/Refund");
const Booking_1 = require("../models/Booking");
const Payment_1 = require("../models/Payment");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Optional authentication for refunds
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
    const refunds = await Refund_1.Refund.find(query)
        .sort({ date: -1 })
        .populate("customerId bookingId createdBy updatedBy");
    res.json(refunds);
});
router.get("/:id", optionalAuth, async (req, res) => {
    const refund = await Refund_1.Refund.findById(req.params.id)
        .populate("customerId bookingId createdBy updatedBy");
    if (!refund) {
        return res.status(404).json({ message: "Refund not found" });
    }
    res.json(refund);
});
router.post("/", optionalAuth, async (req, res) => {
    const body = req.body || {};
    // Validate required fields
    if (!body.customerId || !body.bookingId || !body.amount || !body.date) {
        return res.status(400).json({ message: "Missing required fields: customerId, bookingId, amount, date" });
    }
    // Create refund
    const refund = new Refund_1.Refund({
        customerId: body.customerId,
        bookingId: body.bookingId,
        amount: Number(body.amount),
        date: new Date(body.date),
        method: body.method || "cash",
        accountOrCompany: body.accountOrCompany || "",
        note: body.note || "",
        createdBy: req.user?._id ? new mongoose_1.default.Types.ObjectId(req.user._id) : null,
    });
    await refund.save();
    // Create a payment record with negative amount to reflect refund in accounting
    const payment = new Payment_1.Payment({
        bookingId: body.bookingId,
        customerId: body.customerId,
        amount: -Number(body.amount), // Negative amount for refund
        date: new Date(body.date),
        method: body.method || "cash",
        accountOrCompany: body.accountOrCompany || "",
        note: `Refund: ${body.note || ""}`,
        createdBy: req.user?._id ? new mongoose_1.default.Types.ObjectId(req.user._id) : null,
    });
    await payment.save();
    // Update booking balance (refund reduces total received)
    const booking = await Booking_1.Booking.findById(body.bookingId);
    if (booking) {
        const payments = await Payment_1.Payment.find({ bookingId: booking._id });
        const totalReceived = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        booking.totalReceived = Math.max(0, totalReceived); // Ensure non-negative
        booking.remainingBalance = (booking.soldAt || 0) - booking.totalReceived;
        // Update payment status
        if (booking.remainingBalance <= 0) {
            booking.paymentStatus = "paid";
        }
        else if (booking.totalReceived > 0) {
            booking.paymentStatus = "partial";
        }
        else {
            booking.paymentStatus = "unpaid";
        }
        await booking.save();
    }
    const populated = await Refund_1.Refund.findById(refund._id)
        .populate("customerId bookingId createdBy");
    res.status(201).json(populated);
});
router.put("/:id", optionalAuth, async (req, res) => {
    const body = req.body || {};
    const refund = await Refund_1.Refund.findById(req.params.id);
    if (!refund) {
        return res.status(404).json({ message: "Refund not found" });
    }
    const oldAmount = refund.amount;
    Object.assign(refund, {
        ...body,
        amount: Number(body.amount),
        date: body.date ? new Date(body.date) : refund.date,
        updatedBy: req.user?._id ? new mongoose_1.default.Types.ObjectId(req.user._id) : null,
    });
    await refund.save();
    // Update corresponding payment record
    const payment = await Payment_1.Payment.findOne({
        bookingId: refund.bookingId,
        amount: -oldAmount,
        date: refund.date,
    });
    if (payment) {
        payment.amount = -Number(body.amount);
        payment.date = refund.date;
        payment.method = body.method || payment.method;
        payment.accountOrCompany = body.accountOrCompany || payment.accountOrCompany;
        payment.note = `Refund: ${body.note || ""}`;
        payment.updatedBy = req.user?._id ? new mongoose_1.default.Types.ObjectId(req.user._id) : null;
        await payment.save();
    }
    // Update booking balance
    const booking = await Booking_1.Booking.findById(refund.bookingId);
    if (booking) {
        const payments = await Payment_1.Payment.find({ bookingId: booking._id });
        const totalReceived = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        booking.totalReceived = Math.max(0, totalReceived);
        booking.remainingBalance = (booking.soldAt || 0) - booking.totalReceived;
        if (booking.remainingBalance <= 0) {
            booking.paymentStatus = "paid";
        }
        else if (booking.totalReceived > 0) {
            booking.paymentStatus = "partial";
        }
        else {
            booking.paymentStatus = "unpaid";
        }
        await booking.save();
    }
    const populated = await Refund_1.Refund.findById(refund._id)
        .populate("customerId bookingId createdBy updatedBy");
    res.json(populated);
});
router.delete("/:id", optionalAuth, async (req, res) => {
    const refund = await Refund_1.Refund.findById(req.params.id);
    if (!refund) {
        return res.status(404).json({ message: "Refund not found" });
    }
    // Find and delete corresponding payment record
    const payment = await Payment_1.Payment.findOne({
        bookingId: refund.bookingId,
        amount: -refund.amount,
        date: refund.date,
    });
    if (payment) {
        await Payment_1.Payment.findByIdAndDelete(payment._id);
    }
    // Update booking balance
    const booking = await Booking_1.Booking.findById(refund.bookingId);
    if (booking) {
        const payments = await Payment_1.Payment.find({ bookingId: booking._id });
        const totalReceived = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        booking.totalReceived = Math.max(0, totalReceived);
        booking.remainingBalance = (booking.soldAt || 0) - booking.totalReceived;
        if (booking.remainingBalance <= 0) {
            booking.paymentStatus = "paid";
        }
        else if (booking.totalReceived > 0) {
            booking.paymentStatus = "partial";
        }
        else {
            booking.paymentStatus = "unpaid";
        }
        await booking.save();
    }
    await Refund_1.Refund.findByIdAndDelete(req.params.id);
    res.json({ message: "Refund deleted" });
});
exports.default = router;
//# sourceMappingURL=refunds.js.map