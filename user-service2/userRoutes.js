const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("./user-controller");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", getUserProfile);

module.exports = router;
