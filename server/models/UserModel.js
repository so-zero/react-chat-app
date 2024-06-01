const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "provider name"],
    },
    email: {
      type: String,
      required: [true, "provider email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "provider password"],
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
