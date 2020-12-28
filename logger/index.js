const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;

const printCustomFormat = printf((args) => JSON.stringify(args));

const customFormat = combine(
  label({ label: "Custom Label" }),
  timestamp(),
  format.json()
);

const options = {
  // level: "info", => Don't set the levels, use the npm levels which are default
  format: customFormat,
  defaultMeta: { service: "winston-service" }, // Set with env variables
  transports: [
    new transports.File({
      filename: "error.log",
      level: "error",
      handleExceptions: true, // Handle Uncaught Exceptions
      handleRejections: true, // Handle Uncaught Promise Rejections
    }),
    new transports.File({
      filename: "combined.log",
    }),
  ],
  exceptionHandlers: [new transports.File({ filename: "exceptions.log" })], // Handles Uncaught Exceptions with a separate transporter
  exitOnError: true, // By default, winston will exit after logging an uncaughtException. If this is not the behavior you want, set to false
  rejectionHandlers: [new transports.File({ filename: "rejections.log" })], // Handle Uncaught Promise Rejections
};

const logger = createLogger(options);

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}

module.exports = logger;
