const mongoose = require("mongoose");
const { Schema } = mongoose;

const labLoginSchema = new Schema({
  adminId: {
    type: String,
    required: true,
    unique: true,
  },
  labNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const LabLogin = mongoose.model("LabLogin", labLoginSchema);

module.exports = LabLogin;
