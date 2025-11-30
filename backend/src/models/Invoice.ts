import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    bookingIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true }],
    invoiceNumber: { type: String, required: true, unique: true },
    invoiceDate: { type: Date, required: true },
    baseSellingAmount: { type: Number, required: true },
    serviceCharge: { type: Number, default: 0 },
    serviceChargeGst18: { type: Number, default: 0 },
    serviceChargeGst5: { type: Number, default: 0 },
    sgst: { type: Number, default: 0 },
    cgst: { type: Number, default: 0 },
    igst: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    amountReceived: { type: Number, default: 0 },
    remainingAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["unpaid", "partial", "paid"], default: "unpaid" },
    customerGstin: { type: String },
    gstType: { type: String, enum: ["sgst_cgst", "igst"], default: "igst" },
    gstCalculationMethod: { 
      type: String, 
      enum: ["service_charge_only", "full_amount", "service_charge_5", "selling_amount_5"], 
      default: "service_charge_only" 
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Invoice = mongoose.model("Invoice", invoiceSchema);


