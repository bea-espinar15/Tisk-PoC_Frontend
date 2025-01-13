"use strict"

// * ----- Load environment variables ----- *
require('dotenv').config();
const APP_ENV = process.env.APP_ENV;
const CONFIG_PATH = process.env.CONFIG_PATH;
const SECRETS_PATH = process.env.SECRETS_PATH;
const FIREBASE_SERVICE_PATH = process.env.FIREBASE_SERVICE_PATH;

const CONFIG = require(CONFIG_PATH);
const SECRETS = require(SECRETS_PATH);
const FIREBASE_SERVICE = require(FIREBASE_SERVICE_PATH);

// * ----- Basic config ----- *
const SESSION_CONFIG = {
    CHECK_EXPIRATION_INTERVAL: 12 * 60 * 60 * 1000,
    MAX_AGE: 7 * 24 * 60 * 60 * 1000
}

// * ----- Others ----- *
const REGEX = {
    USERNAME_REGEX: /^[a-z0-9_]{5,20}$/,
    EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PASSWORD_REGEX: /^(?=.*[a-zA-Z])(?=.*\d).{12,}$/
}

// * ----- Export ----- *
module.exports = {
    APP_ENV, 
    CONFIG,
    SECRETS,
    FIREBASE_SERVICE,
    SESSION_CONFIG,
    REGEX
}