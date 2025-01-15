"use strict"

// * ----- Import modules ----- *
const callHandler = require("../utils/callHandler");


class TasksService {

    // --- GET ALL TASKS ---
    // Retrieves all tasks from a user
    getAllTasks = async (req, res, next) => {
        // Call API
        const result = await callHandler.handleGetCall(req.responses, "/tasks", req.session.user.accessToken);
        // Get files for render
        const files = await callHandler.handleGetCall(req.responses, "/users/files", req.session.user.accessToken);
        // Handle response
        res.status(Math.max(result.code, files.code));
        if (result.code == 404 || files.code == 404 || result.code == 500 || files.code == 500) {
            logger.error(`[GENERAL] Error retrieving tasks or files: ${result.code} ${files.code}`);
            res.render("error-page", { locale: req.locale, result: result, username: req.session.user.username });
        }
        else {
            res.render("index", { locale: req.locale, showModal: false, result: null, tasks: result.data, files: files.data, username: req.session.user.username, notificationsAllowed: req.session.user.notificationsAllowed });
        }
    }

    // --- CREATE TASK ---
    // Creates a new task
    createTask = async (req, res, next) => {
        // Build body for request
        const body = {
            title: req.body.title
        }
        // Call API
        const result = await callHandler.handlePostCall(req.responses, "/tasks", req.session.user.accessToken, body);
        // Get tasks and files for render
        const tasks = await callHandler.handleGetCall(req.responses, "/tasks", req.session.user.accessToken);
        const files = await callHandler.handleGetCall(req.responses, "/users/files", req.session.user.accessToken);
        // Handle response
        res.status(Math.max(result.code, tasks.code, files.code));
        if (result.code == 404 || tasks.code == 404 || files.code == 404 || result.code == 500 || tasks.code == 500 || files.code == 500) {
            logger.error(`[GENERAL] Error creating task or retrieving tasks or files: ${result.code} ${tasks.code} ${files.code}`);
            res.render("error-page", { locale: req.locale, result: result, username: req.session.user.username });
        }
        else
            res.render("index", { locale: req.locale, showModal: result.code != 400, result: result, tasks: tasks.data, files: files.data, username: req.session.user.username, notificationsAllowed: req.session.user.notificationsAllowed });
    }
    
}

module.exports = new TasksService();