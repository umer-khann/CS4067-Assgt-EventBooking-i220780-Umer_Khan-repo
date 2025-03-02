const User = require("../models/User");
const logger = require("../config/logger");

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    logger.info(
      `registerUser: Attempting to register user with email: ${email}`
    );
    const newUser = new User({ username, email, password });
    await newUser.save();
    logger.info(
      `registerUser: User registered successfully with id: ${newUser._id}`
    );
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    logger.error(`registerUser: Error occurred - ${err.message}`);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get user profile by id
exports.getUserProfile = async (req, res) => {
  try {
    logger.info(`getUserProfile: Fetching user with id: ${req.params.id}`);
    const user = await User.findById(req.params.id);
    if (!user) {
      logger.info(`getUserProfile: User not found with id: ${req.params.id}`);
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    logger.error(`getUserProfile: Error occurred - ${err.message}`);
    res.status(500).json({ error: "Server Error" });
  }
};
