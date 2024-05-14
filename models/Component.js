const mongoose = require("mongoose");

const ComponentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    imageUpload: String,
  },
  {
    timestamps: true,
  }
);

const Component = mongoose.model("Component", ComponentSchema);

module.exports = Component;
