const express = require("express");
const router = express.Router();
const multer = require("multer");
const Complaint = require("../models/Complaint");
const Student = require("../models/Student");

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets/images/component-complaint-images"); // Specify the directory where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Rename the file to avoid conflicts
  },
});

const upload = multer({ storage: storage });

// POST endpoint to store a new complaint with image upload
router.post(
  "/component-complaint",
  upload.single("imageUpload"),
  async (req, res) => {
    try {
      const {
        componentId,
        componentName,
        issueDescription,
        labLocation,
        grNumber,
        status,
      } = req.body;

      // Get the file path from the request
      const imageUpload = req.file
        ? `/assets/images/component-complaint-images/${req.file.filename}`
        : "";
      const student = await Student.findOne({ grNumber });

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      // Create a new complaint instance
      const newComplaint = new Complaint({
        componentId,
        componentName,
        issueDescription,
        imageUpload,
        labLocation,
        studentToken: student._id,
        status, // If status is coming from the frontend
      });

      // Save the complaint to the database
      await newComplaint.save();

      res.status(201).json({ message: "Complaint stored successfully" });
    } catch (error) {
      console.error("Error storing complaint:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get("/component-complaint", async (req, res) => {
  try {
    const componentComplaints = await Complaint.find({})
      .populate("studentToken", "student_name grNumber")
      .exec();

    if (!componentComplaints || componentComplaints.length === 0) {
      return res.status(404).json({
        message: "No component issues found",
      });
    }

    // Send success response with the component issue requests
    res.status(200).json({ success: true, componentComplaints });
  } catch (error) {
    console.error(error);
    // Send error response
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/getStudentComplaint", async (req, res) => {
  try {
    const { grNumber } = req.body;

    const student = await Student.findOne({ grNumber });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const studentComplaints = await Complaint.find({
      studentToken: student._id,
    })
      .populate("studentToken", "student_name grNumber")
      .exec();

    if (!studentComplaints || studentComplaints.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No complaints found for the student",
      });
    }

    res.status(200).json({ success: true, studentComplaints });
  } catch (error) {
    console.error(error);
    // Send error response
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Update complaint status by ID
router.put("/updateStatus", async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({
        success: false,
        message: "ID and status are required",
      });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
      updatedComplaint,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
