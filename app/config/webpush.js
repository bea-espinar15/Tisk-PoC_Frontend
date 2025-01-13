"use strict"


// * ----- Import modules ----- *
const webpush = require("web-push");
const constants = require("./constants");


// * ----- Configure webpush ----- *
webpush.setVapidDetails(
    `mailto:${constants.CONFIG["SERVER_EMAIL"]}`,
    constants.SECRETS["PUBLIC_VAPID_KEY"],
    constants.SECRETS["PRIVATE_VAPID_KEY"]
);


module.exports = webpush;