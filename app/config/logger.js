"use strict"

// ----- Import modules -----
const winston = require('winston');
const constants = require("./constants");

// ----- Configure logger -----
const logFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
});

const logger = winston.createLogger({
  level: constants.APP_ENV == "dev" ? "debug" : "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new winston.transports.Console()
  ]
});

module.exports = logger;
