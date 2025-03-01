// user-service/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  getUserProfile,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.get("/:id", getUserProfile);

module.exports = router;
