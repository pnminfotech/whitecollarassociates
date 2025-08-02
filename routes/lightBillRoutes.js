const express = require("express");
const router = express.Router();
const {
  createLightBill,
  getAllLightBills,
  getUnpaidAmount,
  getMeterByRoom,
  updateLightBillStatus,
  updateLightBill, // ✅ full update
} = require("../controllers/lightBillController");

// Add light bill
router.post("/", createLightBill);

// Get all bills
router.get("/all", getAllLightBills);

// Get unpaid amount
router.get("/unpaid", getUnpaidAmount);

// ✅ Update only status
router.patch("/status/:id", updateLightBillStatus);

// ✅ Full update: amount, date, status
router.put("/:id", updateLightBill);

module.exports = router;
