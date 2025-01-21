const express = require("express");
const { userAuth } = require("../middlewares/auth.js");
const {
  validateProfileEdit,
  validateForgetPassword,
} = require("../utils/requestValidation");
const bcrypt = require("bcrypt");
const validator = require("validator");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(500).send("ERR:" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEdit(req.body)) {
      throw new Error("Payload is not valid");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach(
      (field) => (loggedInUser[field] = req.body[field])
    );
    await loggedInUser.save();
    res.json({
      status: "SUCCESS",
      data: loggedInUser,
    });
  } catch (err) {
    res.status(500).send("ERR:" + err.message);
  }
});

profileRouter.patch("/profile/forgetPassword", userAuth, async (req, res) => {
  try {
    if (!validateForgetPassword(req.body)) {
      throw new Error("Payload is not valid");
    }
    const loggedInUser = req.user;
    const { currentPassword, newPassword } = req.body;
    const isValidPassword = loggedInUser.validatePassword(currentPassword);
    if (isValidPassword) {
      if (!validator.isStrongPassword(newPassword)) {
        throw new Error("PLease enter strong password");
      }
      loggedInUser.password = await bcrypt.hash(newPassword, 10);
    }

    await loggedInUser.save();
    res.send("Passed updated successfully");
  } catch (err) {
    res.status(500).send("ERR:" + err.message);
  }
});

module.exports = profileRouter;
