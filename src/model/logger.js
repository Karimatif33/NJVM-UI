const { createLogger, transports, format } = require("winston");

// Define logger configuration
const logger = createLogger({
  level: "info", // Set the default log level
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.json() // Format logs as JSON
  ),
  transports: [
    // new transports.Console(), // Log to console
    new transports.File({ filename: "ReqLog.log" }), // Log to file
  ],
});

module.exports = logger;
