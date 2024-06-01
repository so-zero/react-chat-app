const User = require("../models/UserModel");

async function checkEmail(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(422).json({
        message: "Fill in all fields.",
        error: true,
      });
    }

    const newEmail = email.toLowerCase();

    const emailExists = await User.findOne({ email: newEmail }).select(
      "-password"
    );

    if (!emailExists) {
      return res.status(422).json({
        message: "Invalid credentials.",
        error: true,
      });
    }

    return res.status(200).json({
      message: "Email verify",
      success: true,
      data: emailExists,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = checkEmail;
