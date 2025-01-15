"use strict"

// * ----- Import modules ----- *
const logger = require("../config/logger");
const callHandler = require("../utils/callHandler");
const webpush = require("../config/webpush");


class NotificationsService {

    // --- CREATE SUBSCRIPTION ---
    // Creates a subscription for a new device of the user
    createSubscription = async (req, res, next) => {
        // Build body for request
        req.body.subscription = JSON.parse(req.body.subscription);
        const body = {
            endpoint: req.body.subscription.endpoint,
            auth: req.body.subscription.keys.auth,
            p256dh: req.body.subscription.keys.p256dh
        }
        // Call API
        const result = await callHandler.handlePostCall(req.responses, "/subscriptions", req.session.user.accessToken, body);
        // Get tasks and files for render
        const tasks = await callHandler.handleGetCall(req.responses, "/tasks", req.session.user.accessToken);
        const files = await callHandler.handleGetCall(req.responses, "/users/files", req.session.user.accessToken);
        // Handle response
        res.status(Math.max(result.code, tasks.code, files.code));
        if (result.code == 404 || tasks.code == 404 || files.code == 404 || result.code == 500 || tasks.code == 500 || files.code == 500) {
            logger.error(`[GENERAL] Error creating subscription or retrieving tasks or files: ${result.code} ${tasks.code} ${files.code}`);
            res.render("error-page", { locale: req.locale, result: result, username: req.session.user.username });
        }
        else {
            res.render("index", { locale: req.locale, showModal: true, result: result, tasks: tasks.data, files: files.data, username: req.session.user.username, notificationsAllowed: req.session.user.notificationsAllowed });
        }
    }

    // --- ENABLE/DISABLE NOTIFICATIONS ---
    // Enables or disables app notifications for user. If notifications are being enabled and device wasn't subscribed, it also creates a new subscription
    changeNotificationsPermissions = async (req, res, next) => {
        // Build body for request
        req.body.notificationsAllowed = req.body.notificationsAllowed === "true";
        const body = {
            notificationsAllowed: req.body.notificationsAllowed,
        }
        // Call API
        const result = await callHandler.handlePatchCall(req.responses, "/users", req.session.user.accessToken, body);
        // Get tasks and files for render
        const tasks = await callHandler.handleGetCall(req.responses, "/tasks", req.session.user.accessToken);
        const files = await callHandler.handleGetCall(req.responses, "/users/files", req.session.user.accessToken);
        // Handle response                
        if (result.code != 200) {
            res.status(Math.max(result.code, tasks.code, files.code));
            if (result.code == 404 || tasks.code == 404 || files.code == 404 || result.code == 500 || tasks.code == 500 || files.code == 500) {
                logger.error(`[GENERAL] Error updating notifications permissions or retrieving tasks or files: ${result.code} ${tasks.code} ${files.code}`);
                res.render("error-page", { locale: req.locale, result: result, username: req.session.user.username });
            }
            else {
                res.render("index", { locale: req.locale, showModal: true, result: result, tasks: tasks.data, files: files.data, username: req.session.user.username, notificationsAllowed: req.session.user.notificationsAllowed });
            }
        }
        else {
            // Update session
            req.session.user.notificationsAllowed = req.body.notificationsAllowed;

            // Check if a subscription needs to be created
            if (req.body.notificationsAllowed && req.body.subscription) {
                // Parse JSON
                req.body.subscription = JSON.parse(req.body.subscription);
                const bodySubscription = {
                    endpoint: req.body.subscription.endpoint,
                    auth: req.body.subscription.keys.auth,
                    p256dh: req.body.subscription.keys.p256dh
                }
                const resultSubscription = await callHandler.handlePostCall(req.responses, "/subscriptions", req.session.user.accessToken, bodySubscription);
                res.status(Math.max(resultSubscription.code, tasks.code, files.code));
                if (result.code == 404 || tasks.code == 404 || files.code == 404 || result.code == 500 || tasks.code == 500 || files.code == 500) {
                    logger.error(`[GENERAL] Error creating subscription or retrieving tasks or files: ${result.code} ${tasks.code} ${files.code}`);
                    res.render("error-page", { locale: req.locale, result: resultSubscription, username: req.session.user.username });
                }
                else {
                    res.render("index", { locale: req.locale, showModal: true, result: resultSubscription, tasks: tasks.data, files: files.data, username: req.session.user.username, notificationsAllowed: req.session.user.notificationsAllowed });
                }
            }
            else {
                res.status(Math.max(tasks.code, files.code));
                if (tasks.code == 404 || files.code == 404 || tasks.code == 500 || files.code == 500) {
                    logger.error(`[GENERAL] Error retrieving tasks or files: ${tasks.code} ${files.code}`);
                    res.render("error-page", { locale: req.locale, result: result, username: req.session.user.username });
                }
                else {
                    res.render("index", { locale: req.locale, showModal: true, result: result, tasks: tasks.data, files: files.data, username: req.session.user.username, notificationsAllowed: req.session.user.notificationsAllowed });
                }
            }
        }
    }

