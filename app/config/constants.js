"use strict"

// ----- Load environment variables -----
require('dotenv').config();
const APP_ENV = process.env.APP_ENV;
const CONFIG_PATH = process.env.CONFIG_PATH;
const SECRETS_PATH = process.env.SECRETS_PATH;

const CONFIG = require(CONFIG_PATH);
const SECRETS = require(SECRETS_PATH);

// ----- Basic config -----
const DB_CONFIG = {
    CLEAR_EXPIRED: true,
    CHECK_EXPIRATION_INTERVAL: 12 * 60 * 60 * 1000,
    TTL: 7 * 24 * 60 * 60 * 1000
}


// ----- Export -----
module.exports = {
    APP_ENV: APP_ENV,
    CONFIG: CONFIG,
    SECRETS: SECRETS,
    DB_CONFIG: DB_CONFIG
}