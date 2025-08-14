const express = require("express");
const router = express.Router();
const { generateMonthlyBills } = require("../controllers/monthlyBillController");
const { getMonthlyBills } = require("../controllers/monthlyBillController");
const {
    createMonthlyBill,

    updateMonthlyBill,
} = require("../controllers/monthlyBillController");
const MonthlyBill = require("../models/MonthlyBill");

router.post("/", createMonthlyBill); // Create new bill
// Get all
router.put("/:id", updateMonthlyBill); // Update payments
// ✅ New route to update a monthly bill directly by tenantId
router.put("/tenant/:tenantId", async (req, res) => {
    try {
        const { tenantId } = req.params;

        console.log("Updating bill for tenantId:", tenantId); // 🛠 Debug log

        const bill = await MonthlyBill.findOne({ tenantId });
        if (!bill) {
            console.warn("No bill found for tenant:", tenantId);
            return res.status(404).json({ message: "Bill not found" });
        }


        bill.cashPayment = req.body.cashPayment || 0;
        bill.onlinePayment = req.body.onlinePayment || 0;
        bill.paidAmount = bill.cashPayment + bill.onlinePayment;
        bill.remainingAmount = bill.totalAmount - bill.paidAmount;
        if (bill.remainingAmount < 0) bill.remainingAmount = 0;

        bill.status =
            bill.paidAmount >= bill.totalAmount
                ? "paid"
                : bill.paidAmount > 0
                    ? "partial"
                    : "pending";


        const updated = await bill.save();
        res.status(200).json({ message: "Bill updated", bill: updated });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ message: "Error updating bill", error: err.message });
    }
});


router.get('/monthly', getMonthlyBills);

router.post("/generate", generateMonthlyBills);

module.exports = router;
