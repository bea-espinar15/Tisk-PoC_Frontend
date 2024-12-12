"use strict"

// ----- Import modules -----
const express = require("express");
const authService = require("../service/authService");


// ----- Create router -----
const router = express.Router();


// ----- Endpoints -----
// -- GET --
router.get("/", (req, res, next) => {
    res.redirect("/tasks");
});

router.get("/signup", (req, res, next) => {
    res.render("sign-up", {result: null, showModal: false});
});

router.get("/login", (req, res, next) => {
    res.render("login", {result: null, showModal: false});
});


// -- POST --
router.post("/signup", authService.signUp);

module.exports = router;
