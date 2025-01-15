"use strict"

// * ----- Import modules ----- *
const FormData = require("form-data");
const logger = require("../config/logger");
const callHandler = require("../utils/callHandler");
const Result = require("../utils/result");


class FilesService {

    // --- DOWNLOAD FILE ---
    // Returns a file of the user
    downloadFile = async (req, res, next) => {
        // Check if filename is not empty
        const filename = req.query.filename;
        if (!filename) {
            logger.warning("[GENERAL] An empty filename was sent to GET /files?filename");
            res.render("error-page", { locale: req.locale, result: new Result(false, 500, req.responses["SERVER_ERROR"], null), username: req.session.user.username });
        }
        // Call API
        const result = await callHandler.handleGetFileCall(req.responses, `/users/files/${filename}`, req.session.user.accessToken, filename);
        if (result.code != 200) {
            logger.error(`[GENERAL] Error downloading file ${filename}`);
            // Get tasks and files for render
            const tasks = await callHandler.handleGetCall(req.responses, "/tasks", req.session.user.accessToken);
            const files = await callHandler.handleGetCall(req.responses, "/users/files", req.session.user.accessToken);
            res.status(Math.max(400, tasks.code, files.code));
            if (tasks.code == 404 || files.code == 404 || tasks.code == 500 || files.code == 500) {
                logger.error(`[GENERAL] Error retrieving tasks or files: ${tasks.code} ${files.code}`);
                res.render("error-page", { locale: req.locale, result: tasks.code == 404 || tasks.code == 500 ? tasks : files, username: req.session.user.username });
            }
            else
                res.render("index", { locale: req.locale, showModal: true, result: result, tasks: tasks.data, files: files.data, username: req.session.user.username, notificationsAllowed: req.session.user.notificationsAllowed });
        }
        else {
            const match = filename.match(/^(.+)_([0-9]+)\.([^.]+)$/);
            const rawFilename = match[1];
            const extension = match[3];
                            
            res.setHeader('Content-Disposition', `attachment; filename=${rawFilename}.${extension}`);
            res.setHeader('Content-Type', result.data.headers['content-type']);
            result.data.data.pipe(res);
        }
    }

    // --- UPLOAD FILE ---
    // Uploads a new file
    uploadFile = async (req, res, next) => {
        // Build form data for request
        const uploadedFile = req.file;
        if (!uploadedFile) {
            // Get tasks and files for render
            const tasks = await callHandler.handleGetCall(req.responses, "/tasks", req.session.user.accessToken);
            const files = await callHandler.handleGetCall(req.responses, "/users/files", req.session.user.accessToken);
            res.status(Math.max(400, tasks.code, files.code));
            if (tasks.code == 404 || files.code == 404 || tasks.code == 500 || files.code == 500) {
                logger.error(`[GENERAL] Error retrieving tasks or files: ${tasks.code} ${files.code}`);
                res.render("error-page", { locale: req.locale, result: tasks.code == 404 || tasks.code == 500 ? tasks : files, username: req.session.user.username });
            }
            else
                res.render("index", { locale: req.locale, showModal: true, result: new Result(false, 400, req.responses["FIELD_REQUIRED"], { field: "uploadedFile" }), tasks: tasks.data, files: files.data, username: req.session.user.username, notificationsAllowed: req.session.user.notificationsAllowed });
        }
        else {
            const formData = new FormData();
            formData.append("uploadedFile", uploadedFile.buffer, uploadedFile.originalname);
            // Call API
            const result = await callHandler.handlePostCall(req.responses, "/users/files", req.session.user.accessToken, formData, true);
            // Get tasks and files for render
            const tasks = await callHandler.handleGetCall(req.responses, "/tasks", req.session.user.accessToken);
            const files = await callHandler.handleGetCall(req.responses, "/users/files", req.session.user.accessToken);
            // Handle response
            res.status(Math.max(result.code, tasks.code, files.code));
            if (result.code == 404 || tasks.code == 404 || files.code == 404 || result.code == 500 || tasks.code == 500 || files.code == 500) {
                logger.error(`[GENERAL] Error uploading file or retrieving tasks or files: ${result.code} ${tasks.code} ${files.code}`);
                res.render("error-page", { locale: req.locale, result: result, username: req.session.user.username });
            }
            else
                res.render("index", { locale: req.locale, showModal: true, result: result, tasks: tasks.data, files: files.data, username: req.session.user.username, notificationsAllowed: req.session.user.notificationsAllowed });
        }
    }
    
}

module.exports = new FilesService();