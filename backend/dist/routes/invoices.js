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
const Invoice_1 = require("../models/Invoice");
const Booking_1 = require("../models/Booking");
const Settings_1 = require("../models/Settings");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Optional authentication for invoices
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
    const invoices = await Invoice_1.Invoice.find()
        .sort({ invoiceDate: -1 })
        .populate("customerId bookingIds createdBy updatedBy");
    res.json(invoices);
});
router.get("/:id", optionalAuth, async (req, res) => {
    const invoice = await Invoice_1.Invoice.findById(req.params.id).populate("customerId bookingIds createdBy updatedBy");
    if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
    }
    res.json(invoice);
});
router.post("/from-booking/:bookingId", optionalAuth, async (req, res) => {
    const booking = await Booking_1.Booking.findById(req.params.bookingId).populate("customerId");
    if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
    }
    const existingInvoice = await Invoice_1.Invoice.findOne({ bookingId: booking._id });
    if (existingInvoice) {
        return res.status(400).json({ message: "Invoice already exists for this booking. Please edit the existing invoice.", invoiceId: existingInvoice._id });
    }
    const { Customer } = await Promise.resolve().then(() => __importStar(require("../models/Customer")));
    const customerId = booking.customerId?._id || booking.customerId;
    const customer = await Customer.findById(customerId);
    if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
    }
    let settings = await Settings_1.Settings.findOne();
    if (!settings) {
        settings = new Settings_1.Settings({});
        await settings.save();
    }
    const body = req.body || {};
    const baseSellingAmount = body.baseSellingAmount ?? booking.soldAt;
    const serviceCharge = body.serviceCharge ?? 0;
    const gstCalculationMethod = body.gstCalculationMethod || "service_charge_only";
    const customerStateCode = customer?.stateCode || "";
    const companyStateCode = settings?.stateCode || "";
    const isSameState = customerStateCode && companyStateCode && customerStateCode === companyStateCode;
    let sgst = 0;
    let cgst = 0;
    let igst = 0;
    let gstType = "igst";
    let totalGst = 0;
    if (gstCalculationMethod === "full_amount") {
        const billAmount = baseSellingAmount + serviceCharge;
        if (isSameState) {
            sgst = Math.round((billAmount * 0.09) * 100) / 100;
            cgst = Math.round((billAmount * 0.09) * 100) / 100;
            gstType = "sgst_cgst";
        }
        else {
            igst = Math.round((billAmount * 0.18) * 100) / 100;
            gstType = "igst";
        }
        totalGst = sgst + cgst + igst;
    }
    else {
        if (isSameState) {
            sgst = Math.round((serviceCharge * 0.09) * 100) / 100;
            cgst = Math.round((serviceCharge * 0.09) * 100) / 100;
            gstType = "sgst_cgst";
        }
        else {
            igst = Math.round((serviceCharge * 0.18) * 100) / 100;
            gstType = "igst";
        }
        totalGst = sgst + cgst + igst;
    }
    const totalAmount = baseSellingAmount + serviceCharge + totalGst;
    const amountReceived = body.amountReceived ?? 0;
    const remainingAmount = totalAmount - amountReceived;
    let paymentStatus = "unpaid";
    if (remainingAmount <= 0) {
        paymentStatus = "paid";
    }
    else if (amountReceived > 0) {
        paymentStatus = "partial";
    }
    let serviceChargeGst18 = 0;
    let serviceChargeGst5 = 0;
    if (gstCalculationMethod === "service_charge_5") {
        serviceChargeGst5 = totalGst;
    }
    else if (gstCalculationMethod === "selling_amount_5") {
        // Already calculated above
    }
    else {
        serviceChargeGst18 = totalGst;
    }
    const invoice = new Invoice_1.Invoice({
        customerId: booking.customerId,
        bookingIds: [booking._id],
        invoiceNumber: body.invoiceNumber,
        invoiceDate: body.invoiceDate ? new Date(body.invoiceDate) : new Date(),
        baseSellingAmount,
        serviceCharge,
        serviceChargeGst18,
        serviceChargeGst5,
        sgst,
        cgst,
        igst,
        totalAmount,
        amountReceived,
        remainingAmount,
        paymentStatus,
        customerGstin: customer?.gstin || customer?.gstNumber || "",
        gstType,
        gstCalculationMethod,
        createdBy: req.user?._id ? new mongoose_1.default.Types.ObjectId(req.user._id) : null,
    });
    await invoice.save();
    const populated = await Invoice_1.Invoice.findById(invoice._id).populate("customerId bookingIds createdBy");
    res.status(201).json(populated);
});
router.put("/:id", optionalAuth, async (req, res) => {
    const invoice = await Invoice_1.Invoice.findById(req.params.id);
    if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
    }
    const body = req.body || {};
    if (body.bookingIds) {
        invoice.bookingIds = body.bookingIds;
    }
    if (body.invoiceNumber) {
        invoice.invoiceNumber = body.invoiceNumber;
    }
    if (body.invoiceDate) {
        invoice.invoiceDate = new Date(body.invoiceDate);
    }
    const bookings = await Booking_1.Booking.find({ _id: { $in: invoice.bookingIds } }).populate("customerId");
    const customerId = bookings[0]?.customerId?._id || bookings[0]?.customerId;
    const { Customer } = await Promise.resolve().then(() => __importStar(require("../models/Customer")));
    const customer = await Customer.findById(customerId);
    let settings = await Settings_1.Settings.findOne();
    if (!settings) {
        settings = new Settings_1.Settings({});
        await settings.save();
    }
    if (body.baseSellingAmount !== undefined || body.serviceCharge !== undefined || body.gstCalculationMethod !== undefined) {
        const baseSellingAmount = body.baseSellingAmount ?? invoice.baseSellingAmount;
        const serviceCharge = body.serviceCharge ?? invoice.serviceCharge;
        const gstCalculationMethod = invoice.gstCalculationMethod || body.gstCalculationMethod || "service_charge_only";
        const customerStateCode = customer?.stateCode || "";
        const companyStateCode = settings?.stateCode || "";
        const isSameState = customerStateCode && companyStateCode && customerStateCode === companyStateCode;
        let sgst = 0;
        let cgst = 0;
        let igst = 0;
        let gstType = "igst";
        let totalGst = 0;
        let serviceChargeGst18 = 0;
        let serviceChargeGst5 = 0;
        if (gstCalculationMethod === "service_charge_5") {
            if (isSameState) {
                sgst = Math.round((serviceCharge * 0.025) * 100) / 100;
                cgst = Math.round((serviceCharge * 0.025) * 100) / 100;
                gstType = "sgst_cgst";
            }
            else {
                igst = Math.round((serviceCharge * 0.05) * 100) / 100;
                gstType = "igst";
            }
            serviceChargeGst5 = sgst + cgst + igst;
            totalGst = serviceChargeGst5;
        }
        else if (gstCalculationMethod === "selling_amount_5") {
            const billAmount = baseSellingAmount + serviceCharge;
            if (isSameState) {
                sgst = Math.round((billAmount * 0.025) * 100) / 100;
                cgst = Math.round((billAmount * 0.025) * 100) / 100;
                gstType = "sgst_cgst";
            }
            else {
                igst = Math.round((billAmount * 0.05) * 100) / 100;
                gstType = "igst";
            }
            totalGst = sgst + cgst + igst;
        }
        else if (gstCalculationMethod === "full_amount") {
            const billAmount = baseSellingAmount + serviceCharge;
            if (isSameState) {
                sgst = Math.round((billAmount * 0.09) * 100) / 100;
                cgst = Math.round((billAmount * 0.09) * 100) / 100;
                gstType = "sgst_cgst";
            }
            else {
                igst = Math.round((billAmount * 0.18) * 100) / 100;
                gstType = "igst";
            }
            totalGst = sgst + cgst + igst;
        }
        else {
            if (isSameState) {
                sgst = Math.round((serviceCharge * 0.09) * 100) / 100;
                cgst = Math.round((serviceCharge * 0.09) * 100) / 100;
                gstType = "sgst_cgst";
            }
            else {
                igst = Math.round((serviceCharge * 0.18) * 100) / 100;
                gstType = "igst";
            }
            serviceChargeGst18 = sgst + cgst + igst;
            totalGst = serviceChargeGst18;
        }
        invoice.baseSellingAmount = baseSellingAmount;
        invoice.serviceCharge = serviceCharge;
        invoice.serviceChargeGst18 = serviceChargeGst18;
        invoice.serviceChargeGst5 = serviceChargeGst5;
        invoice.sgst = sgst;
        invoice.cgst = cgst;
        invoice.igst = igst;
        invoice.gstType = gstType;
        invoice.totalAmount = baseSellingAmount + serviceCharge + totalGst;
        invoice.remainingAmount = invoice.totalAmount - (body.amountReceived ?? invoice.amountReceived);
        invoice.paymentStatus = invoice.remainingAmount <= 0 ? "paid" : (invoice.remainingAmount < invoice.totalAmount ? "partial" : "unpaid");
    }
    if (body.amountReceived !== undefined) {
        invoice.amountReceived = body.amountReceived;
        invoice.remainingAmount = invoice.totalAmount - body.amountReceived;
        invoice.paymentStatus = invoice.remainingAmount <= 0 ? "paid" : (invoice.remainingAmount < invoice.totalAmount ? "partial" : "unpaid");
    }
    if (body.gstCalculationMethod !== undefined) {
        invoice.gstCalculationMethod = body.gstCalculationMethod;
    }
    invoice.updatedBy = req.user?._id ? new mongoose_1.default.Types.ObjectId(req.user._id) : null;
    await invoice.save();
    const populated = await Invoice_1.Invoice.findById(invoice._id).populate("customerId bookingIds createdBy updatedBy");
    res.json(populated);
});
router.get("/:id/export/csv", async (req, res) => {
    const invoice = await Invoice_1.Invoice.findById(req.params.id).populate("customerId bookingId");
    if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
    }
    let settings = await Settings_1.Settings.findOne();
    if (!settings) {
        settings = new Settings_1.Settings({});
    }
    const inv = invoice;
    const bookings = inv.bookingIds || [];
    let bookingDetailsRows = [];
    for (const booking of bookings) {
        const b = booking;
        if (b.type === "flight") {
            bookingDetailsRows.push([
                "Flight",
                b.from || "N/A",
                b.to || "N/A",
                b.airlineOrHotel || "N/A",
                b.pnr || "N/A",
                b.travelDate ? new Date(b.travelDate).toLocaleDateString() : "N/A",
                b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : "N/A",
                "",
                "",
                String(b.soldAt || 0)
            ]);
        }
        else if (b.type === "hotel") {
            bookingDetailsRows.push([
                "Hotel",
                "",
                "",
                b.airlineOrHotel || "N/A",
                "",
                "",
                b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : "N/A",
                b.checkInDate ? new Date(b.checkInDate).toLocaleDateString() : "N/A",
                b.checkOutDate ? new Date(b.checkOutDate).toLocaleDateString() : "N/A",
                String(b.soldAt || 0)
            ]);
        }
        else if (b.type === "package") {
            bookingDetailsRows.push([
                "Package",
                "",
                "",
                b.details || "N/A",
                "",
                b.startDate ? new Date(b.startDate).toLocaleDateString() : "N/A",
                b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : "N/A",
                "",
                "",
                String(b.soldAt || 0)
            ]);
        }
        else {
            bookingDetailsRows.push([
                "Other",
                b.from || "N/A",
                b.to || "N/A",
                b.details || "N/A",
                "",
                b.travelDate ? new Date(b.travelDate).toLocaleDateString() : "N/A",
                b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : "N/A",
                "",
                "",
                String(b.soldAt || 0)
            ]);
        }
    }
    const gstTerms = `GST Terms & Conditions:\n1. GST is charged as per applicable rates.\n2. ${inv.gstType === "sgst_cgst" ? "SGST and CGST are applicable for intra-state supply." : "IGST is applicable for inter-state supply."}\n3. Invoice is subject to GST rules and regulations.\n4. All disputes are subject to jurisdiction of courts.`;
    const rows = [
        ["INVOICE", ""],
        ["", ""],
        ["Invoice Number", inv.invoiceNumber || ""],
        ["Invoice Date", inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString() : ""],
        ["", ""],
        ["Company Details", ""],
        ["Company Name", settings.companyName || ""],
        ["Address", settings.address || ""],
        ["City, State, Pincode", [settings.city, settings.state, settings.pincode].filter(Boolean).join(", ")],
        ["Contact Number", settings.contactNumber || ""],
        ["Email", settings.email || ""],
        ["GSTIN", settings.gstin || ""],
        ["PAN", settings.panNumber || ""],
        ["", ""],
        ["Customer Details", ""],
        ["Customer Name", inv.customerId?.companyName || inv.customerId?.name || ""],
        ["Address", inv.customerId?.address || ""],
        ["Phone", inv.customerId?.phone || ""],
        ["Email", inv.customerId?.email || ""],
        ["GSTIN", inv.customerGstin || ""],
        ["", ""],
        ["Booking Details", ""],
        ["Type", "From", "To", "Hotel/Airline/City", "PNR", "Travel Date", "Booking Date", "Check-in", "Check-out", "Amount"],
        ...bookingDetailsRows,
        ["", ""],
        ["Invoice Details", ""],
        ["Base Selling Amount", inv.baseSellingAmount || 0],
        ["Service Charge", inv.serviceCharge || 0],
        inv.gstType === "sgst_cgst"
            ? ["SGST (9%)", inv.sgst || 0]
            : ["IGST (18%)", inv.igst || inv.serviceChargeGst18 || 0],
        inv.gstType === "sgst_cgst" ? ["CGST (9%)", inv.cgst || 0] : ["", ""],
        ["Total Amount", inv.totalAmount || 0],
        ["Amount Received", inv.amountReceived || 0],
        ["Remaining Amount", inv.remainingAmount || 0],
        ["Payment Status", inv.paymentStatus || ""],
        ["", ""],
        ["GST Terms & Conditions", ""],
        ...gstTerms.split("\n").map(line => {
            const parts = line.split(":");
            return [parts[0] || "", parts.slice(1).join(":") || ""];
        }),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${inv.invoiceNumber || inv._id}.csv`);
    res.send(csv);
});
router.get("/export/csv", async (req, res) => {
    const invoices = await Invoice_1.Invoice.find().sort({ invoiceDate: -1 }).populate("customerId bookingIds");
    const headers = [
        "Invoice Number",
        "Invoice Date",
        "Customer Name",
        "Customer Phone",
        "Base Selling Amount",
        "Service Charge",
        "SGST",
        "CGST",
        "IGST",
        "Total GST",
        "Total Amount",
        "Amount Received",
        "Remaining Amount",
        "Payment Status",
        "GST Type",
    ];
    const rows = invoices.map((inv) => [
        inv.invoiceNumber || "",
        inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString() : "",
        inv.customerId?.companyName || inv.customerId?.name || "",
        inv.customerId?.phone || "",
        inv.baseSellingAmount || 0,
        inv.serviceCharge || 0,
        inv.sgst || 0,
        inv.cgst || 0,
        inv.igst || 0,
        inv.serviceChargeGst18 || 0,
        inv.totalAmount || 0,
        inv.amountReceived || 0,
        inv.remainingAmount || 0,
        inv.paymentStatus || "",
        inv.gstType || "igst",
    ]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=invoices.csv");
    res.send(csv);
});
router.get("/:id/export/docx", async (req, res) => {
    try {
        const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType } = await Promise.resolve().then(() => __importStar(require("docx")));
        const invoice = await Invoice_1.Invoice.findById(req.params.id).populate("customerId bookingId");
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        let settings = await Settings_1.Settings.findOne();
        if (!settings) {
            settings = new Settings_1.Settings({});
        }
        const inv = invoice;
        const booking = inv.bookingId || {};
        const companyName = settings.companyName || "Travel Agency";
        const companyAddress = settings.address || "";
        const companyCityState = [settings.city, settings.state, settings.pincode].filter(Boolean).join(", ");
        const companyContact = settings.contactNumber || "";
        const companyEmail = settings.email || "";
        const companyGstin = settings.gstin || "";
        const companyPan = settings.panNumber || "";
        const customerName = inv.customerId?.companyName || inv.customerId?.name || "";
        const customerAddress = inv.customerId?.address || "";
        const customerPhone = inv.customerId?.phone || "";
        const customerEmail = inv.customerId?.email || "";
        const customerGstin = inv.customerGstin || "";
        const invoiceDate = inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString() : "";
        const travelerName = booking.travelerName || "";
        let bookingDetails = [];
        if (booking.type === "flight") {
            bookingDetails = [
                new Paragraph({
                    text: "Flight Details:",
                    heading: HeadingLevel.HEADING_3,
                }),
                new Paragraph({
                    text: `From: ${booking.from || "N/A"}`,
                }),
                new Paragraph({
                    text: `To: ${booking.to || "N/A"}`,
                }),
                new Paragraph({
                    text: `Airline: ${booking.airlineOrHotel || "N/A"}`,
                }),
                new Paragraph({
                    text: `PNR: ${booking.pnr || "N/A"}`,
                }),
                new Paragraph({
                    text: `Travel Date: ${booking.travelDate ? new Date(booking.travelDate).toLocaleDateString() : "N/A"}`,
                }),
            ];
        }
        else if (booking.type === "hotel") {
            bookingDetails = [
                new Paragraph({
                    text: "Hotel Details:",
                    heading: HeadingLevel.HEADING_3,
                }),
                new Paragraph({
                    text: `Hotel: ${booking.airlineOrHotel || "N/A"}`,
                }),
                new Paragraph({
                    text: `City: ${booking.city || "N/A"}`,
                }),
                new Paragraph({
                    text: `Check-in: ${booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : "N/A"}`,
                }),
                new Paragraph({
                    text: `Check-out: ${booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : "N/A"}`,
                }),
                new Paragraph({
                    text: `Rooms: ${booking.rooms || "N/A"}`,
                }),
                new Paragraph({
                    text: `Room Type: ${booking.roomTypeOrStop || "N/A"}`,
                }),
            ];
        }
        else if (booking.type === "package") {
            bookingDetails = [
                new Paragraph({
                    text: "Package Details:",
                    heading: HeadingLevel.HEADING_3,
                }),
                new Paragraph({
                    text: `Description: ${booking.details || "N/A"}`,
                }),
                new Paragraph({
                    text: `Start Date: ${booking.startDate ? new Date(booking.startDate).toLocaleDateString() : "N/A"}`,
                }),
                new Paragraph({
                    text: `End Date: ${booking.endDate ? new Date(booking.endDate).toLocaleDateString() : "N/A"}`,
                }),
            ];
        }
        else {
            bookingDetails = [
                new Paragraph({
                    text: "Service Details:",
                    heading: HeadingLevel.HEADING_3,
                }),
                new Paragraph({
                    text: `From: ${booking.from || "N/A"}`,
                }),
                new Paragraph({
                    text: `To: ${booking.to || "N/A"}`,
                }),
                new Paragraph({
                    text: `Details: ${booking.details || "N/A"}`,
                }),
            ];
        }
        const gstTerms = [
            new Paragraph({
                text: "GST Terms & Conditions:",
                heading: HeadingLevel.HEADING_3,
            }),
            new Paragraph({
                text: "1. GST is charged as per applicable rates.",
            }),
            new Paragraph({
                text: inv.gstType === "sgst_cgst"
                    ? "2. SGST and CGST are applicable for intra-state supply."
                    : "2. IGST is applicable for inter-state supply.",
            }),
            new Paragraph({
                text: "3. Invoice is subject to GST rules and regulations.",
            }),
            new Paragraph({
                text: "4. All disputes are subject to jurisdiction of courts.",
            }),
        ];
        const doc = new Document({
            sections: [
                {
                    children: [
                        new Paragraph({
                            text: companyName,
                            heading: HeadingLevel.HEADING_1,
                            alignment: AlignmentType.LEFT,
                        }),
                        ...(companyAddress
                            ? [
                                new Paragraph({
                                    text: companyAddress,
                                    alignment: AlignmentType.LEFT,
                                }),
                            ]
                            : []),
                        ...(companyCityState
                            ? [
                                new Paragraph({
                                    text: companyCityState,
                                    alignment: AlignmentType.LEFT,
                                }),
                            ]
                            : []),
                        ...(companyContact
                            ? [
                                new Paragraph({
                                    text: `Phone: ${companyContact}`,
                                    alignment: AlignmentType.LEFT,
                                }),
                            ]
                            : []),
                        ...(companyEmail
                            ? [
                                new Paragraph({
                                    text: `Email: ${companyEmail}`,
                                    alignment: AlignmentType.LEFT,
                                }),
                            ]
                            : []),
                        ...(companyGstin
                            ? [
                                new Paragraph({
                                    text: `GSTIN: ${companyGstin}`,
                                    alignment: AlignmentType.LEFT,
                                }),
                            ]
                            : []),
                        ...(companyPan
                            ? [
                                new Paragraph({
                                    text: `PAN: ${companyPan}`,
                                    alignment: AlignmentType.LEFT,
                                }),
                            ]
                            : []),
                        new Paragraph({ text: "" }),
                        new Paragraph({
                            text: "INVOICE",
                            heading: HeadingLevel.HEADING_2,
                            alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({ text: "" }),
                        new Table({
                            width: { size: 100, type: WidthType.PERCENTAGE },
                            rows: [
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [
                                                new Paragraph({
                                                    text: "Invoice Number:",
                                                    alignment: AlignmentType.LEFT,
                                                }),
                                            ],
                                        }),
                                        new TableCell({
                                            children: [
                                                new Paragraph({
                                                    text: inv.invoiceNumber || "",
                                                    alignment: AlignmentType.LEFT,
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [
                                                new Paragraph({
                                                    text: "Invoice Date:",
                                                    alignment: AlignmentType.LEFT,
                                                }),
                                            ],
                                        }),
                                        new TableCell({
                                            children: [
                                                new Paragraph({
                                                    text: invoiceDate,
                                                    alignment: AlignmentType.LEFT,
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        new Paragraph({ text: "" }),
                        new Paragraph({
                            text: "Bill To:",
                            heading: HeadingLevel.HEADING_3,
                        }),
                        new Paragraph({
                            text: customerName,
                        }),
                        ...(customerAddress
                            ? [
                                new Paragraph({
                                    text: customerAddress,
                                }),
                            ]
                            : []),
                        ...(customerPhone
                            ? [
                                new Paragraph({
                                    text: `Phone: ${customerPhone}`,
                                }),
                            ]
                            : []),
                        ...(customerEmail
                            ? [
                                new Paragraph({
                                    text: `Email: ${customerEmail}`,
                                }),
                            ]
                            : []),
                        ...(customerGstin
                            ? [
                                new Paragraph({
                                    text: `GSTIN: ${customerGstin}`,
                                }),
                            ]
                            : []),
                        new Paragraph({ text: "" }),
                        ...bookingDetails,
                        new Paragraph({ text: "" }),
                        new Table({
                            width: { size: 100, type: WidthType.PERCENTAGE },
                            rows: [
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [
                                                new Paragraph({
                                                    text: "Description",
                                                    alignment: AlignmentType.LEFT,
                                                }),
                                            ],
                                        }),
                                        new TableCell({
                                            children: [
                                                new Paragraph({
                                                    text: "Amount",
                                                    alignment: AlignmentType.RIGHT,
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [
                                                new Paragraph({
                                                    text: "Base Selling Amount",
                                                    alignment: AlignmentType.LEFT,
                                                }),
                                            ],
                                        }),
                                        new TableCell({
                                            children: [
                                                new Paragraph({
                                                    text: `₹${inv.baseSellingAmount || 0}`,
                                                    alignment: AlignmentType.RIGHT,
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [
                                                new Paragraph({
                                                    text: "Service Charge",
                                                    alignment: AlignmentType.LEFT,
                                                }),
                                            ],
                                        }),
                                        new TableCell({
                                            children: [
                                                new Paragraph({
                                                    text: `₹${inv.serviceCharge || 0}`,
                                                    alignment: AlignmentType.RIGHT,
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                                ...(inv.gstType === "sgst_cgst"
                                    ? [
                                        new TableRow({
                                            children: [
                                                new TableCell({
                                                    children: [
                                                        new Paragraph({
                                                            text: "SGST (9%)",
                                                            alignment: AlignmentType.LEFT,
                                                        }),
                                                    ],
                                                }),
                                                new TableCell({
                                                    children: [
                                                        new Paragraph({
                                                            text: `₹${inv.sgst || 0}`,
                                                            alignment: AlignmentType.RIGHT,
                                                        }),
                                                    ],
                                                }),
                                            ],
                                        }),
                                        new TableRow({
                                            children: [
                                                new TableCell({
                                                    children: [
                                                        new Paragraph({
                                                            text: "CGST (9%)",
                                                            alignment: AlignmentType.LEFT,
                                                        }),
                                                    ],
                                                }),
                                                new TableCell({
                                                    children: [
                                                        new Paragraph({
                                                            text: `₹${inv.cgst || 0}`,
                                                            alignment: AlignmentType.RIGHT,
                                                        }),
                                                    ],
                                                }),
                                            ],
                                        }),
                                    ]
                                    : [
                                        new TableRow({
                                            children: [
                                                new TableCell({
                                                    children: [
                                                        new Paragraph({
                                                            text: "IGST (18%)",
                                                            alignment: AlignmentType.LEFT,
                                                        }),
                                                    ],
                                                }),
                                                new TableCell({
                                                    children: [
                                                        new Paragraph({
                                                            text: `₹${inv.igst || inv.serviceChargeGst18 || 0}`,
                                                            alignment: AlignmentType.RIGHT,
                                                        }),
                                                    ],
                                                }),
                                            ],
                                        }),
                                    ]),
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [
                                                new Paragraph({
                                                    text: "Total Amount",
                                                    alignment: AlignmentType.LEFT,
                                                }),
                                            ],
                                        }),
                                        new TableCell({
                                            children: [
                                                new Paragraph({
                                                    text: `₹${inv.totalAmount || 0}`,
                                                    alignment: AlignmentType.RIGHT,
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [
                                                new Paragraph({
                                                    text: "Amount Received",
                                                    alignment: AlignmentType.LEFT,
                                                }),
                                            ],
                                        }),
                                        new TableCell({
                                            children: [
                                                new Paragraph({
                                                    text: `₹${inv.amountReceived || 0}`,
                                                    alignment: AlignmentType.RIGHT,
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [
                                                new Paragraph({
                                                    text: "Remaining Amount",
                                                    alignment: AlignmentType.LEFT,
                                                }),
                                            ],
                                        }),
                                        new TableCell({
                                            children: [
                                                new Paragraph({
                                                    text: `₹${inv.remainingAmount || 0}`,
                                                    alignment: AlignmentType.RIGHT,
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        new Paragraph({ text: "" }),
                        new Paragraph({
                            text: `Payment Status: ${inv.paymentStatus || "unpaid"}`,
                        }),
                        new Paragraph({ text: "" }),
                        ...gstTerms,
                    ],
                },
            ],
        });
        const buffer = await Packer.toBuffer(doc);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        res.setHeader("Content-Disposition", `attachment; filename=invoice-${inv.invoiceNumber || inv._id}.docx`);
        res.send(buffer);
    }
    catch (error) {
        console.error("Error generating DOCX:", error);
        res.status(500).json({ message: "Failed to generate DOCX", error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=invoices.js.map