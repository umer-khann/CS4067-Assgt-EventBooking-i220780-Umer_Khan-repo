const pool = require("./db");
const { log } = require("./logger");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    log(`User registered: ${username}`);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    log(`Error registering user: ${err.message}`, "ERROR");
    res.status(500).json({ error: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    log(`User logged in: ${username}`);
    res.json({
      message: "Login successful",
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    log(`Error logging in user: ${err.message}`, "ERROR");
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    log(`Fetched profile for user ID: ${id}`);
    res.json(result.rows[0]);
  } catch (err) {
    log(`Error fetching user profile: ${err.message}`, "ERROR");
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
