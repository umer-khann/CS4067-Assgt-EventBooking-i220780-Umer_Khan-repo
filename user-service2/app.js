const express = require("express");
require("dotenv").config();
const userRoutes = require("./userRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`✅ User service running at: http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/users`);
});
