"use strict"

// * ----- Import modules ----- *
const constants = require("./constants");

// * ----- DB config ----- *
const dbConfig = {
    host: constants.SECRETS["MYSQL_HOST"],
    port: constants.SECRETS["MYSQL_PORT"],
    user: constants.SECRETS["MYSQL_USER"],
    pass: constants.SECRETS["MYSQL_PASS"],
    database: constants.CONFIG["MYSQL_TISK_DB"],
    
    clearExpired: true,  // Remove expired sessions
    checkExpirationInterval:  constants.SESSION_CONFIG["CHECK_EXPIRATION_INTERVAL"]  // Interval to check if there's any expired session
}

module.exports = dbConfig;