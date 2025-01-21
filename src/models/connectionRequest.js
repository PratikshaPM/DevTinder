const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: {
        values: ["ignore", "interested", "accepted", "rejected"],
        message: "{VALUE} is not supported",
      },
    },
  },
  {
    timestamp: true,
  }
);

connectionRequestSchema.index({ fromUser: 1, toUser: 1 });

// FUnction will be called before save function is called
connectionRequestSchema.pre("save", function (next) {
  if (this.toUser.equals(this.fromUser)) {
    throw new Error("You can not send request to yourself");
  } else {
    next();
  }
});

module.exports = mongoose.model("ConectionReq", connectionRequestSchema);
