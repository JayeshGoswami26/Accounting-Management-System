import { Router } from "express";
import mongoose from "mongoose";
import { Customer } from "../models/Customer";
import { Booking } from "../models/Booking";
import { authenticate, authorize, canViewInternalData, AuthRequest } from "../middleware/auth";

const router = Router();

// Optional authentication - if token provided, use it
const optionalAuth = async (req: any, res: any, next: any) => {
  try {
    await authenticate(req, res, () => {});
    next();
  } catch {
    next();
  }
};

router.get("/", optionalAuth, async (req: any, res) => {
  const customers = await Customer.find().sort({ createdAt: -1 }).populate("createdBy updatedBy");
  res.json(customers);
});

router.post("/", optionalAuth, async (req: any, res) => {
  const customer = new Customer({
    ...req.body,
    createdBy: req.user?._id ? new mongoose.Types.ObjectId(req.user._id) : null,
  });
  await customer.save();
  const populated = await Customer.findById(customer._id).populate("createdBy");
  res.status(201).json(populated);
});

router.put("/:id", optionalAuth, async (req: any, res) => {
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user?._id ? new mongoose.Types.ObjectId(req.user._id) : null },
    { new: true }
  );
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }
  const populated = await Customer.findById(customer._id).populate("createdBy updatedBy");
  res.json(populated);
});

router.get("/:id/summary", async (req, res) => {
  const customerId = req.params.id;
  const customer = await Customer.findById(customerId);
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }
  const bookings = await Booking.find({ customerId }).sort({ travelDate: -1 });
  const totalProfit = bookings.reduce((sum, b: any) => sum + (b.profit || 0), 0);
  const outstanding = bookings.reduce((sum, b: any) => sum + (b.remainingBalance || 0), 0);
  res.json({ customer, bookings, totalProfit, outstanding });
});

router.delete("/:id", authenticate, authorize("admin", "manager"), async (req: AuthRequest, res) => {
  const customerId = req.params.id;
  if (!customerId) {
    return res.status(400).json({ message: "Customer ID required" });
  }
  const customer = await Customer.findById(customerId);
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }
  const { Payment } = await import("../models/Payment");
  const { Invoice } = await import("../models/Invoice");
  const customerIdObj = customerId as any;
  await Payment.deleteMany({ customerId: customerIdObj });
  await Invoice.deleteMany({ customerId: customerIdObj });
  await Booking.deleteMany({ customerId: customerIdObj });
  await Customer.findByIdAndDelete(customerId);
  res.json({ message: "Customer and all associated data deleted" });
});

export default router;



