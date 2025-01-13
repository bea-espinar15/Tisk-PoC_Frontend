"use strict"

// * ----- Import modules ----- *
const express = require("express");
const constants = require("../config/constants");
const notificationsService = require("../service/notificationsService");


// * ----- Create router ----- *
const router = express.Router();


// * ----- Endpoints ----- *
// -- GET --
router.get("/public-vapid-key", (req, res, next) => {
    res.status(200).json({ publicVapidKey: constants.SECRETS["PUBLIC_VAPID_KEY"] });
});

// -- POST --
router.post("/", notificationsService.sendNotification);

router.post("/subscription", notificationsService.createSubscription);

router.post("/permission", notificationsService.changeNotificationsPermissions);

module.exports = router;