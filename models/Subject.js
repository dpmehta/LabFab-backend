const mongoose = require("mongoose");
const { Schema } = mongoose;

const subjectSchema = new Schema({
  subjectName: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  labName: {
    type: String,
    required: true,
  },
});

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
