import winston from "winston";
import path from "path";
import fs from "fs";

// Define log directory at the root of the project
const logDirectory = path.join(process.cwd(), "logs");

// Ensure the logs directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Logs to Console
    new winston.transports.File({
      filename: path.join(logDirectory, "error.log"),
      level: "error",
    }), // Logs Errors to File
    new winston.transports.File({
      filename: path.join(logDirectory, "combined.log"),
    }), // Logs Everything
  ],
});

export default logger;
