const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConectionReq = require("../models/connectionRequest");
const User = require("../models/user");

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

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const noOfRecords = parseInt(req.query.noOfRecords) || 10;
    const skip = (page - 1) * noOfRecords;
    const existingConnections = await ConectionReq.find({
      $or: [{ fromUser: loggedInUser._id }, { toUser: loggedInUser._id }],
    }).select("fromUser toUser");

    const uniqueIds = new Set();
    existingConnections.forEach((conn) => {
      uniqueIds.add(conn.fromUser);
      uniqueIds.add(conn.toUser);
    });

    const feedData = await User.find({
      $and: [
        { _id: { $nin: Array.from(uniqueIds) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName lastName email profileURL skills")
      .skip(skip)
      .limit(noOfRecords);

    res.json({
      data: feedData,
      message: "Fetched Data successfully",
    });
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});
module.exports = userRouter;
