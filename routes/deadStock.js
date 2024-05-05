const express = require("express");
const router = express.Router();
const DeadStock = require("../models/DeadStock");
const Joi = require("joi");
const fetchuser = require("../middleware/fetchUser");
const Faculty = require("../models/Faculty");

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
      email,
    } = req.body;

    const faculty = await Faculty.findOne({ email });

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

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
      adminId: faculty._id,
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

router.post("/filterByStatus", fetchuser, async (req, res) => {
  try {
    let filter = {};
    if (req.body.status !== "All") {
      filter = { status: req.body.status };
    }
    const entries = await DeadStock.find(filter).populate("adminId", "email");
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/getAll", fetchuser, async (req, res) => {
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

    updatedEntry.status = "pending";

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

router.put("/updateStatus", async (req, res) => {
  const { id } = req.body;
  const { status } = req.body;

  try {
    // Find the component issue by ID
    const deadStockEntry = await DeadStock.findById(id);

    if (!deadStockEntry) {
      return res.status(404).json({
        message: "entry not found",
      });
    }

    // Update the status
    deadStockEntry.status = status;
    await deadStockEntry.save();

    // Send success response
    res.status(200).json({ success: true, deadStockEntry });
  } catch (error) {
    console.error(error);
    // Send error response
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.put("/updateRemark", async (req, res) => {
  const { id } = req.body;
  const { remark, status } = req.body;

  try {
    // Find the component issue by ID
    const deadStockEntry = await DeadStock.findById(id);

    if (!deadStockEntry) {
      return res.status(404).json({
        message: "entry not found",
      });
    }

    // Update the status
    deadStockEntry.remark = remark;
    deadStockEntry.status = status;
    await deadStockEntry.save();

    // Send success response
    res.status(200).json({ success: true, deadStockEntry });
  } catch (error) {
    console.error(error);
    // Send error response
    res.status(500).json({ success: false, message: "Internal Server Error" });
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
    email: Joi.string().required(),
  });
  return schema.validate(deadStock);
}

module.exports = router;
