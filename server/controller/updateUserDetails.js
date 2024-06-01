const getUserToken = require("../middleware/getUserToken");
const User = require("../models/UserModel");

async function updateUserDetails(req, res) {
  try {
    const token = req.cookies.token || "";

    const user = await getUserToken(token);

    const { name, avatar } = req.body;

    const updateUser = await User.updateOne(
      { _id: user._id },
      {
        name,
        avatar,
      }
    );

    const userInfo = await User.findById(user._id).select("-password");

    return res.json({
      message: "User update successfully",
      data: userInfo,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = updateUserDetails;
