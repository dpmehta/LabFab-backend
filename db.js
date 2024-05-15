const mongoose = require("mongoose");
require("dotenv").config();

const connectToMongo = () => {
  try {
    mongoose.connect(process.env.MONGO_URL);
    console.log("connected succesfully");
  } catch (error) {
    console.log(error);
  }
};
mongodb: module.exports = connectToMongo;
