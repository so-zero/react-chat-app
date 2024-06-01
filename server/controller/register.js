const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");

async function register(req, res) {
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(422).json({
        message: "Fill in all fields.",
        error: true,
      });
    }

    const newEmail = email.toLowerCase();

    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return res.status(422).json({
        message: "Email already exists.",
        error: true,
      });
    }

    if (password.trim().length < 6) {
      return res.status(422).json({
        message: "Password should be at least 6 characters.",
        error: true,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      name,
      email: newEmail,
      password: hashedPassword,
      avatar,
    };

    const user = new User(newUser);
    const userSave = await user.save();

    return res.status(201).json({
      message: `New user ${newUser.email} registered.`,
      data: userSave,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = register;
