import mongoose from "mongoose";

const statementSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["bank", "credit_card"], required: true },
    accountName: { type: String, required: true },
    statementDate: { type: Date, required: true },
    transactions: [
      {
        date: { type: Date, required: true },
        description: { type: String, required: true },
        amount: { type: Number, required: true },
        balance: { type: Number },
        reference: { type: String },
        matched: { type: Boolean, default: false },
        matchedPaymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
        matchedBookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
      },
    ],
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reconciled: { type: Boolean, default: false },
    reconciledAt: { type: Date },
    reconciledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Statement = mongoose.model("Statement", statementSchema);
