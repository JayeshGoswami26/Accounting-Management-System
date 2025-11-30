import { Router } from "express";
import multer from "multer";
import { Customer } from "../models/Customer";
import { Booking } from "../models/Booking";
import { Payment } from "../models/Payment";
import { authenticate, AuthRequest } from "../middleware/auth";
import * as XLSX from "xlsx";
import mongoose from "mongoose";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticate);

router.post("/bookings", upload.single("file"), async (req: AuthRequest, res) => {
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
      errors: [] as string[],
    };
    for (const row of data as any[]) {
      try {
        const customerName = row["Customer Name"] || row["Customer"] || row.customer || row.Customer || "";
        const customerPhone = row["Phone"] || row.phone || row.Phone || "";
        const customerEmail = row["Email"] || row.email || row.Email || "";
        if (!customerName) {
          results.errors.push(`Row ${data.indexOf(row) + 2}: Missing customer name`);
          continue;
        }
        let customer = await Customer.findOne({
          $or: [
            { name: customerName },
            { phone: customerPhone },
            { email: customerEmail },
          ],
        });
        if (!customer) {
          customer = new Customer({
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
        const booking = new Booking({
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
          const payment = new Payment({
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
      } catch (error: any) {
        results.errors.push(`Row ${data.indexOf(row) + 2}: ${error.message}`);
      }
    }
    res.json(results);
  } catch (error: any) {
    console.error("Import error:", error);
    res.status(500).json({ message: error.message || "Failed to import bookings" });
  }
});

router.post("/tally", upload.single("file"), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const results = {
      customersCreated: 0,
      bookingsCreated: 0,
      paymentsCreated: 0,
      errors: [] as string[],
    };
    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) continue;
      const data = XLSX.utils.sheet_to_json(worksheet);
      for (const row of data as any[]) {
        try {
          const customerName = row["Party Name"] || row["Party"] || row.partyName || row.party || "";
          if (!customerName) continue;
          let customer = await Customer.findOne({ name: customerName });
          if (!customer) {
            customer = new Customer({
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
              const booking = await Booking.findOne({ customerId: customer._id }).sort({ createdAt: -1 });
              if (booking) {
                const payment = new Payment({
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
          } else {
            const amount = parseFloat(row["Amount"] || row.amount || 0);
            if (amount > 0) {
              const booking = new Booking({
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
        } catch (error: any) {
          results.errors.push(`Sheet ${sheetName}, Row ${data.indexOf(row) + 2}: ${error.message}`);
        }
      }
    }
    res.json(results);
  } catch (error: any) {
    console.error("Tally import error:", error);
    res.status(500).json({ message: error.message || "Failed to import from Tally" });
  }
});

export default router;

