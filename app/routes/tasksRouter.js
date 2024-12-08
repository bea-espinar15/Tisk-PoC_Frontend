"use strict"

// ----- Import modules -----
const express = require("express");
const axios = require('axios');
const constants = require("../config/constants");
const logger = require("../config/logger");
const callHandler = require("../utils/callHandler");


// ----- Create router -----
const router = express.Router();


// ----- Endpoints -----
// -- POST --
router.post("/", async (req, res, next) => {
    // Build body for request
    const body = {
        title: req.body["input-title"]
    }
    // Call API
    const result = await callHandler.handlePostCall("/tasks", body);
    // Handle response
    const showModal = result.code != 400;
    res.status(result.code);
    res.render("index", {showModal: showModal, result: result});
});


module.exports = router;
