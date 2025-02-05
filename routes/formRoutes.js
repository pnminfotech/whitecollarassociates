const express = require('express');
const {getFormById, getForms , updateProfile , getArchivedForms,saveLeaveDate,restoreForm, archiveForm ,updateRentAmount, getDuplicateForms,deleteForm,updateForm, saveForm, getAllForms } = require('../controllers/formController');
const {getRent, saveRent , year} = require('../controllers/newYear');
const router = express.Router();

// Route to save form data
router.post('/forms', saveForm);

// Route to get all form data
router.get('/', getAllForms);
router.put('/form/:id', updateForm);
router.delete('/form/:id', deleteForm);
router.get('/duplicateforms', getDuplicateForms);

// router.put('/form/:id/rent-amount', updateRentAmount); //
// router.post('/forms/restore', restoreArchivedForm);
router.post('/forms/leave', saveLeaveDate);
router.post('/forms/archive', archiveForm);
router.post('/forms/restore', restoreForm);
router.put("/update/:id", updateProfile);
router.get("/forms", getForms);

router.get('/forms/archived', getArchivedForms);
// router.post('/archive/:id', archiveForm);
// get fetch single Id from the form 
router.get('/form/:id', getFormById);

//  new Schema For Year 
router.get('/rents' , getRent);
router.post('/rents', saveRent);
router.get('/export/:year', year);

module.exports = router;
