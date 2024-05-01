const express = require("express");
const router = express.Router();
const DeadStock = require("../models/DeadStock");
const Joi = require("joi");

// POST request to add a DeadStock entry
router.post("/add", async (req, res) => {
  try {
    // Validate request body
    const { error } = validateDeadStock(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Extract data from request body
    const {
      deadStockNumber,
      description,
      purchaseDate,
      suppliersName,
      quantity,
      rate,
      purchaseAmount,
      year,
      labNumber,
      adminId,
    } = req.body;

    // Create a new DeadStock entry
    const deadStockEntry = new DeadStock({
      deadStockNumber,
      description,
      purchaseDate,
      suppliersName,
      quantity,
      rate,
      purchaseAmount,
      year,
      labNumber,
      adminId,
    });

    // Save the DeadStock entry to the database
    const savedEntry = await deadStockEntry.save();

    // Send response with the saved entry
    res.status(201).json(savedEntry);
  } catch (error) {
    // Handle server errors
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/getAll", async (req, res) => {
  try {
    const entries = await DeadStock.find();

    res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedEntry = await DeadStock.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.status(200).json(updatedEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEntry = await DeadStock.findByIdAndDelete(id);

    if (!deletedEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

function validateDeadStock(deadStock) {
  const schema = Joi.object({
    deadStockNumber: Joi.string().required(),
    description: Joi.string().required(),
    purchaseDate: Joi.date().iso().required(),
    suppliersName: Joi.string().required(),
    quantity: Joi.number().integer().positive().required(),
    rate: Joi.number().positive().required(),
    purchaseAmount: Joi.number().positive().required(),
    year: Joi.number().integer().positive().required(),
    labNumber: Joi.string().required(),
    adminId: Joi.string().required(),
  });
  return schema.validate(deadStock);
}

module.exports = router;
