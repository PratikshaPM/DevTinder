const jwt = require("jsonwebtoken");

const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }
    const decodedObj = jwt.verify(token, "mona@123");
    if (!decodedObj) {
      throw new Error("Could not authenticate you");
    }
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("Could not find the user");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).send("ERR:" + err.message);
  }
};

module.exports = {
  userAuth,
};
