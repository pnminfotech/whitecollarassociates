const Form = require('../models/formModels');
const DuplicateForm = require('../models/DuplicateForm'); // Import the DuplicateForm model
// function getMonthYear() {
//   const date = new Date();
//   const month = date.getMonth() + 1; // getMonth() returns 0-11, so we add 1 to get the month number
//   const year = date.getFullYear();
//   return `${month}-${year}`;
// }
const Archive = require('../models/archiveSchema');

// @desc Save form data to the database
// @route POST /api/forms
// @access Public
const saveForm = async (req, res) => {
  try {
    // Log incoming request body to debug
    console.log('Request Body:', req.body);

    // const { rents, ...otherFields } = req.body;

    // // Validate and process rents
    // const validatedRents = rents.map((rent) => ({
    //   rentAmount: Number(rent.rentAmount), // Ensure rentAmount is a number
    //   date: new Date(rent.date), // Ensure date is a valid Date object
    // }));

    // Create and save form
    // const form = new Form({
    //   ...otherFields,
    //   rents: validatedRents,
    // });
    const form = new Form(req.body);
    const savedForm = await form.save();
    res.status(201).json(savedForm);
  } catch (error) {
    console.error('Error saving form:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc Get all forms from the database
// @route GET /api/forms
// @access Public
const getAllForms = async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update rent for a specific form
// @route PUT /api/forms/:id
// @access Public
// @desc Update rent for a specific form
// @route PUT /api/forms/:id
// @access Public
const updateForm = async (req, res) => {
  const { id } = req.params;
  const { rentAmount, date } = req.body;

  try {
    const form = await Form.findById(id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    const monthYear = getMonthYear(date);
    const rentIndex = form.rents.findIndex((rent) => getMonthYear(rent.date) === monthYear);

    if (rentIndex !== -1) {
      form.rents[rentIndex] = { rentAmount: Number(rentAmount), date: new Date(date) };
    } else {
      form.rents.push({ rentAmount: Number(rentAmount), date: new Date(date) });
    }

    const updatedForm = await form.save();
    res.status(200).json(updatedForm);
  } catch (error) {
    res.status(500).json({ message: 'Error updating rent: ' + error.message });
  }
};


const updateRentAmount = async (req, res) => {
  const { id } = req.params; // Form ID
  const { rentAmount, monthYear } = req.body; // rentAmount and month-year identifier

  try {
    // Find the form by ID
    const form = await Form.findById(id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    // Locate the rent entry for the specified month-year
    const rentIndex = form.rents.findIndex(
      (rent) =>
        new Date(rent.date).toLocaleString('default', { month: 'short' }) +
          '-' +
          new Date(rent.date).getFullYear().toString().slice(-2) ===
        monthYear
    );

    if (rentIndex === -1) {
      return res.status(404).json({ message: 'Rent entry for the specified month not found' });
    }

    // Update the rentAmount
    form.rents[rentIndex].rentAmount = Number(rentAmount);

    // Save the updated form
    const updatedForm = await form.save();
    res.status(200).json(updatedForm);
  } catch (error) {
    res.status(500).json({ message: 'Error updating rent amount: ' + error.message });
  }
};

// Utility Function to Get Month-Year Format
const getMonthYear = (date) => {
  const d = new Date(date);
  return `${d.toLocaleString('default', { month: 'short' })}-${d.getFullYear().toString().slice(-2)}`;
};




// @desc Delete a form and move its data to the DuplicateForm model
// @route DELETE /api/forms/:id
// @access Public
const deleteForm = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the form to delete
    const formToDelete = await Form.findById(id);

    if (!formToDelete) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Create a new duplicate form using the data from the original form
    const duplicateForm = new DuplicateForm({
      originalFormId: formToDelete._id,
      formData: formToDelete, // Save all the form's data
      deletedAt: Date.now(),
    });

    // Save the duplicate form
    await duplicateForm.save();

    // Delete the original form
    await Form.findByIdAndDelete(id);

    res.status(200).json({ message: 'Form deleted and saved as a duplicate successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getDuplicateForms = async (req, res) => {
  try {
    const duplicateForms = await DuplicateForm.find().populate('originalFormId').exec();
    res.status(200).json(duplicateForms);
  } catch (err) {
    console.error('Error fetching duplicate forms:', err.message);
    res.status(500).json({ message: 'Error fetching duplicate forms' });
  }
};

const archiveForm = async (req, res) => {
  const { id } = req.params;
  try {
    const formToArchive = await Form.findById(id);
    if (!formToArchive) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const archive = new Archive({
      originalFormId: formToArchive._id,
      name: formToArchive.name,
      roomNo: formToArchive.roomNo,
      joiningDate: formToArchive.joiningDate,
      depositAmount: formToArchive.depositAmount,
      leaveDate: new Date(),
    });

    await archive.save();
    await Form.findByIdAndDelete(id);

    res.status(200).json(archive);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const restoreArchivedForm = async (req, res) => {
  const { id } = req.body; // Use ID to identify the record to restore

  try {
    // Find the record in the archive
    const archivedData = await Archive.findById(id);
    if (!archivedData) {
      return res.status(404).json({ message: 'Archived data not found' });
    }

    // Restore the record back to the original collection
    const restoredForm = new Form({
      srNo: archivedData.srNo,
      name: archivedData.name,
      roomNo: archivedData.roomNo,
      joiningDate: archivedData.joiningDate,
      depositAmount: archivedData.depositAmount,
      rents: archivedData.rents, // Include rents if present
    });

    await restoredForm.save();

    // Remove the record from the archive
    await Archive.findByIdAndDelete(id);

    res.status(200).json(restoredForm);
  } catch (error) {
    console.error('Error restoring archived data:', error.message);
    res.status(500).json({ message: 'Error restoring archived data' });
  }
};


module.exports = {restoreArchivedForm , archiveForm , saveForm, getAllForms, updateForm, deleteForm ,getDuplicateForms, updateRentAmount };
