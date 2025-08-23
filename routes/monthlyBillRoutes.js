// routes/monthlyBills.js
const express = require("express");
const router = express.Router();
const {
    createMonthlyBill,
    getMonthlyBills,
    generateMonthlyBills,
    getTenantMonthlyBills,
    upsertMonthlyBill, getTenantYearlySummary
} = require("../controllers/monthlyBillController");

router.post("/", createMonthlyBill);
router.get("/monthly", getMonthlyBills);
router.post("/generate", generateMonthlyBills);
router.get("/tenant/:tenantId", getTenantMonthlyBills);
router.put("/tenant/:tenantId", upsertMonthlyBill);
router.get("/tenant/:tenantId/summary", getTenantYearlySummary);

module.exports = router;
