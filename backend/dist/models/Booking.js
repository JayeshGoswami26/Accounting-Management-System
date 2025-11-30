"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bookingSchema = new mongoose_1.default.Schema({
    customerId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Customer", required: true },
    travelerId: { type: String },
    travelerName: { type: String },
    type: { type: String, enum: ["flight", "hotel", "package", "other"], required: true },
    from: { type: String },
    to: { type: String },
    checkInDate: { type: Date },
    checkOutDate: { type: Date },
    startDate: { type: Date },
    endDate: { type: Date },
    city: { type: String },
    airlineOrHotel: { type: String },
    pnr: { type: String },
    tripId: { type: String },
    bookingDate: { type: Date },
    travelDate: { type: Date },
    portal: { type: String },
    details: { type: String },
    rooms: { type: Number },
    roomTypeOrStop: { type: String },
    bookingType: { type: String, enum: ["Normal", "SME", "Corporate", "Flex", "Series Fare", "Non Refundable"] },
    isCancelled: { type: Boolean, default: false },
    isRescheduled: { type: Boolean, default: false },
    chargesToPayAirline: { type: Number, default: 0 },
    chargesToCollectFromCustomer: { type: Number, default: 0 },
    fullRefundIssued: { type: Boolean, default: false },
    serviceChargeOnRefund: { type: Number, default: 0 },
    hotelReconfirmed: { type: Boolean, default: false },
    freeCancellationTillDate: { type: Date },
    hotelCancelled: { type: Boolean, default: false },
    hotelRefundProcessed: { type: Boolean, default: false },
    soldAt: { type: Number, required: true },
    supplierCost: { type: Number, required: true },
    feesAdjustments: { type: Number, default: 0 },
    trueCost: { type: Number, required: true },
    profit: { type: Number, required: true },
    totalReceived: { type: Number, default: 0 },
    remainingBalance: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["unpaid", "partial", "paid"], default: "unpaid" },
    paymentMethod: { type: String },
    paymentAccountOrPortal: { type: String },
    customFields: { type: mongoose_1.default.Schema.Types.Mixed, default: {} },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
exports.Booking = mongoose_1.default.model("Booking", bookingSchema);
//# sourceMappingURL=Booking.js.map