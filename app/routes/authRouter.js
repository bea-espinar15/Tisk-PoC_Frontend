"use strict"

// ----- Import modules -----
const express = require("express");


// ----- Create router -----
const router = express.Router();


// ----- Endpoints -----
// -- GET --
router.get("/", (req, res, next) => {
    res.redirect("/tasks");
});

router.get("/signup", (req, res, next) => {
    res.render("sign-up");
});

router.get("/login", (req, res, next) => {
    res.render("login");
});


// -- POST --


module.exports = router;
