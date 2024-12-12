"use strict"

// ----- Import modules -----
const express = require("express");
const callHandler = require("../utils/callHandler");


// ----- Create router -----
const router = express.Router();


// ----- Endpoints -----
// -- GET --
router.get("/", async (req, res, next) => {
    // Call API
    const result = await callHandler.handleGetCall("/tasks", null);
    // Handle response
    res.status(result.code);
    if (result.code == 404 || result.code == 500)
        res.render("error-page", {result: result});
    else {
        res.render("index", {showModal: false, result: null, tasks: result.data});
    }
});


// -- POST --
router.post("/", async (req, res, next) => {
    // Build body for request
    const body = {
        title: req.body.title
    }
    // Call API
    const result = await callHandler.handlePostCall("/tasks", body);
    // Get tasks for render
    const tasks = await callHandler.handleGetCall("/tasks", null);
    // Handle response
    res.status(Math.max(result.code, tasks.code));
    if (result.code == 404 || tasks.code == 404 || result.code == 500 || tasks.code == 500)
        res.render("error-page", {result: result});
    else
        res.render("index", {showModal: result.code != 400, result: result, tasks: tasks.data});
});


module.exports = router;
