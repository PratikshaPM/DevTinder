const express = require("express");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    if (!userData) {
      throw new Error("Invalid Credential1");
    }
    const isValidPassword = await userData.validatePassword(password);
    if (isValidPassword) {
      var token = userData.getJWTToken();
      res.cookie("token", token);
      res.send("Logged in successfully");
    } else {
      throw new Error("Invalid Credential2");
    }
  } catch (err) {
    res.status(500).send("ERR:" + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("logged out successfully");
});

module.exports = authRouter;
