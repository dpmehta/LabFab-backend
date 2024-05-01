const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const LabEntry = require("../models/LabEntry");

router.post("/check", async (req, res) => {
  const { grNumber } = req.body;

  try {
    const labEntry = await LabEntry.findOne({ grNumber, isActive: true });
    if (labEntry) {
      return res.json({
        exists: true,
        message:
          "Lab Entry with GR number " + grNumber + " exists and is active.",
      });
    } else {
      return res.json({
        exists: false,
        message:
          "Lab Entry with GR number " +
          grNumber +
          " does not exist or is inactive.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/add-entry", async (req, res) => {
  const { grNumber, entryTime, leaveTime, purpose, isActive, labCode } =
    req.body;

  const student = await Student.findOne({ grNumber });

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  try {
    const newLabEntry = new LabEntry({
      grNumber,
      entryTime,
      leaveTime,
      purpose,
      isActive,
      labCode,
      studentToken: student._id,
    });

    await newLabEntry.save();
    res.status(201).json({
      message: "Lab entry created successfully!",
      labEntry: newLabEntry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating lab entry" });
  }
});

// count students

router.post("/activeStudentsCount", async (req, res) => {
  try {
    const { labCode } = req.body;

    if (!labCode) {
      return res.status(400).json({
        success: false,
        message: "Lab code is required",
      });
    }

    const activeStudentsCount = await LabEntry.countDocuments({
      labCode: labCode,
      isActive: true,
    });

    res.status(200).json({ success: true, activeStudentsCount });
  } catch (error) {
    console.error(error);

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.put("/lab-leave", async (req, res) => {
  const { grNumber } = req.body;

  try {
    const updatedLabEntry = await LabEntry.updateMany(
      { grNumber, isActive: true },
      { leaveTime: new Date().toISOString(), isActive: false }
    );

    res
      .status(200)
      .json({ message: "LabEntry updated successfully", updatedLabEntry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating LabEntry" });
  }
});

router.get("/getAll", async (req, res) => {
  try {
    // Find all component issue requests
    const labEntries = await LabEntry.find({})
      .populate("studentToken", "student_name")
      .exec();

    if (!labEntries || labEntries.length === 0) {
      return res.status(404).json({
        message: "No students  found",
      });
    }

    // Send success response with the component issue requests
    res.status(200).json({ success: true, labEntries });
  } catch (error) {
    console.error(error);
    // Send error response
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
