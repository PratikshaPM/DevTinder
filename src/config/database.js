const mongoose = require("mongoose");
const connectDB = async () => {
  return await mongoose.connect(
    "mongodb+srv://mahajanpratiksha2014:qNSTWoZkohw0YTQa@cluster0.5bkys.mongodb.net/DevTinder"
  );
};

module.exports = connectDB;
