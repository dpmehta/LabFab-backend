const mongoose = require("mongoose");

const deadStockSchema = new mongoose.Schema({
  deadStockNumber: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  purchaseDate: {
    type: Date,
    required: true,
  },
  suppliersName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  purchaseAmount: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  labNumber: {
    type: String,
    required: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty", // Reference to the Student model
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  remark: {
    type: String,
    default: "",
  },
});

const DeadStock = mongoose.model("DeadStock", deadStockSchema);

module.exports = DeadStock;
