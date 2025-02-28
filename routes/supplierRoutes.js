const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// const { suppliersDB } = require("../config/mainte"); // Import the connection
// const SupplierSchema = require("../models/Supplier");
// const Supplier = suppliersDB.model("Supplier", SupplierSchema);
const Supplier = require("../models/Supplier");
const Project = require("../models/Project");
//to fetch the supplier.
router.get("/", async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//to Post the supplier.
router.post("/", async (req, res) => {
  try {
    const { name, phoneNo, address, materials, totalPayment  } = req.body;

    // Ensure materials exist in request body
    if (!materials || !Array.isArray(materials)) {
      return res.status(400).json({ message: "Materials should be an array" });
    }

    const newSupplier = new Supplier({ name, phoneNo, address, materials });

    await newSupplier.save();
    res.status(201).json(newSupplier);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/suppliers/:supplierId", async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.supplierId).populate("projects");
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json(supplier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// Add payment array to the supplier
router.post("/:supplierId/materials/:materialName/payment", async (req, res) => {
  try {
    const { amount, description } = req.body;
    const supplier = await Supplier.findById(req.params.supplierId);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    const material = supplier.materials.find(m => m.name === req.params.materialName);
    if (!material) return res.status(404).json({ message: "Material not found" });

    material.payments.push({ amount, description, date: new Date() });

    await supplier.save();
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ error: "Failed to add payment" });
  }
});

router.post("/projects/:projectId/suppliers", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { supplierId, materials } = req.body;

    console.log("Supplier ID received:", supplierId);

    // Fetch project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Fetch supplier from the same database
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      console.log("Supplier not found in DB:", supplierId);
      return res.status(404).json({ message: "Supplier not found in database" });
    }

    // Construct supplier object
    const supplierData = {
      supplierId: supplier._id,
      name: supplier.name,
      phoneNo: supplier.phoneNo,
      materials: materials || [],
    };

    // Add supplier to the project's supplier list
    project.suppliers.push(supplierData);
    await project.save();

    res.status(201).json({ message: "Supplier added to project", project });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error adding supplier", error });
  }
});


module.exports = router;
