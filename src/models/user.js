const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error("Password is not strong");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: ["female", "male", "other"],
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("PLease enter str0ng password");
        }
      },
    },
    profileURL: {
      type: String,
      default:
        "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("PLease enter valid URL");
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

//FOr schema methods always use normal functions because in this functions this is refering to current instance of the schema.
userSchema.methods.getJWTToken = function () {
  const token = jwt.sign({ _id: this._id }, "mona@123", {
    expiresIn: "1d", //expires token
  });

  return token;
};

userSchema.methods.validatePassword = async function (userInputPassword) {
  const isValidPassword = await bcrypt.compare(
    userInputPassword,
    this.password
  );
  return isValidPassword;
};

module.exports = mongoose.model("User", userSchema);
