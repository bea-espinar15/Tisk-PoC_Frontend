"use strict"

// * ----- Import modules ----- *
const logger = require("../config/logger");
const authService = require("../service/authService");


// * ----- Middlewares ----- *
// Check user authentication
const userLogged = async (req, res, next) => {
    let verified = false;
    if (req.session.user && req.session.user.accessToken) {
        try {
            verified = await authService.verifyToken(req, res, next);
        }
        catch (error) {
            if (error.code == "auth/id-token-expired")
                verified = await authService.refreshToken(req, res, next);
            else if (error.code == "auth/invalid-id-token" || error.code == "auth/argument-error")
                logger.error("[AUTH] Access token is not valid");
            else
                logger.error(`[AUTH] Error verifying token against Firebase: ${error.code}`);
        }
    }        

    if (verified) next();
    else return await authService.logout(req, res, next);
};

// Check if user is already logged
function userAlreadyLogged(req, res, next) {
    if (req.session.user)
        res.redirect("/tasks");
    else
        next();
};


module.exports = {
    userLogged,
    userAlreadyLogged
}