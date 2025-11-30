import { Router } from "express";
import mongoose from "mongoose";
import { Payment } from "../models/Payment";
import { Booking } from "../models/Booking";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

// Optional authentication for payments
const optionalAuth = async (req: any, res: any, next: any) => {
  try {
    await authenticate(req, res, () => {});
    next();
  } catch {
    next();
  }
};

router.get("/", optionalAuth, async (req: any, res) => {
  const query: any = {};
  if (req.query.customerId) {
    query.customerId = req.query.customerId;
  }
  if (req.query.bookingId) {
    query.bookingId = req.query.bookingId;
  }
  if (req.query.method) {
    query.method = req.query.method;
  }
  const payments = await Payment.find(query).sort({ date: -1 }).populate("bookingId customerId createdBy updatedBy");
  res.json(payments);
});

const updateBookingPayment = async (bookingId: any) => {
  const booking = await Booking.findById(bookingId);
  if (booking) {
    const payments = await Payment.find({ bookingId });
    const totalReceived = payments.reduce((sum, p: any) => sum + (p.amount || 0), 0);
    booking.totalReceived = totalReceived;
    const remainingBalance = (booking.soldAt || 0) - totalReceived;
    booking.remainingBalance = remainingBalance;
    if (remainingBalance <= 0) {
      booking.paymentStatus = "paid";
    } else if (totalReceived > 0) {
      booking.paymentStatus = "partial";
    } else {
      booking.paymentStatus = "unpaid";
    }
    await booking.save();
  }
};

router.post("/", optionalAuth, async (req: any, res) => {
  const payment = new Payment({
    ...req.body,
    createdBy: req.user?._id ? new mongoose.Types.ObjectId(req.user._id) : null,
  });
  await payment.save();
  await updateBookingPayment(payment.bookingId);
  const populated = await Payment.findById(payment._id).populate("bookingId customerId createdBy");
  res.status(201).json(populated);
});

router.put("/:id", optionalAuth, async (req: any, res) => {
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user?._id ? new mongoose.Types.ObjectId(req.user._id) : null },
    { new: true }
  );
  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }
  await updateBookingPayment(payment.bookingId);
  const populated = await Payment.findById(payment._id).populate("bookingId customerId createdBy updatedBy");
  res.json(populated);
});

router.delete("/:id", async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }
  const bookingId = payment.bookingId;
  await Payment.findByIdAndDelete(payment._id);
  await updateBookingPayment(bookingId);
  res.json({ message: "Payment deleted" });
});

export default router;


