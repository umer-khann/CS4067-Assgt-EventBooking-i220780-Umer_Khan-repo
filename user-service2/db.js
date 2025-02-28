const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

pool
  .connect()
  .then((client) => {
    client.query("SELECT current_database()", (err, res) => {
      if (err) {
        console.error("Error fetching database name:", err.message);
      } else {
        console.log("Connected to database:", res.rows[0].current_database);
      }
      client.release();
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed", err.message);
  });

module.exports = pool;
