import { Router } from "express";
import mongoose from "mongoose";
import { Booking } from "../models/Booking";
import { authenticate, authorize, canViewInternalData, AuthRequest } from "../middleware/auth";

const router = Router();

// Optional authentication for bookings
const optionalAuth = async (req: any, res: any, next: any) => {
  try {
    await authenticate(req, res, () => {});
    next();
  } catch {
    next();
  }
};

router.get("/", async (req, res) => {
  const query: any = {};
  if (req.query.customerId) {
    query.customerId = req.query.customerId;
  }
  if (req.query.paymentStatus) {
    query.paymentStatus = req.query.paymentStatus;
  }
  const bookings = await Booking.find(query).sort({ travelDate: -1 }).populate("customerId createdBy updatedBy");
  res.json(bookings);
});

router.post("/", optionalAuth, async (req: any, res) => {
  const body: any = req.body || {};
  const feesAdjustments = body.feesAdjustments || 0;
  const trueCost = (body.supplierCost || 0) + feesAdjustments;
  const profit = (body.soldAt || 0) - trueCost;
  const initialReceived = body.totalReceived || 0;
  const remainingBalance = (body.soldAt || 0) - initialReceived;
  let paymentStatus: "unpaid" | "partial" | "paid" = "unpaid";
  if (remainingBalance <= 0) {
    paymentStatus = "paid";
  } else if (initialReceived > 0) {
    paymentStatus = "partial";
  }
  const booking = new Booking({
    ...body,
    feesAdjustments,
    trueCost,
    profit,
    totalReceived: 0,
    remainingBalance: body.soldAt || 0,
    paymentStatus: "unpaid",
    createdBy: (req as AuthRequest).user?._id ? new mongoose.Types.ObjectId((req as AuthRequest).user!._id) : null,
  });
  await booking.save();
  if (initialReceived > 0) {
    const { Payment } = await import("../models/Payment");
    const initialPayment = new Payment({
      bookingId: booking._id,
      customerId: booking.customerId,
      amount: initialReceived,
      date: new Date(),
      method: body.paymentMethod || "cash",
      accountOrCompany: body.paymentAccountOrPortal || "",
      createdBy: req.user?._id ? new mongoose.Types.ObjectId(req.user._id) : null,
    });
    await initialPayment.save();
    const payments = await Payment.find({ bookingId: booking._id });
    const totalReceived = payments.reduce((sum, p: any) => sum + (p.amount || 0), 0);
    booking.totalReceived = totalReceived;
    booking.remainingBalance = (booking.soldAt || 0) - totalReceived;
    if (booking.remainingBalance <= 0) {
      booking.paymentStatus = "paid";
    } else if (totalReceived > 0) {
      booking.paymentStatus = "partial";
    }
    await booking.save();
  }
  const populated = await Booking.findById(booking._id).populate("customerId createdBy");
  res.status(201).json(populated);
});

router.put("/:id", optionalAuth, async (req: any, res) => {
  const body: any = req.body || {};
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }
  Object.assign(booking, body);
  booking.updatedBy = (req as AuthRequest).user?._id ? new mongoose.Types.ObjectId((req as AuthRequest).user!._id) : null;
  const feesAdjustments = booking.feesAdjustments || 0;
  const trueCost = (booking.supplierCost || 0) + feesAdjustments;
  const profit = (booking.soldAt || 0) - trueCost;
  // Recalculate totalReceived from all Payment records
  const { Payment } = await import("../models/Payment");
  const payments = await Payment.find({ bookingId: booking._id });
  const totalReceived = payments.reduce((sum, p: any) => sum + (p.amount || 0), 0);
  const remainingBalance = (booking.soldAt || 0) - totalReceived;
  let paymentStatus: "unpaid" | "partial" | "paid" = "unpaid";
  if (remainingBalance <= 0) {
    paymentStatus = "paid";
  } else if (totalReceived > 0) {
    paymentStatus = "partial";
  }
  booking.trueCost = trueCost;
  booking.profit = profit;
  booking.totalReceived = totalReceived;
  booking.remainingBalance = remainingBalance;
  booking.paymentStatus = paymentStatus;
  await booking.save();
  const populated = await Booking.findById(booking._id).populate("customerId createdBy updatedBy");
  res.json(populated);
});

router.delete("/:id", authenticate, authorize("admin", "manager"), async (req: AuthRequest, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }
  const { Payment } = await import("../models/Payment");
  const { Invoice } = await import("../models/Invoice");
  await Payment.deleteMany({ bookingId: booking._id });
  await Invoice.deleteMany({ bookingId: booking._id });
  await Booking.findByIdAndDelete(booking._id);
  res.json({ message: "Booking and all associated data deleted" });
});

router.get("/reports/profit", async (req, res) => {
  const from = req.query.from ? new Date(String(req.query.from)) : undefined;
  const to = req.query.to ? new Date(String(req.query.to)) : undefined;
  const match: any = {};
  if (from || to) {
    match.travelDate = {};
    if (from) match.travelDate.$gte = from;
    if (to) match.travelDate.$lte = to;
  }
  const data = await Booking.find(match);
  const totalProfit = data.reduce((sum, b: any) => sum + (b.profit || 0), 0);
  res.json({ totalProfit, count: data.length, items: data });
});

router.get("/reports/loss-bookings", async (req, res) => {
  const items = await Booking.find({ profit: { $lt: 0 } }).sort({ travelDate: -1 });
  res.json(items);
});

export default router;


