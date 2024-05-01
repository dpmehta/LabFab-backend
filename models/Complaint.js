const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  componentId: {
    type: String,
    required: true,
  },
  componentName: {
    type: String,
    required: true,
  },
  issueDescription: {
    type: String,
    required: true,
  },
  imageUpload: String,
  labLocation: {
    type: String,
    required: true,
  },
  studentToken: {
    type: mongoose.Schema.Types.ObjectId, // Change type to ObjectId
    ref: "Student", // Reference to the Student model
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["resolved", "unresolved"],
    default: "unresolved",
  },
});

// Create Mongoose Model
const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;
