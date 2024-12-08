"use strict"

// ----- Import modules -----
// 1. CORE
const path = require("path");

// 2. PACKAGE
const express = require("express");
const morgan = require("morgan");
const mySql = require("mysql");
const session = require("express-session");
const mySqlSession = require("express-mysql-session");

// 3. FILE
const constants = require("./config/constants");
const dbConfig = require("./config/dbConfig");
const logger = require("./config/logger");
const tasksRouter = require("./routes/tasksRouter");
const authRouter = require("./routes/authRouter");
const Result = require("./utils/result");
const ERROR_RESPONSE = require("./utils/responseEnum").ERROR_RESPONSE;


// ----- Configure app -----
const app = express();

// -- Templates: EJS --
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// -- Static resources --
app.use(express.static(path.join(__dirname, "public")));

// -- Body parsers --
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -- Logging --
app.use(morgan("dev"));

// -- MySQL Session config --
const mySqlStore = mySqlSession(session);
const sessionStore = new mySqlStore(dbConfig);

const sessionMiddleware = session({
    saveUninitialized: false,
    secret: constants.SECRETS["COOKIE_SECRET"],
    resave: true,
    store: sessionStore,
    rolling: true
});
app.use(sessionMiddleware);

// -- DB config --
const pool = mySql.createPool(dbConfig);


// ----- Routers -----
app.use("/", authRouter);
app.use("/tasks", tasksRouter);


// ----- 404 Handler -----
app.use((req, res, next) => {
    res.status(404);
    res.render("error-page", {result: new Result(false, 404, ERROR_RESPONSE["NOT_FOUND"], null)});
});


// ----- Init server -----
app.listen(constants.CONFIG["PORT_ORCHESTRATOR"], (error) => {
    if (error) {
        logger.error(`[GENERAL] - Error initializing server: ${error.message}`);
    }
    else {
        logger.debug(`[GENERAL] - Server has been started on port ${constants.CONFIG["PORT_ORCHESTRATOR"]}`);
    }
});