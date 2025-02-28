const express = require("express");
const router = express.Router();
// const { suppliersDB } = require("../config/mainte");
// const ProjectSchema = require("../models/Project"); // Import the model directly
// const SupplierSchema = require("../models/Supplier");
const mongoose = require("mongoose");
// Models
const Project = require("../models/Project");
const Supplier = require("../models/Supplier");

// Create Project
router.post("/emp/projects", async (req, res) => {
    try {
        const { heading,date, description } = req.body;
        const project = new Project({ heading, date, description, employees: [] });
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all projects
router.get("/projects", async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//to fexth Projects
router.get("/projects/:projectId", async (req, res) => {
    try {
      const project = await Project.findById(req.params.projectId).populate("suppliers");
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  //adding Employee to the project.
router.post("/projects/:id/employees", async (req, res) => {
    try {
        const { name, phoneNo, roleOrMaterial, salaryOrTotalPayment} = req.body;
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });

        const newEmployee = { name, phoneNo, roleOrMaterial, salaryOrTotalPayment, payments: [] };
        project.employees.push(newEmployee);
        await project.save();

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Used for adding Payemnts
router.post("/projects/:projectId/employees/:employeeId/payments", async (req, res) => {
    try {
        const { amount, date,  description } = req.body;
        const project = await Project.findById(req.params.projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        const employee = project.employees.id(req.params.employeeId);
        if (!employee) return res.status(404).json({ message: "Employee not found" });

        employee.payments.push({ amount, date,  description });
        await project.save();

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//to add supplier to the project 
router.post("/projects/:projectId/suppliers",  async (req, res) => {
  try {
    const { projectId } = req.params;
    const { supplierId, materials } = req.body;

    console.log("Supplier ID received:", supplierId);

    // Fetch project from main DB
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Fetch supplier from the Suppliers DB
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found in database" });
    }

    // Construct supplier object with fetched data
    const supplierData = {
      supplierId: supplier._id,
      name: supplier.name,
      phoneNo: supplier.phoneNo,
      materials: materials || [],
    };

    // Push supplier data into project suppliers array
    project.suppliers.push(supplierData);

    await project.save();
    res.status(201).json({ message: "Supplier added to project", project });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error adding supplier", error });
  }
});

//fetch all the supplier which are added into the project.
router.get("/projects/:projectId/suppliers", async (req, res) => {
  try {
    const suppliers = await Supplier.find().select("name phoneNo _id");
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching suppliers", error });
  }
});

module.exports = router;
//router.post("/", async (req, res) => {
//     try {
//       const { supplierId, supplierName, material, paymentAmount } = req.body;
  
//       const newProject = new Project({
//         supplierId,
//         supplierName,
//         material,
//         paymentAmount
//       });
  
//       await newProject.save();
//       res.status(201).json(newProject);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   });
