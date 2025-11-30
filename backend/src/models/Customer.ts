import mongoose from "mongoose";

const travelerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  designation: { type: String },
  employeeId: { type: String },
}, { _id: true, timestamps: false });

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    companyName: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    stateCode: { type: String },
    gstNumber: { type: String },
    gstin: { type: String },
    reference: { type: String },
    tags: [{ type: String }],
    travelers: [travelerSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Customer = mongoose.model("Customer", customerSchema);



