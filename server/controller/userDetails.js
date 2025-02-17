const getUserToken = require("../middleware/getUserToken");

async function userDetails(req, res) {
  try {
    const token = req.cookies.token || "";

    const user = await getUserToken(token);

    return res.status(200).json({
      message: "User details",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = userDetails;
