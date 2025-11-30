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
const Customer_1 = require("../models/Customer");
const Booking_1 = require("../models/Booking");
const Payment_1 = require("../models/Payment");
const auth_1 = require("../middleware/auth");
const XLSX = __importStar(require("xlsx"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.use(auth_1.authenticate);
router.post("/bookings", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
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
        const results = {
            customersCreated: 0,
            bookingsCreated: 0,
            errors: [],
        };
        for (const row of data) {
            try {
                const customerName = row["Customer Name"] || row["Customer"] || row.customer || row.Customer || "";
                const customerPhone = row["Phone"] || row.phone || row.Phone || "";
                const customerEmail = row["Email"] || row.email || row.Email || "";
                if (!customerName) {
                    results.errors.push(`Row ${data.indexOf(row) + 2}: Missing customer name`);
                    continue;
                }
                let customer = await Customer_1.Customer.findOne({
                    $or: [
                        { name: customerName },
                        { phone: customerPhone },
                        { email: customerEmail },
                    ],
                });
                if (!customer) {
                    customer = new Customer_1.Customer({
                        name: customerName,
                        phone: customerPhone || "",
                        email: customerEmail || "",
                        companyName: row["Company Name"] || row["Company"] || "",
                        address: row["Address"] || row.address || "",
                        stateCode: row["State Code"] || row["State"] || "",
                        gstin: row["GSTIN"] || row.gstin || "",
                        createdBy: req.user?._id,
                    });
                    await customer.save();
                    results.customersCreated++;
                }
                const type = (row["Type"] || row.type || "other").toLowerCase();
                const soldAt = parseFloat(row["Sold At"] || row["Sold"] || row.soldAt || row.sold || 0);
                const supplierCost = parseFloat(row["Supplier Cost"] || row["Cost"] || row.supplierCost || row.cost || 0);
                const travelDateStr = row["Travel Date"] || row["Travel"] || row.travelDate || row.travel || "";
                const travelDate = travelDateStr ? new Date(travelDateStr) : new Date();
                const bookingDateStr = row["Booking Date"] || row["Booking"] || row.bookingDate || row.booking || "";
                const bookingDate = bookingDateStr ? new Date(bookingDateStr) : new Date();
                const totalReceived = parseFloat(row["Received"] || row.received || row["Total Received"] || 0);
                const remainingBalance = soldAt - totalReceived;
                const profit = soldAt - supplierCost;
                const trueCost = supplierCost;
                const booking = new Booking_1.Booking({
                    customerId: customer._id,
                    type,
                    from: row["From"] || row.from || "",
                    to: row["To"] || row.to || "",
                    airlineOrHotel: row["Airline/Hotel"] || row["Airline"] || row["Hotel"] || row.airlineOrHotel || "",
                    pnr: row["PNR"] || row.pnr || "",
                    travelDate,
                    bookingDate,
                    soldAt,
                    supplierCost,
                    trueCost,
                    profit,
                    totalReceived,
                    remainingBalance,
                    paymentStatus: remainingBalance <= 0 ? "paid" : totalReceived > 0 ? "partial" : "unpaid",
                    createdBy: req.user?._id,
                });
                await booking.save();
                if (totalReceived > 0) {
                    const payment = new Payment_1.Payment({
                        bookingId: booking._id,
                        amount: totalReceived,
                        date: bookingDate,
                        method: row["Payment Method"] || row["Method"] || row.paymentMethod || "cash",
                        accountOrCompany: row["Account"] || row.account || "",
                        createdBy: req.user?._id,
                    });
                    await payment.save();
                }
                results.bookingsCreated++;
            }
            catch (error) {
                results.errors.push(`Row ${data.indexOf(row) + 2}: ${error.message}`);
            }
        }
        res.json(results);
    }
    catch (error) {
        console.error("Import error:", error);
        res.status(500).json({ message: error.message || "Failed to import bookings" });
    }
});
router.post("/tally", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
        const results = {
            customersCreated: 0,
            bookingsCreated: 0,
            paymentsCreated: 0,
            errors: [],
        };
        for (const sheetName of workbook.SheetNames) {
            const worksheet = workbook.Sheets[sheetName];
            if (!worksheet)
                continue;
            const data = XLSX.utils.sheet_to_json(worksheet);
            for (const row of data) {
                try {
                    const customerName = row["Party Name"] || row["Party"] || row.partyName || row.party || "";
                    if (!customerName)
                        continue;
                    let customer = await Customer_1.Customer.findOne({ name: customerName });
                    if (!customer) {
                        customer = new Customer_1.Customer({
                            name: customerName,
                            phone: row["Phone"] || row.phone || "",
                            email: row["Email"] || row.email || "",
                            address: row["Address"] || row.address || "",
                            gstin: row["GSTIN"] || row.gstin || "",
                            createdBy: req.user?._id,
                        });
                        await customer.save();
                        results.customersCreated++;
                    }
                    const voucherType = row["Voucher Type"] || row["Voucher"] || row.voucherType || "";
                    if (voucherType && voucherType.toLowerCase().includes("payment")) {
                        const amount = parseFloat(row["Amount"] || row.amount || 0);
                        if (amount > 0) {
                            const booking = await Booking_1.Booking.findOne({ customerId: customer._id }).sort({ createdAt: -1 });
                            if (booking) {
                                const payment = new Payment_1.Payment({
                                    bookingId: booking._id,
                                    amount,
                                    date: row["Date"] ? new Date(row["Date"]) : new Date(),
                                    method: "cash",
                                    createdBy: req.user?._id,
                                });
                                await payment.save();
                                results.paymentsCreated++;
                            }
                        }
                    }
                    else {
                        const amount = parseFloat(row["Amount"] || row.amount || 0);
                        if (amount > 0) {
                            const booking = new Booking_1.Booking({
                                customerId: customer._id,
                                type: "other",
                                soldAt: amount,
                                supplierCost: amount * 0.8,
                                trueCost: amount * 0.8,
                                profit: amount * 0.2,
                                totalReceived: 0,
                                remainingBalance: amount,
                                paymentStatus: "unpaid",
                                travelDate: row["Date"] ? new Date(row["Date"]) : new Date(),
                                bookingDate: row["Date"] ? new Date(row["Date"]) : new Date(),
                                createdBy: req.user?._id,
                            });
                            await booking.save();
                            results.bookingsCreated++;
                        }
                    }
                }
                catch (error) {
                    results.errors.push(`Sheet ${sheetName}, Row ${data.indexOf(row) + 2}: ${error.message}`);
                }
            }
        }
        res.json(results);
    }
    catch (error) {
        console.error("Tally import error:", error);
        res.status(500).json({ message: error.message || "Failed to import from Tally" });
    }
});
exports.default = router;
//# sourceMappingURL=import.js.map