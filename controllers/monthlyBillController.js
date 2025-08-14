const MonthlyBill = require("../models/MonthlyBill");
const Form = require("../models/formModels"); // ✅ import Form model
const LightBillEntry = require("../models/LightBillEntry");
exports.createMonthlyBill = async (req, res) => {
    const {
        tenantId,
        roomNo,
        month,
        year,
        rentAmount,
        lightBillAmount,
        cashPayment,
        onlinePayment
    } = req.body;

    const totalAmount = rentAmount + lightBillAmount;
    const paidAmount = (cashPayment || 0) + (onlinePayment || 0);
    const remainingAmount = totalAmount - paidAmount;

    let status = "pending";
    if (remainingAmount === 0) {
        status = "paid";
    }

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
        status
    });

    await newBill.save();
    res.status(201).json({ message: "Monthly bill created successfully", bill: newBill });
};


// controllers/monthlyBillController.js
exports.getMonthlyBills = async (req, res) => {
    try {
        const bills = await MonthlyBill.find().populate("tenantId");
        res.status(200).json(bills);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bills", error });
    }
};

// exports.updateMonthlyBill = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { cashPayment, onlinePayment } = req.body;

//         const bill = await MonthlyBill.findOne({ tenantId: id });
//         if (!bill) return res.status(404).json({ message: "Bill not found" });

//         bill.cashPayment = cashPayment;
//         bill.onlinePayment = onlinePayment;
//         bill.paidAmount = cashPayment + onlinePayment;

//         if (bill.paidAmount >= bill.totalAmount) {
//             bill.status = "paid";
//         } else if (bill.paidAmount > 0) {
//             bill.status = "partial";
//         } else {
//             bill.status = "pending";
//         }

//         const updated = await bill.save();
//         res.status(200).json({ message: "Bill updated", bill: updated });
//     } catch (error) {
//         console.error("Update error:", error);
//         res.status(500).json({ message: "Update failed" });
//     }
// };
exports.generateMonthlyBills = async (req, res) => {
    try {
        const currentDate = new Date();
        const monthShort = currentDate.toLocaleString("default", { month: "short" }).toLowerCase(); // aug
        const yearFull = currentDate.getFullYear();
        const monthYearString = `${monthShort}-${yearFull.toString().slice(-2)}`; // aug-25

        const tenants = await Form.find();
        const bills = [];

        for (const tenant of tenants) {
            // ✅ Check if bill already exists for this tenant & month/year
            const existingBill = await MonthlyBill.findOne({
                tenantId: tenant._id,
                month: monthShort,
                year: yearFull
            });

            if (existingBill) {
                // Skip if bill already exists
                console.log(`Bill already exists for ${tenant.name} (${monthShort} ${yearFull})`);
                continue;
            }

            // 1️⃣ Get Rent Amount for current month (eg. 'aug')
            let rentAmount = 0;
            if (tenant.rents && tenant.rents.length > 0) {
                for (const rent of tenant.rents) {
                    if (rent.month && rent.month.toLowerCase() === monthShort) {
                        rentAmount = rent.rentAmount || 0;
                        break;
                    }
                }
            }

            // 2️⃣ Get Light Bill for current room/month (eg. 'aug-25')
            const lightEntry = await LightBillEntry.findOne({
                roomNo: tenant.roomNo,
                month: monthYearString,
                year: yearFull,
            });

            const lightBillAmount = lightEntry?.amount || 0;
            const totalAmount = rentAmount + lightBillAmount;

            // 3️⃣ Create a new bill
            const newBill = new MonthlyBill({
                tenantId: tenant._id,
                month: monthShort,
                year: yearFull,
                totalAmount: totalAmount,
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




// controller
exports.updateMonthlyBill = async (req, res) => {
    try {
        const billId = req.params.id;
        const { cashPayment = 0, onlinePayment = 0 } = req.body;
        const bill = await MonthlyBill.findById(billId);

        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        bill.cashPayment = cashPayment;
        bill.onlinePayment = onlinePayment;

        bill.paidAmount = cashPayment + onlinePayment;
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
        console.error('Error updating bill:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
