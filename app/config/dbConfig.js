"use strict"

// ----- Import modules -----
const constants = require("./constants");

// ----- DB config -----
const dbConfig = {
    host: constants.SECRETS["MYSQL_HOST"],
    port: constants.SECRETS["MYSQL_PORT"],
    user: constants.SECRETS["MYSQL_USER"],
    pass: constants.SECRETS["MYSQL_PASS"],
    database: constants.CONFIG["MYSQL_TISK_DB"],
    
    clearExpired: constants.DB_CONFIG["CLEAR_EXPIRED"],  // Remove expired sessions
    checkExpirationInterval:  constants.DB_CONFIG["CHECK_EXPIRATION_INTERVAL"],  // Interval to check if there's any expired session
    ttl: constants.DB_CONFIG["TTL"],  // Session expires after 1 week of inactivity
}

module.exports = dbConfig;