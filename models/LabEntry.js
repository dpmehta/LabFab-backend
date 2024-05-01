const mongoose = require("mongoose");

const LabEntrySchema = new mongoose.Schema({
  grNumber: {
    type: String,
    required: true,
  },
  entryTime: {
    type: Date,
    default: Date.now,
  },
  leaveTime: {
    type: Date,
    default: Date.now,
  },
  purpose: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  labCode: {
    type: String,
    required: true,
  },
  studentToken: {
    type: mongoose.Schema.Types.ObjectId, // Change type to ObjectId
    ref: "Student", // Reference to the Student model
    required: true,
  },
});

module.exports = mongoose.model("LabEntry", LabEntrySchema);
