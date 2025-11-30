"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bankSchema = new mongoose_1.default.Schema({
    bankName: { type: String, default: "" },
    bankAccountNumber: { type: String, default: "" },
    ifscCode: { type: String, default: "" },
    branchName: { type: String, default: "" },
    branchCity: { type: String, default: "" },
    swiftCode: { type: String, default: "" },
    accountType: { type: String, default: "" },
    upiId: { type: String, default: "" },
});
const settingsSchema = new mongoose_1.default.Schema({
    companyName: { type: String, default: "" },
    companyLogo: { type: String, default: "" },
    contactNumber: { type: String, default: "" },
    email: { type: String, default: "" },
    gstin: { type: String, default: "" },
    panNumber: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    stateCode: { type: String, default: "" },
    pincode: { type: String, default: "" },
    ownerName: { type: String, default: "" },
    ownerContact: { type: String, default: "" },
    ownerEmail: { type: String, default: "" },
    banks: { type: [bankSchema], default: [] },
}, { timestamps: true });
settingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = new this({});
        await settings.save();
    }
    return settings;
};
exports.Settings = mongoose_1.default.model("Settings", settingsSchema);
//# sourceMappingURL=Settings.js.map