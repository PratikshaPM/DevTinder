const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConectionReq = require("../models/connectionRequest");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
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
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ messaage: "Status not allowed!" });
      }

      const connectionRequest = await ConectionReq.findOne({
        toUser: loggedInUser._id,
        status: "interested",
        _id: requestId,
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = requestRouter;
