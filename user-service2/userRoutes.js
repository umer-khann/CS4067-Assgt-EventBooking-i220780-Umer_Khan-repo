const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
} = require("./user-controller");

// Route for getting all users
router.get("/", getAllUsers);

// Other routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", getUserProfile);

module.exports = router;
