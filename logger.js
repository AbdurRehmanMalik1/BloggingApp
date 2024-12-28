const winston = require('winston');
const path = require('path');
const fs = require('fs');


winston.remove(winston.transports.Console);

// Define the log directory path
const logDirectory = path.join(__dirname, '/log'); 

// Ensure the log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Create the logger
const logger = winston.createLogger({
  level: 'info',  // Default log level
  transports: [
    // Log to file in the 'log' folder
    new winston.transports.File({ filename: path.join(logDirectory, 'log.txt') }),
    // Log to console (optional)
    // new winston.transports.Console({ format: winston.format.simple() })
  ]
});

// Check if transports are available
if (logger.transports.length === 0) {
  console.error('[winston] No transports configured.');
}

// Export the logger for use in other files
module.exports = logger;
