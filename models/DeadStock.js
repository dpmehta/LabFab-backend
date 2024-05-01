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
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const DeadStock = mongoose.model("DeadStock", deadStockSchema);

module.exports = DeadStock;
