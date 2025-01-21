const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConectionReq = require("../models/connectionRequest");

const userRouter = express.Router();

const SECURE_DATA = "firstName lastName";

userRouter.get("/user/requests-received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const receivedRequests = await ConectionReq.find({
      toUser: loggedInUser._id,
      status: "interested",
    }).populate("fromUser", ["firstName", "lastName"]);
    console.log("adf", receivedRequests);

    res.json({
      data: receivedRequests,
      message: "SUCCESS",
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

userRouter.get("/user/request-accepted", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConectionReq.find({
      $or: [
        { fromUser: loggedInUser._id, status: "accepted" },
        { toUser: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUser", SECURE_DATA)
      .populate("toUser", SECURE_DATA);

    const data = connections.map((conn) => {
      if (conn.fromUser.equals(loggedInUser._id)) {
        return conn.toUser;
      } else {
        return conn.fromUser;
      }
    });
    res.json({
      data,
      message: "Data fetched successfully",
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});
module.exports = userRouter;
