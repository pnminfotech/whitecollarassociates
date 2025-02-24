const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { suppliersDB } = require("../config/mainte"); // Import the connection
const SupplierSchema = require("../models/Supplier");
const Supplier = suppliersDB.model("Supplier", SupplierSchema);


router.get("/", async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


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

// Add a material to a supplier
router.post("/:supplierId/materials", async (req, res) => {
  try {
    const { name, amount, description } = req.body;
    const supplier = await Supplier.findById(req.params.supplierId);

    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    let material = supplier.materials.find(m => m.name === name);

    if (!material) {
      material = { name, payments: [{ amount, description, date: new Date() }] };
      supplier.materials.push(material);
    } else {
      material.payments.push({ amount, description, date: new Date() });
    }

    await supplier.save();
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { materials } = req.body; // Expecting material array

    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    // Append new materials & payments
    materials.forEach(material => {
      const existingMaterial = supplier.materials.find(m => m.name === material.name);
      if (existingMaterial) {
        existingMaterial.payments.push(...material.payments);
      } else {
        supplier.materials.push(material);
      }
    });

    await supplier.save();
    res.status(200).json(supplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Add payment to supplier
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

router.put("/:supplierId/materials/:materialName/payments", async (req, res) => {
  try {
    const { amount, description } = req.body;
    const supplier = await Supplier.findById(req.params.supplierId);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    const material = supplier.materials.find(m => m.name === req.params.materialName);
    if (!material) return res.status(404).json({ message: "Material not found" });

    material.payments.push({ amount, description, date: new Date() });

    await supplier.save();
    res.json(supplier);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/", async (req, res)=>{
   try {
        const { name, phoneNo, roleOrMaterial, salaryOrTotalPayment} = req.body;
        const project = await project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });

        const newEmployee = { name, phoneNo, roleOrMaterial, salaryOrTotalPayment, payments: [] };
        project.employees.push(newEmployee);
        await project.save();

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;
