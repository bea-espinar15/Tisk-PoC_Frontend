"use strict"

// * ----- Import modules ----- *
const { admin } = require("../config/firebaseConfig");
const logger = require("../config/logger");
const authService = require("../service/authService");


// * ----- Middlewares ----- *
// Check user authentication
const userLogged = async (req, res, next) => {
    let verified = false;
    if (req.session.user && req.session.user.accessToken) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(req.session.user.accessToken);
            verified = true;
        }
        catch (error) {
            if (error.code == "auth/id-token-expired")
                return await authService.logout(req, res, next);
            else if (error.code == "auth/invalid-id-token" || error.code == "auth/argument-error")
                logger.error("[AUTH] Access token is not valid");
            else
                logger.error("[AUTH] Error verifying token against Firebase");
        }
    }        

    if (verified) next();
    else res.status(401).redirect("/login");
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