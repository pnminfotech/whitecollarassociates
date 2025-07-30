const express = require("express");
const router = express.Router();
const {
  createLightBill,
  getAllLightBills,
  getUnpaidAmount,
  getMeterByRoom
} = require("../controllers/lightBillController");

router.post("/", createLightBill);          // Add light bill
router.get("/all", getAllLightBills);          // Get all bills
router.get("/unpaid", getUnpaidAmount);     // Get unpaid amount by meterNo
//router.get("/get-meter", getMeterByRoom);   // Get meterNo by roomNo

module.exports = router;
