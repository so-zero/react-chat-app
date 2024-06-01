const express = require("express");
const register = require("../controller/register");
const checkEmail = require("../controller/checkEmail");
const checkPassword = require("../controller/checkPassword");
const userDetails = require("../controller/userDetails");
const logout = require("../controller/logout");
const updateUserDetails = require("../controller/updateUserDetails");
const searchUser = require("../controller/searchUser");

const router = express.Router();

// create user
router.post("/register", register);

// check email
router.post("/email", checkEmail);

// check password
router.post("/password", checkPassword);

// login user details
router.get("/user-details", userDetails);

// logout user
router.get("/logout", logout);

// update user details
router.post("/update-user", updateUserDetails);

// search user
router.post("/search-user", searchUser);

module.exports = router;
