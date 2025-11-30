import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    method: { 
      type: String, 
      enum: ["cash", "upi", "credit_card", "bank_transfer", "cheque"],
      required: true 
    },
    accountOrCompany: { type: String },
    note: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Refund = mongoose.model("Refund", refundSchema);


