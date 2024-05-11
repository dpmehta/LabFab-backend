const express = require("express");
const { body, validationResult } = require("express-validator");
const ComponentIssue = require("../models/ComponentIssue");
const Student = require("../models/Student");
const router = express.Router();

// POST endpoint to add component issue data
router.post(
  "/component-issue",
  [
    // Validate request body
    body("componentName").notEmpty().withMessage("Component Name is required"),
    body("quantity")
      .isNumeric()
      .withMessage("Quantity must be a numeric value")
      .custom((value) => {
        if (parseFloat(value) <= 0) {
          throw new Error("Quantity must be greater than 0");
        }
        return true;
      }),
    body("issueDate").isDate().withMessage("Invalid Issue Date"),
    body("returnDate").isDate().withMessage("Invalid Return Date"),
    body("purpose").notEmpty().withMessage("Purpose is required"),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure request body
    const {
      componentName,
      quantity,
      issueDate,
      returnDate,
      purpose,
      grNumber,
    } = req.body;

    try {
      const student = await Student.findOne({ grNumber });

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      // Create new component issue instance
      const componentIssue = new ComponentIssue({
        componentName,
        quantity,
        issueDate,
        returnDate,
        purpose,
        studentToken: student._id,
      });

      // Save component issue data to the database
      await componentIssue.save();

      // Send success response
      res.status(201).json({
        success: true,
        message: "Component issue data added successfully",
      });
    } catch (error) {
      console.error(error);
      // Send error response
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

// GET endpoint to fetch component issue requests by student token
router.post("/component-issues", async (req, res) => {
  const { grNumber } = req.body;

  try {
    // Find the student based on grNumber
    const student = await Student.findOne({ grNumber });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find component issues related to the studentToken (student's _id)
    const componentIssues = await ComponentIssue.find({
      studentToken: student._id,
    });

    // Send success response with the component issues related to the student
    res.status(200).json({
      success: true,
      componentIssues,
    });
  } catch (error) {
    console.error(error);
    // Send error response
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/component-issues", async (req, res) => {
  try {
    // Find all component issue requests
    const componentIssues = await ComponentIssue.find({})
      .populate("studentToken", "student_name")
      .exec();

    if (!componentIssues || componentIssues.length === 0) {
      return res.status(404).json({
        message: "No component issues found",
      });
    }

    // Send success response with the component issue requests
    res.status(200).json({ success: true, componentIssues });
  } catch (error) {
    console.error(error);
    // Send error response
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.put("/component-issues/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Find the component issue by ID
    const componentIssue = await ComponentIssue.findById(id);

    if (!componentIssue) {
      return res.status(404).json({
        message: "Component issue not found",
      });
    }

    // Update the status
    componentIssue.status = status;
    await componentIssue.save();

    // Send success response
    res.status(200).json({ success: true, componentIssue });
  } catch (error) {
    console.error(error);
    // Send error response
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
