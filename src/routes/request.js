const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConectionReq = require("../models/connectionRequest");
const requestRouter = express.Router();

requestRouter.post("/request/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const { status, toUserId } = req.params;

    const allowedStatuses = ["ignore", "interested"];
    if (!allowedStatuses.includes(status)) {
      return res.status(500).send("ERR: Invalid Status");
    }

    const toUserInstace = await User.findById({ _id: toUserId });
    if (!toUserInstace) {
      return res.status(500).send("ERR: User is not present!");
    }

    const isRequestAlreadyPresent = await ConectionReq.findOne({
      $or: [
        { fromUser: req.user._id, toUser: toUserId },
        {
          fromUser: toUserId,
          toUser: req.user._id,
        },
      ],
    });

    if (isRequestAlreadyPresent) {
      return res
        .status(500)
        .send("ERR: Connection Request is already present!");
    }

    const connectionInstance = new ConectionReq({
      fromUser: req.user._id,
      toUser: toUserId,
      status,
    });
    const data = await connectionInstance.save();
    res.json({
      message: "Connect Request processed successfully",
      data,
    });
  } catch (err) {
    res.status(500).send("ERR:" + err.message);
  }
});

module.exports = requestRouter;
