const express = require('express');
const {getDuplicateForms,deleteForm,updateForm, saveForm, getAllForms } = require('../controllers/formController');

const router = express.Router();

// Route to save form data
router.post('/forms', saveForm);

// Route to get all form data
router.get('/', getAllForms);
router.put('/form/:id', updateForm);
router.delete('/form/:id', deleteForm);
router.get('/duplicateforms', getDuplicateForms);
module.exports = router;
