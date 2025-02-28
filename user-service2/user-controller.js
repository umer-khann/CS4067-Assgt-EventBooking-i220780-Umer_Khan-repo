const pool = require("./db");

const registerUser = async (req, res) => {
  const { username, password, email } = req.body;
  const result = await pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
    [username, email, password]
  );
  res.status(201).json(result.rows[0]);
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  const user = result.rows[0];
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({ message: "Login successful", user });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
};

const getUserProfile = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    "SELECT id, username, email FROM users WHERE id = $1",
    [id]
  );
  res.json(result.rows[0]);
};

module.exports = { registerUser, loginUser, getUserProfile };
