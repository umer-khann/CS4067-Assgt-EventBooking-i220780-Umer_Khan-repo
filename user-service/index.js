const express = require("express");
const app = express();
const port = 3000;

app.use(express.json()); // For parsing JSON request bodies

// Array to simulate a "database" of users
let users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

// GET all users
app.get("/users", (req, res) => {
  res.status(200).json(users);
});

// GET a user by ID
app.get("/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found");
  res.status(200).json(user);
});

// POST a new user
app.post("/users", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send("Name is required");
  const newUser = { id: users.length + 1, name };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT (update) a user by ID
app.put("/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found");
  user.name = req.body.name || user.name;
  res.status(200).json(user);
});

// DELETE a user by ID
app.delete("/users/:id", (req, res) => {
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send("User not found");
  users.splice(index, 1);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`User service running on http://localhost:${port}`);
});
