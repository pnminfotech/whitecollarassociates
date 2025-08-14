const mongoose = require("mongoose");

const monthlyBillSchema = new mongoose.Schema({
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
    month: { type: String, required: true }, // e.g., "aug"
    year: { type: Number, required: true }, // e.g., 2025
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    cashPayment: { type: Number, default: 0 },
    onlinePayment: { type: Number, default: 0 },
    remainingAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid"], default: "pending" }
});

module.exports = mongoose.model("MonthlyBill", monthlyBillSchema);
