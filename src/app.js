const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const app = express();

// Middle ware to parse json request boday in javascript object
app.use(express.json());

// Get user with email id
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const users = await User.find({ email: userEmail });
    res.send(users);
  } catch (err) {
    res.status(500).send("user not found" + err.message);
  }
});

// Get all the users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send("user not found" + err.message);
  }
});

// delete user with id
app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const result = await User.findByIdAndDelete(userId);
    console.log("result", result);
    res.send({
      data: {},
      STATUS: "SUCCESS",
    });
  } catch (err) {
    res.status(500).send("Filed to delete" + err.message);
  }
});

// update by email
app.patch("/user", async (req, res) => {
  try {
    const params = req.query;
    console.log("param", params);

    const result = await User.findOneAndUpdate(
      { email: params.userEmail },
      req.body
    );
    console.log("result123", result);
    res.send({
      data: {},
      STATUS: "SUCCESS",
    });
  } catch (err) {
    res.status(500).send("Filed to update" + err.message);
  }
});

//update by id
app.patch("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const result = await User.findByIdAndUpdate(userId, req.body);
    console.log("result", result);
    res.send({
      data: {},
      STATUS: "SUCCESS",
    });
  } catch (err) {
    res.status(500).send("Filed to delete" + err.message);
  }
});

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("data saved successfully");
  } catch (err) {
    res.status(500).send("failed to save data" + err.message);
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
