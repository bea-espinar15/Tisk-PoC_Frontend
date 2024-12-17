"use strict"

// * ----- Import modules ----- *
// 1. CORE
const path = require("path");

// 2. PACKAGE
const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const mySqlSession = require("express-mysql-session");
const i18n = require('i18n');

// 3. FILE
const constants = require("./config/constants");
const dbConfig = require("./config/dbConfig");
const logger = require("./config/logger");
const tasksRouter = require("./routes/tasksRouter");
const authRouter = require("./routes/authRouter");
const Result = require("./utils/result");
const { userLogged, setLocale, addResponseLocale } = require("./utils/middlewares");


// * ----- Configure app ----- *
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
    rolling: true,
    cookie: {
        maxAge: constants.SESSION_CONFIG["MAX_AGE"],
        secure: constants.APP_ENV == "pro",
        httpOnly: true,
        sameSite: "strict"
    }
});
app.use(sessionMiddleware);

// -- Multilanguage --
i18n.configure({
    locales: ['en', 'es'],
    defaultLocale: 'en',
    directory: path.join(__dirname, 'locales'),
    objectNotation: true,
    detectBrowserLanguage: true
});
app.use(i18n.init);


// * ----- Middlewares ----- *
app.use(setLocale);
app.use(addResponseLocale);


// * ----- Routers ----- *
app.use("/", authRouter);
app.use("/tasks", userLogged, tasksRouter);


// * ----- 404 Handler ----- *
app.use((req, res, next) => {
    res.status(404);
    res.render("error-page", { locale: req.locale, username: req.session.user.username, result: new Result(false, 404, req.responses["NOT_FOUND"], null) });
});


// * ----- Init server ----- *
app.listen(constants.CONFIG["PORT_ORCHESTRATOR"], (error) => {
    if (error) {
        logger.error(`[GENERAL] - Error initializing server: ${error.message}`);
    }
    else {
        logger.debug(`[GENERAL] - Server has been started on port ${constants.CONFIG["PORT_ORCHESTRATOR"]}`);
    }
});