"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paymentSchema = new mongoose_1.default.Schema({
    bookingId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Booking", required: true },
    customerId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Customer", required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    method: { type: String },
    type: { type: String },
    accountOrCompany: { type: String },
    note: { type: String },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
exports.Payment = mongoose_1.default.model("Payment", paymentSchema);
//# sourceMappingURL=Payment.js.map