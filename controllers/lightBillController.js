const LightBillEntry = require("../models/LightBillEntry");
//const Tenant = require("../models/Tenant"); // Make sure this model exists and has meterNo & roomNo


//const OtherExpense = require("../models/OtherExpense"); // ✅ Add this line



// ✅ Create a new Light Bill entry
exports.createLightBill = async (req, res) => {
  try {
    const {
      meterNo,
      oldUnits,
      newUnits,
      amount,
      month,
      year,
      roomNo,
      status,
      date
    } = req.body;

    // Validate required fields
    if (!meterNo || !oldUnits || !newUnits || !amount || !month || !year) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const entry = new LightBillEntry({
      meterNo,
      oldUnits,
      newUnits,
      amount,
      month,
      year,
      roomNo: roomNo || "",
      status: status || "pending",
      date: date || new Date(),
    });

    await entry.save();

    res.status(201).json({ message: "Light bill saved successfully.", entry });

  } catch (error) {
    console.error("Error saving light bill:", error);
    res.status(500).json({ message: "Failed to save light bill." });
  }
};

// ✅ Get all bills
exports.getAllLightBills = async (req, res) => {
  try {
    const bills = await LightBillEntry.find().sort({ date: -1 });
    res.json(bills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch light bill entries." });
  }
};

// ✅ Get previous unpaid amount
exports.getUnpaidAmount = async (req, res) => {
  try {
    const { meterNo } = req.query;
    if (!meterNo) return res.status(400).json({ message: "Meter No is required." });

    const lastPending = await LightBillEntry.findOne({ meterNo, status: "pending" }).sort({ date: -1 });

    if (!lastPending) return res.json({ amount: 0 });

    res.json({ amount: lastPending.amount });

  } catch (error) {
    console.error("Error fetching unpaid amount:", error);
    res.status(500).json({ message: "Failed to fetch unpaid amount." });
  }
};


// ✅ Update light bill status
// ✅ Update light bill status (paid/pending)
exports.updateLightBillStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log("Updating status for ID:", id); // Add this for debugging

  if (!["paid", "pending"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  const updated = await LightBillEntry.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ message: "Light bill not found." });
  }

  res.json({ message: "Status updated", updated });
};



exports.updateLightBill = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, date, status } = req.body;

    const updated = await LightBillEntry.findByIdAndUpdate(
      id,
      { amount, date, status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Light bill updated", updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};


// ✅ Delete light bill by ID
exports.deleteLightBill = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await LightBillEntry.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Light bill not found" });
    }

    res.json({ message: "Deleted successfully" });

  } catch (error) {
    console.error("Error deleting light bill:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// ✅ Get all Other Expenses
// exports.getAllOtherExpenses = async (req, res) => {
//   try {
//     const expenses = await OtherExpense.find().sort({ date: -1 });
//     res.status(200).json(expenses);
//   } catch (error) {
//     console.error("Error fetching other expenses:", error);
//     res.status(500).json({ message: "Failed to fetch other expenses." });
//   }
// };
 












// ✅ Get meter number by room number
// exports.getMeterByRoom = async (req, res) => {
//   try {
//     const { roomNo } = req.query;
//     if (!roomNo) return res.status(400).json({ message: "Room No is required" });

//     const tenant = await Tenant.findOne({ roomNo });
//     if (!tenant) return res.status(404).json({ message: "Tenant not found" });

//     res.json({ meterNo: tenant.meterNo });
//   } catch (error) {
//     console.error("Error fetching meter:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
