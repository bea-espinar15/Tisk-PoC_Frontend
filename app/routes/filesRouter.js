"use strict"

// * ----- Import modules ----- *
const express = require("express");
const multer = require("multer");
const filesService = require("../service/filesService");


// * ----- Configure multer ----- *
const multerFactory = multer({ storage: multer.memoryStorage() });


// * ----- Create router ----- *
const router = express.Router();


// * ----- Endpoints ----- *
// -- GET --
router.get("/", filesService.downloadFile);


// -- POST --
router.post("/", multerFactory.single("uploadedFile"), filesService.uploadFile);


module.exports = router;
