// user-service/controllers/userController.js
const User = require("../models/User");

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("Error in registerUser:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get user profile by id
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error in getUserProfile:", err);
    res.status(500).json({ error: "Server Error" });
  }
};
