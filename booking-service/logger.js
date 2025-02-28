const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "booking-service.log");

function log(message, level = "INFO") {
  const logMessage = `${new Date().toISOString()} [BOOKING SERVICE] [${level}] ${message}\n`;
  fs.appendFileSync(logFilePath, logMessage);
}

module.exports = { log };
