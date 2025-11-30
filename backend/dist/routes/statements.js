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
const multer_1 = __importDefault(require("multer"));
const mongoose_1 = __importDefault(require("mongoose"));
const Statement_1 = require("../models/Statement");
const Payment_1 = require("../models/Payment");
const Booking_1 = require("../models/Booking");
const auth_1 = require("../middleware/auth");
const XLSX = __importStar(require("xlsx"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.use(auth_1.authenticate);
router.post("/upload", upload.single("file"), async (req, res) => {
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
        const transactions = [];
        for (const row of data) {
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
        const statement = new Statement_1.Statement({
            type,
            accountName,
            statementDate: new Date(statementDate),
            transactions,
            uploadedBy: req.user?._id,
        });
        await statement.save();
        res.status(201).json(statement);
    }
    catch (error) {
        console.error("Statement upload error:", error);
        res.status(500).json({ message: error.message || "Failed to upload statement" });
    }
});
router.get("/", async (req, res) => {
    try {
        const statements = await Statement_1.Statement.find()
            .populate("uploadedBy reconciledBy")
            .sort({ statementDate: -1 });
        res.json(statements);
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Failed to load statements" });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const statement = await Statement_1.Statement.findById(req.params.id).populate("uploadedBy reconciledBy");
        if (!statement) {
            return res.status(404).json({ message: "Statement not found" });
        }
        res.json(statement);
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Failed to load statement" });
    }
});
router.post("/:id/reconcile", async (req, res) => {
    try {
        const statement = await Statement_1.Statement.findById(req.params.id);
        if (!statement) {
            return res.status(404).json({ message: "Statement not found" });
        }
        const payments = await Payment_1.Payment.find({
            method: statement.type === "bank" ? { $in: ["bank", "bank_transfer", "neft", "rtgs", "imps"] } : "credit_card",
            accountOrCompany: { $regex: statement.accountName, $options: "i" },
        }).populate("bookingId");
        const bookings = await Booking_1.Booking.find().populate("customerId");
        const unmatchedTransactions = [];
        for (const transaction of statement.transactions) {
            if (transaction.matched)
                continue;
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
        statement.reconciledBy = req.user?._id ? new mongoose_1.default.Types.ObjectId(req.user._id.toString()) : null;
        await statement.save();
        res.json({
            statement,
            unmatchedTransactions,
            matchedCount: statement.transactions.filter((t) => t.matched).length,
            unmatchedCount: unmatchedTransactions.length,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Failed to reconcile statement" });
    }
});
router.post("/:id/match-transaction", async (req, res) => {
    try {
        const { transactionIndex, paymentId, bookingId } = req.body;
        const statement = await Statement_1.Statement.findById(req.params.id);
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
            transaction.matchedPaymentId = paymentId;
        }
        if (bookingId) {
            transaction.matchedBookingId = bookingId;
        }
        await statement.save();
        res.json(statement);
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Failed to match transaction" });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const statement = await Statement_1.Statement.findByIdAndDelete(req.params.id);
        if (!statement) {
            return res.status(404).json({ message: "Statement not found" });
        }
        res.json({ message: "Statement deleted" });
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Failed to delete statement" });
    }
});
exports.default = router;
//# sourceMappingURL=statements.js.map