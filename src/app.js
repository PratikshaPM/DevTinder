const express = require("express");
const bcrypt = require("bcrypt");
const cookeiParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const { userAuth } = require("./middlewares/auth.js");

const app = express();
// Middle ware to parse json request boday in javascript object
app.use(express.json());
// Middleware to parse the cookies
app.use(cookeiParser());

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    await user.save();
    res.send("data saved successfully");
  } catch (err) {
    res.status(500).send("failed to save data" + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    if (!userData) {
      throw new Error("Invalid Credential");
    }
    const isValidPassword = userData.validatePassword(password);
    if (isValidPassword) {
      var token = userData.getJWTToken();
      res.cookie("token", token);
      res.send("Logged in successfully");
    } else {
      throw new Error("Invalid Credential");
    }
  } catch (err) {
    res.status(500).send("ERR:" + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(500).send("ERR:" + err.message);
  }
});

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
