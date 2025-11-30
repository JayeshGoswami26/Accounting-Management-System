import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import customerRoutes from "./routes/customers";
import bookingRoutes from "./routes/bookings";
import paymentRoutes from "./routes/payments";
import refundRoutes from "./routes/refunds";
import invoiceRoutes from "./routes/invoices";
import reportRoutes from "./routes/reports";
import settingsRoutes from "./routes/settings";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import statementRoutes from "./routes/statements";
import importRoutes from "./routes/import";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/refunds", refundRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/statements", statementRoutes);
app.use("/api/import", importRoutes);

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/travel_accounting";
const port = process.env.PORT || 5000;

mongoose
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


