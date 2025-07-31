const express = require('express');
// const Form = require('../models/formModel'); // ✅ Adjust path if different
const Form = require('../models/formModels');
const multer = require("multer");
const path = require("path");
const { getNextSrNo, rentAmountDel, processLeave, getFormById, getForms, updateProfile, getArchivedForms, saveLeaveDate,
  restoreForm, archiveForm, getDuplicateForms, deleteForm, updateForm, saveForm, getAllForms, getAvailableRooms } = require('../controllers/formController');
const router = express.Router();

// Route to save form data
// router.post('/forms', saveForm);
router.get('/forms/count', getNextSrNo);

// Route to get all form data
router.get('/', getAllForms);
router.get('/available-rooms', getAvailableRooms);
router.delete('/form/:id', deleteForm);
router.get('/duplicateforms', getDuplicateForms);

// router.put('/form/:id/rent-amount', updateRentAmount); //
// router.post('/forms/restore', restoreArchivedForm);
router.post('/forms/leave', saveLeaveDate);
router.post('/forms/archive', archiveForm);
router.post('/forms/restore', restoreForm);
router.put("/update/:id", updateProfile);
router.get("/forms", getForms);
router.post("/leave", processLeave);

router.get('/forms/archived', getArchivedForms);
router.get('/form/:id', getFormById);

//for rentAmount updation Logic 0 
router.delete("/form/:formId/rent/:monthYear", rentAmountDel);
router.put('/form/:id', updateForm);
router.post('/cancel-leave', async (req, res) => {
  const { id } = req.body;
  try {
    await Form.findByIdAndUpdate(id, { $unset: { leaveDate: "" } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error cancelling leave" });
  }
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  },
});

const upload = multer({ storage });

router.post("/forms", upload.single("adharFile"), saveForm);

module.exports = router;
