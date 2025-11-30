"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const travelerSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    designation: { type: String },
    employeeId: { type: String },
}, { _id: true, timestamps: false });
const customerSchema = new mongoose_1.default.Schema({
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
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
exports.Customer = mongoose_1.default.model("Customer", customerSchema);
//# sourceMappingURL=Customer.js.map