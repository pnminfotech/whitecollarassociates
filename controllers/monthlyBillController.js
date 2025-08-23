// controllers/monthlyBillController.js

const MonthlyBill = require("../models/MonthlyBill");
const Form = require("../models/formModels");
const LightBillEntry = require("../models/LightBillEntry");

/**
 * Create bill manually (optional).
 */
exports.createMonthlyBill = async (req, res) => {
    try {
        const {
            tenantId,
            roomNo,
            month,
            year,
            rentAmount,
            lightBillAmount,
            cashPayment = 0,
            onlinePayment = 0,
        } = req.body;

        const totalAmount = rentAmount + lightBillAmount;
        const paidAmount = cashPayment + onlinePayment;
        const remainingAmount = totalAmount - paidAmount;

        let status = "pending";
        if (remainingAmount === 0) status = "paid";
        else if (paidAmount > 0) status = "partial";

        const newBill = new MonthlyBill({
            tenantId,
            roomNo,
            month,
            year,
            rentAmount,
            lightBillAmount,
            totalAmount,
            paidAmount,
            remainingAmount,
            cashPayment,
            onlinePayment,
            status,
        });

        await newBill.save();
        res.status(201).json({ message: "Monthly bill created successfully", bill: newBill });
    } catch (error) {
        console.error("Create bill error:", error);
        res.status(500).json({ message: "Error creating bill", error: error.message });
    }
};

/**
 * Get all bills (admin use).
 */
exports.getMonthlyBills = async (req, res) => {
    try {
        const bills = await MonthlyBill.find().populate("tenantId");
        res.status(200).json(bills);
    } catch (error) {
        console.error("Fetch bills error:", error);
        res.status(500).json({ message: "Error fetching bills", error });
    }
};

/**
 * Generate monthly bills for all tenants (for current month).
 */
exports.generateMonthlyBills = async (req, res) => {
    try {
        const currentDate = new Date();
        const monthShort = currentDate.toLocaleString("default", { month: "short" }).toLowerCase(); // aug
        const yearFull = currentDate.getFullYear();
        const monthYearString = `${monthShort}-${yearFull.toString().slice(-2)}`; // aug-25

        const tenants = await Form.find();
        const bills = [];

        for (const tenant of tenants) {
            // ✅ Skip if bill already exists
            const existingBill = await MonthlyBill.findOne({
                tenantId: tenant._id,
                month: monthShort,
                year: yearFull,
            });

            if (existingBill) {
                console.log(`Bill already exists for ${tenant.name} (${monthShort} ${yearFull})`);
                continue;
            }

            // 1️⃣ Rent
            let rentAmount = 0;
            if (tenant.rents && tenant.rents.length > 0) {
                for (const rent of tenant.rents) {
                    if (rent.month && rent.month.toLowerCase() === monthShort) {
                        rentAmount = rent.rentAmount || 0;
                        break;
                    }
                }
            }

            // 2️⃣ Light Bill
            const lightEntry = await LightBillEntry.findOne({
                roomNo: tenant.roomNo,
                month: monthYearString,
                year: yearFull,
            });

            const lightBillAmount = lightEntry?.amount || 0;
            const totalAmount = rentAmount + lightBillAmount;

            // 3️⃣ Create Bill
            const newBill = new MonthlyBill({
                tenantId: tenant._id,
                roomNo: tenant.roomNo,
                month: monthShort,
                year: yearFull,
                rentAmount,
                lightBillAmount,
                totalAmount,
                paidAmount: 0,
                cashPayment: 0,
                onlinePayment: 0,
                remainingAmount: totalAmount,
                status: "pending",
            });

            await newBill.save();
            bills.push(newBill);
        }

        res.status(201).json({ message: "Monthly bills generated", bills });
    } catch (error) {
        console.error("Bill generation error:", error);
        res.status(500).json({ message: "Failed to generate monthly bills", error: error.message });
    }
};

/**
 * Get bills for a single tenant (Rent History).
 */
exports.getTenantMonthlyBills = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const { year } = req.query;

        const filter = { tenantId };
        if (year) filter.year = Number(year);

        const bills = await MonthlyBill.find(filter).sort({ year: 1, month: 1 });
        res.json({ bills });
    } catch (error) {
        console.error("Fetch tenant bills error:", error);
        res.status(500).json({ message: "Error fetching tenant bills", error });
    }
};

/**
 * Update cash/online for tenant + month + year.
 * Used in Room-wise Rent Table (click Total → edit form).
 */
exports.upsertMonthlyBill = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const { month, year, cashPayment = 0, onlinePayment = 0 } = req.body;

        let bill = await MonthlyBill.findOne({ tenantId, month, year });

        if (!bill) {
            return res.status(404).json({ message: "Bill not found for this tenant & month" });
        }

        bill.cashPayment = Number(cashPayment) || 0;
        bill.onlinePayment = Number(onlinePayment) || 0;

        bill.paidAmount = bill.cashPayment + bill.onlinePayment;
        bill.remainingAmount = bill.totalAmount - bill.paidAmount;

        if (bill.remainingAmount <= 0) {
            bill.status = "paid";
            bill.remainingAmount = 0;
        } else if (bill.paidAmount > 0) {
            bill.status = "partial";
        } else {
            bill.status = "pending";
        }

        const updatedBill = await bill.save();
        res.json({ bill: updatedBill });
    } catch (error) {
        console.error("Update bill error:", error);
        res.status(500).json({ message: "Error updating bill", error });
    }
};
/**
 * Get yearly summary (totals) for a tenant
 */
exports.getTenantYearlySummary = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const { year } = req.query;

        if (!year) {
            return res.status(400).json({ message: "Year is required" });
        }

        const bills = await MonthlyBill.find({ tenantId, year: Number(year) });

        // Map months (to ensure ordering)
        const monthOrder = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

        // Create a lookup for bills
        const billMap = {};
        bills.forEach(bill => {
            billMap[bill.month] = bill;
        });

        // Always return 12 months
        const allMonths = monthOrder.map(m => {
            if (billMap[m]) return billMap[m];
            return {
                tenantId,
                month: m,
                year: Number(year),
                rentAmount: 0,
                lightBillAmount: 0,
                totalAmount: 0,
                cashPayment: 0,
                onlinePayment: 0,
                paidAmount: 0,
                remainingAmount: 0,
                status: "pending"
            };
        });

        // Calculate summary on all months
        const summary = allMonths.reduce(
            (acc, b) => {
                acc.totalAmount += b.totalAmount || 0;
                acc.paidAmount += b.paidAmount || 0;
                acc.cashPayment += b.cashPayment || 0;
                acc.onlinePayment += b.onlinePayment || 0;
                acc.remainingAmount += b.remainingAmount || 0;
                return acc;
            },
            { totalAmount: 0, paidAmount: 0, cashPayment: 0, onlinePayment: 0, remainingAmount: 0 }
        );

        res.json({
            year: Number(year),
            tenantId,
            summary,
            bills: allMonths
        });
    } catch (error) {
        console.error("Yearly summary error:", error);
        res.status(500).json({ message: "Error fetching yearly summary", error });
    }
};

