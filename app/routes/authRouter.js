"use strict"

// * ----- Import modules ----- *
const express = require("express");
const { userLogged, userAlreadyLogged } = require("../utils/middlewares");
const authService = require("../service/authService");


// * ----- Create router ----- *
const router = express.Router();


// * ----- Endpoints ----- *
// -- GET --
router.get("/", (req, res, next) => {
    res.redirect("/tasks");
});

router.get("/signup", userAlreadyLogged, (req, res, next) => {
    res.render("sign-up", {locale: req.locale, result: null, showModal: false});
});

router.get("/login", userAlreadyLogged, (req, res, next) => {
    res.render("login", {locale: req.locale, result: null, showModal: false});
});


// -- POST --
router.post("/signup", userAlreadyLogged, authService.signUp);

router.post("/login", userAlreadyLogged, authService.login);

router.post("/logout", userLogged, authService.logout);


module.exports = router;
