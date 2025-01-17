const mongoose = require("mongoose");
const connectDB = async () => {
  return await mongoose.connect("xyx");
};

module.exports = connectDB;
