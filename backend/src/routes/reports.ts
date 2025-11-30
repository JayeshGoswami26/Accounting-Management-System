import { Router } from "express";
import { Booking } from "../models/Booking";
import { Payment } from "../models/Payment";
import { Customer } from "../models/Customer";

const router = Router();

router.get("/outstanding-by-customer", async (req, res) => {
  const bookings = await Booking.find({ remainingBalance: { $gt: 0 } }).populate("customerId");
  const customerMap = new Map();
  bookings.forEach((b: any) => {
    const customerId = b.customerId?._id?.toString() || b.customerId?.toString();
    if (!customerMap.has(customerId)) {
      customerMap.set(customerId, {
        customerId: b.customerId,
        customerName: b.customerId?.name || "",
        outstanding: 0,
        bookingCount: 0,
      });
    }
    const entry = customerMap.get(customerId);
    entry.outstanding += b.remainingBalance || 0;
    entry.bookingCount += 1;
  });
  res.json(Array.from(customerMap.values()));
});

router.get("/overdue", async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const items = await Booking.find({
    travelDate: { $lt: today },
    remainingBalance: { $gt: 0 },
  })
    .populate("customerId")
    .sort({ travelDate: 1 });
  res.json(items);
});

router.get("/profit-loss", async (req, res) => {
  const from = req.query.from ? new Date(String(req.query.from)) : undefined;
  const to = req.query.to ? new Date(String(req.query.to)) : undefined;
  const match: any = {};
  if (from || to) {
    match.travelDate = {};
    if (from) match.travelDate.$gte = from;
    if (to) {
      const endDate = new Date(to);
      endDate.setHours(23, 59, 59, 999);
      match.travelDate.$lte = endDate;
    }
  }
  const bookings = await Booking.find(match).populate("customerId");
  const totalProfit = bookings.reduce((sum, b: any) => sum + (b.profit || 0), 0);
  const totalSold = bookings.reduce((sum, b: any) => sum + (b.soldAt || 0), 0);
  const totalCost = bookings.reduce((sum, b: any) => sum + (b.trueCost || 0), 0);
  
  const customerMap = new Map();
  bookings.forEach((b: any) => {
    const customerId = b.customerId?._id?.toString() || b.customerId?.toString();
    if (!customerMap.has(customerId)) {
      customerMap.set(customerId, {
        customerId: b.customerId,
        customerName: b.customerId?.companyName || b.customerId?.name || "",
        totalProfit: 0,
        totalSold: 0,
        totalCost: 0,
        bookingCount: 0,
        outstanding: 0,
      });
    }
    const entry = customerMap.get(customerId);
    entry.totalProfit += b.profit || 0;
    entry.totalSold += b.soldAt || 0;
    entry.totalCost += b.trueCost || 0;
    entry.bookingCount += 1;
    entry.outstanding += b.remainingBalance || 0;
  });
  
  res.json({
    totalProfit,
    totalSold,
    totalCost,
    count: bookings.length,
    customerSummary: Array.from(customerMap.values()),
  });
});

router.get("/loss-bookings", async (req, res) => {
  const bookings = await Booking.find({ profit: { $lt: 0 } })
    .populate("customerId")
    .sort({ travelDate: -1 });
  
  const customerMap = new Map();
  bookings.forEach((b: any) => {
    const customerId = b.customerId?._id?.toString() || b.customerId?.toString();
    if (!customerMap.has(customerId)) {
      customerMap.set(customerId, {
        customerId: b.customerId,
        customerName: b.customerId?.companyName || b.customerId?.name || "",
        totalLoss: 0,
        bookingCount: 0,
        bookings: [],
      });
    }
    const entry = customerMap.get(customerId);
    entry.totalLoss += Math.abs(b.profit || 0);
    entry.bookingCount += 1;
    entry.bookings.push({
      _id: b._id,
      type: b.type,
      travelDate: b.travelDate,
      soldAt: b.soldAt,
      supplierCost: b.supplierCost,
      profit: b.profit,
    });
  });
  
  res.json(Array.from(customerMap.values()));
});

router.get("/channel-totals", async (req, res) => {
  const from = req.query.from ? new Date(String(req.query.from)) : undefined;
  const to = req.query.to ? new Date(String(req.query.to)) : undefined;
  const match: any = {};
  if (from || to) {
    match.date = {};
    if (from) match.date.$gte = from;
    if (to) {
      const endDate = new Date(to);
      endDate.setHours(23, 59, 59, 999);
      match.date.$lte = endDate;
    }
  }
  const payments = await Payment.find(match);
  const totals: any = {};
  payments.forEach((p: any) => {
    const method = p.method || "other";
    if (!totals[method]) {
      totals[method] = { method, total: 0, count: 0 };
    }
    totals[method].total += p.amount || 0;
    totals[method].count += 1;
  });
  res.json(Object.values(totals));
});

export default router;



