const express = require("express");
const cookeiParser = require("cookie-parser");
const connectDB = require("./config/database.js");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");

const app = express();
// Middle ware to parse json request boday in javascript object
app.use(express.json());
// Middleware to parse the cookies
app.use(cookeiParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("connected to db");
    app.listen(3001, () => {
      console.log("started listening on port 3001");
    });
  })
  .catch((err) => {
    console.log("failed to connect to db");
  });
