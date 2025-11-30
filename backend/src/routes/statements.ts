import { Router } from "express";
import multer from "multer";
import mongoose from "mongoose";
import { Statement } from "../models/Statement";
import { Payment } from "../models/Payment";
import { Booking } from "../models/Booking";
import { authenticate, AuthRequest } from "../middleware/auth";
import * as XLSX from "xlsx";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticate);

router.post("/upload", upload.single("file"), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const { type, accountName, statementDate } = req.body;
    if (!type || !accountName || !statementDate) {
      return res.status(400).json({ message: "Missing required fields: type, accountName, statementDate" });
    }
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return res.status(400).json({ message: "No sheets found in file" });
    }
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
      return res.status(400).json({ message: "Invalid worksheet" });
    }
    const data = XLSX.utils.sheet_to_json(worksheet);
    const transactions: any[] = [];
    for (const row of data as any[]) {
      const dateStr = row.Date || row.date || row.DATE || row["Transaction Date"] || row["Transaction date"];
      const description = row.Description || row.description || row.DESCRIPTION || row["Transaction Description"] || row["Transaction description"] || "";
      const amount = parseFloat(row.Amount || row.amount || row.AMOUNT || row["Transaction Amount"] || row["Transaction amount"] || 0);
      const balance = parseFloat(row.Balance || row.balance || row.BALANCE || 0);
      const reference = row.Reference || row.reference || row.REFERENCE || row["Reference Number"] || "";
      if (dateStr && description && amount !== 0) {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          transactions.push({
            date,
            description: String(description),
            amount,
            balance: isNaN(balance) ? undefined : balance,
            reference: String(reference || ""),
            matched: false,
          });
        }
      }
    }
    if (transactions.length === 0) {
      return res.status(400).json({ message: "No valid transactions found in file" });
    }
    const statement = new Statement({
      type,
      accountName,
      statementDate: new Date(statementDate),
      transactions,
      uploadedBy: req.user?._id,
    });
    await statement.save();
    res.status(201).json(statement);
  } catch (error: any) {
    console.error("Statement upload error:", error);
    res.status(500).json({ message: error.message || "Failed to upload statement" });
  }
});

router.get("/", async (req: AuthRequest, res) => {
  try {
    const statements = await Statement.find()
      .populate("uploadedBy reconciledBy")
      .sort({ statementDate: -1 });
    res.json(statements);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to load statements" });
  }
});

router.get("/:id", async (req: AuthRequest, res) => {
  try {
    const statement = await Statement.findById(req.params.id).populate("uploadedBy reconciledBy");
    if (!statement) {
      return res.status(404).json({ message: "Statement not found" });
    }
    res.json(statement);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to load statement" });
  }
});

router.post("/:id/reconcile", async (req: AuthRequest, res) => {
  try {
    const statement = await Statement.findById(req.params.id);
    if (!statement) {
      return res.status(404).json({ message: "Statement not found" });
    }
    const payments = await Payment.find({
      method: statement.type === "bank" ? { $in: ["bank", "bank_transfer", "neft", "rtgs", "imps"] } : "credit_card",
      accountOrCompany: { $regex: statement.accountName, $options: "i" },
    }).populate("bookingId");
    const bookings = await Booking.find().populate("customerId");
    const unmatchedTransactions: any[] = [];
    for (const transaction of statement.transactions) {
      if (transaction.matched) continue;
      let matched = false;
      for (const payment of payments) {
        const paymentDate = new Date(payment.date);
        const transactionDate = new Date(transaction.date);
        const dateDiff = Math.abs(paymentDate.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24);
        const amountMatch = Math.abs(payment.amount - Math.abs(transaction.amount)) < 1;
        if (dateDiff <= 7 && amountMatch) {
          transaction.matched = true;
          transaction.matchedPaymentId = payment._id;
          transaction.matchedBookingId = payment.bookingId;
          matched = true;
          break;
        }
      }
      if (!matched) {
        unmatchedTransactions.push(transaction);
      }
    }
    statement.reconciled = true;
    statement.reconciledAt = new Date();
    statement.reconciledBy = req.user?._id ? new mongoose.Types.ObjectId(req.user._id.toString()) : null;
    await statement.save();
    res.json({
      statement,
      unmatchedTransactions,
      matchedCount: statement.transactions.filter((t: any) => t.matched).length,
      unmatchedCount: unmatchedTransactions.length,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to reconcile statement" });
  }
});

router.post("/:id/match-transaction", async (req: AuthRequest, res) => {
  try {
    const { transactionIndex, paymentId, bookingId } = req.body;
    const statement = await Statement.findById(req.params.id);
    if (!statement) {
      return res.status(404).json({ message: "Statement not found" });
    }
    if (transactionIndex < 0 || transactionIndex >= statement.transactions.length) {
      return res.status(400).json({ message: "Invalid transaction index" });
    }
    const transaction = statement.transactions[transactionIndex];
    if (!transaction) {
      return res.status(400).json({ message: "Transaction not found" });
    }
    transaction.matched = true;
    if (paymentId) {
      transaction.matchedPaymentId = paymentId as any;
    }
    if (bookingId) {
      transaction.matchedBookingId = bookingId as any;
    }
    await statement.save();
    res.json(statement);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to match transaction" });
  }
});

router.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const statement = await Statement.findByIdAndDelete(req.params.id);
    if (!statement) {
      return res.status(404).json({ message: "Statement not found" });
    }
    res.json({ message: "Statement deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to delete statement" });
  }
});

export default router;

