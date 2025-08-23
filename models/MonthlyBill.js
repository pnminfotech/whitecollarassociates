// models/MonthlyBill.js
const mongoose = require("mongoose");

const MonthlyBillSchema = new mongoose.Schema(
    {
        tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
        roomNo: { type: String },
        month: {
            type: String,
            enum: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
            required: true
        },
        year: { type: Number, required: true },
        // components (optional, helpful for display)
        rentAmount: { type: Number, default: 0 },
        lightBillAmount: { type: Number, default: 0 },

        totalAmount: { type: Number, default: 0 }, // rent + light (value shown in Room-wise table)
        cashPayment: { type: Number, default: 0 },
        onlinePayment: { type: Number, default: 0 },
        paidAmount: { type: Number, default: 0 },
        remainingAmount: { type: Number, default: 0 },
        status: { type: String, enum: ["pending", "partial", "paid"], default: "pending" },
    },
    { timestamps: true }
);

// Unique per tenant+month+year
MonthlyBillSchema.index({ tenantId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("MonthlyBill", MonthlyBillSchema);
