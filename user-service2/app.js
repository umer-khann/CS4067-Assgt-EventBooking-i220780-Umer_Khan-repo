const express = require("express");
const userRoutes = require("./userRoutes"); // Path to your user routes file

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json()); // Middleware to parse incoming JSON data

// Use user routes
app.use("/users", userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
