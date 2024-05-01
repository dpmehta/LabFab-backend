const mongoose = require("mongoose");

const computerComplaintSchema = new mongoose.Schema({
  desktopId: {
    type: String,
    required: true,
  },

  issue: {
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
const ComputerComplaint = mongoose.model(
  "ComputerComplaint",
  computerComplaintSchema
);

module.exports = ComputerComplaint;
