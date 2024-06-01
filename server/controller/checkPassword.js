const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function checkPassword(req, res) {
  try {
    const { password, userId } = req.body;

    const user = await User.findById(userId);

    const validateUserPassword = await bcrypt.compare(password, user.password);

    if (!validateUserPassword) {
      return res.status(422).json({
        message: "Invalid current password",
        error: true,
      });
    }

    const tokenData = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const cookieOptions = {
      http: true,
      secure: true,
    };

    return res.cookie("token", token, cookieOptions).status(200).json({
      message: "Login successfully",
      token: token,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = checkPassword;
