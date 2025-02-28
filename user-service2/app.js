const express = require("express");
const userRoutes = require("./userRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json()); // Middleware to parse JSON data

// Root route to check if the server is running
app.get("/", (req, res) => {
  res.send("✅ User Service is running!");
});

// User routes
app.use("/api/users", userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ User service running at: http://localhost:${PORT}`);
});
