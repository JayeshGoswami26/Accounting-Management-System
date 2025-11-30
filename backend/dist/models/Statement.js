"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Statement = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const statementSchema = new mongoose_1.default.Schema({
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
            matchedPaymentId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Payment" },
            matchedBookingId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Booking" },
        },
    ],
    uploadedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    reconciled: { type: Boolean, default: false },
    reconciledAt: { type: Date },
    reconciledBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
exports.Statement = mongoose_1.default.model("Statement", statementSchema);
//# sourceMappingURL=Statement.js.map