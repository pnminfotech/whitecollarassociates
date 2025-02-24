const express = require("express");
const router = express.Router();
const { suppliersDB } = require("../config/mainte");
const ProjectSchema = require("../models/Project"); // Import the model directly
const SupplierSchema = require("../models/Supplier");
const mongoose = require("mongoose");
// Models
const Project = suppliersDB.model("Project", ProjectSchema )
const Supplier = suppliersDB.model("Supplier", SupplierSchema);

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

router.post("/", async (req, res) => {
    try {
      const { supplierId, supplierName, material, paymentAmount } = req.body;
  
      const newProject = new Project({
        supplierId,
        supplierName,
        material,
        paymentAmount
      });
  
      await newProject.save();
      res.status(201).json(newProject);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


  router.post("/projects/:projectId/addSupplier", async (req, res) => {
    try {
      const { supplierId } = req.body;
      const project = await Project.findById(req.params.projectId);
      const supplier = await Supplier.findById(supplierId);
  
      if (!project || !supplier) {
        return res.status(404).json({ message: "Project or Supplier not found" });
      }
  
      // Add supplier to project
      if (!project.suppliers.includes(supplierId)) {
        project.suppliers.push(supplierId);
      }
  
      // Add project to supplier
      if (!supplier.projects.includes(project._id)) {
        supplier.projects.push(project._id);
      }
  
      await project.save();
      await supplier.save();
  
      res.json({ message: "Supplier added to project successfully!", project, supplier });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
module.exports = router;

// Get a single project
// router.get("/projects/:id", async (req, res) => {
//     try {
//         const project = await Project.findById(req.params.id);
//         if (!project) return res.status(404).json({ message: "Project not found" });
//         res.json(project);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// Add an employee to a project