"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const customers_1 = __importDefault(require("./routes/customers"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const payments_1 = __importDefault(require("./routes/payments"));
const refunds_1 = __importDefault(require("./routes/refunds"));
const invoices_1 = __importDefault(require("./routes/invoices"));
const reports_1 = __importDefault(require("./routes/reports"));
const settings_1 = __importDefault(require("./routes/settings"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const statements_1 = __importDefault(require("./routes/statements"));
const import_1 = __importDefault(require("./routes/import"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});
app.use("/api/auth", auth_1.default);
app.use("/api/users", users_1.default);
app.use("/api/customers", customers_1.default);
app.use("/api/bookings", bookings_1.default);
app.use("/api/payments", payments_1.default);
app.use("/api/refunds", refunds_1.default);
app.use("/api/invoices", invoices_1.default);
app.use("/api/reports", reports_1.default);
app.use("/api/settings", settings_1.default);
app.use("/api/statements", statements_1.default);
app.use("/api/import", import_1.default);
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/travel_accounting";
const port = process.env.PORT || 5000;
mongoose_1.default
    .connect(mongoUri)
    .then(() => {
    app.listen(port, () => {
        console.log(`Backend listening on port ${port}`);
    });
})
    .catch((err) => {
    console.error("Mongo connection error", err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map