    // --- SEND NOTIFICATION ---
    // Retrieves all subscriptions from user and sends a notification to all of their devices (if notificationsAllowed = true)
    sendNotification = async (req, res, next) => {
        // Call API
        const result = await callHandler.handleGetCall(req.responses, "/subscriptions", req.session.user.accessToken);
        // Get tasks and files for render
        const tasks = await callHandler.handleGetCall(req.responses, "/tasks", req.session.user.accessToken);
        const files = await callHandler.handleGetCall(req.responses, "/users/files", req.session.user.accessToken);
        // Handle response
        res.status(Math.max(result.code, tasks.code, files.code));
        if (result.code == 404 || tasks.code == 404 || files.code == 404 || result.code == 500 || tasks.code == 500 || files.code == 500) {
            logger.error(`[GENERAL] Error creating subscription or retrieving tasks or files: ${result.code} ${tasks.code} ${files.code}`);
            res.render("error-page", { locale: req.locale, result: result, username: req.session.user.username });
        }
        else if (result.code == 400) {
            logger.info(`[BUSINESS] User ${req.session.user.username} attempted to send a notification without having allowed it`);
            res.render("index", { locale: req.locale, showModal: true, result: result, tasks: tasks.data, files: files.data, username: req.session.user.username, notificationsAllowed: req.session.user.notificationsAllowed });
        }
        else {
            // Send notifications
            const notificationLocale = require(`../locales/notification_${req.locale}.json`);
            const payload = JSON.stringify({
                title: notificationLocale.title.replace("$username", req.session.user.username),
                body: notificationLocale.body,                
                icon: "/img/icon_no_bg.png",
                badge: "/img/icon_no_bg.png",
                url: "/tasks"
            });

            result.data.forEach(async (sub) => {
                try {
                    const subscription = {
                        endpoint: sub.endpoint,
                        keys: {
                            p256dh: sub.p256dh,
                            auth: sub.auth
                        }
                    }

                    await webpush.sendNotification(subscription, payload);
                    logger.info(`[GENERAL] Notification sent successfully to ${sub.endpoint}`);                        
                }
                catch (error) {
                    if (error.statusCode == 410) {
                        logger.info(`[GENERAL] User removed permissions from browser for endpoint ${sub.endpoint}. Deleting subscription...`);
                        // Delete subscription
                        const deleteResult = await callHandler.handleDeleteCall(req.responses, "/subscriptions", req.session.user.accessToken, {endpoint: sub.endpoint});
                        if (deleteResult.code != 200)
                            logger.error(`[GENERAL] Subscription for endpoint ${sub.endpoint} could not be deleted: ${deleteResult.code}`);
                        else
                            logger.info(`[GENERAL] Subscription for endpoint ${sub.endpoint} was successfully deleted`)
                    }
                    else {
                        logger.error(`[GENERAL] Error sending notification to ${sub.endpoint}: ${error.statusCode}`);
                    }                    
                }
            });
            res.render("index", { locale: req.locale, showModal: false, result: null, tasks: tasks.data, files: files.data, username: req.session.user.username, notificationsAllowed: req.session.user.notificationsAllowed });
        }
    }

}

module.exports = new NotificationsService();