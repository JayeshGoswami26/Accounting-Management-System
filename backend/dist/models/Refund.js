"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Refund = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const refundSchema = new mongoose_1.default.Schema({
    customerId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Customer", required: true },
    bookingId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Booking", required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    method: {
        type: String,
        enum: ["cash", "upi", "credit_card", "bank_transfer", "cheque"],
        required: true
    },
    accountOrCompany: { type: String },
    note: { type: String },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
exports.Refund = mongoose_1.default.model("Refund", refundSchema);
//# sourceMappingURL=Refund.js.map