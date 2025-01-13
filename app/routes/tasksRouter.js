"use strict"

// * ----- Import modules ----- *
const express = require("express");
const tasksService = require("../service/tasksService");


// * ----- Create router ----- *
const router = express.Router();


// * ----- Endpoints ----- *
// -- GET --
router.get("/", tasksService.getAllTasks);


// -- POST --
router.post("/", tasksService.createTask);


module.exports = router;
