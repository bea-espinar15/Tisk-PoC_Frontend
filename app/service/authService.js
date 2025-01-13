"use strict"

// * ----- Import modules ----- *
const axios = require('axios');
const {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    deleteUser,
    admin
} = require('../config/firebaseConfig');
const constants = require("../config/constants");
const logger = require("../config/logger");
const callHandler = require("../utils/callHandler");
const Result = require("../utils/result");


// * ----- Get auth object ----- *
const auth = getAuth();


class AuthService {

    // --- REGISTER ---
    // Creates a new user in Tisk, first registering them in Firebase and then calling API to create user in DB
    signUp = async(req, res, next) => {
        // Get data
        const username = req.body["username"];
        const email = req.body["email"];
        const password = req.body["password"];
        
        // Validate empty fields
        if (!username) {
            logger.info("[AUTH] Username is required for sign up");
            return res.status(400).render("sign-up", {locale: req.locale, result: new Result(false, 400, req.responses["FIELD_REQUIRED"], {field: "username"}), showModal: false});
        }
        if (!email) {
            logger.info("[AUTH] Email is required for sign up");            
            return res.status(400).render("sign-up", {locale: req.locale, result: new Result(false, 400, req.responses["FIELD_REQUIRED"], {field: "email"}), showModal: false});
        }
        if (!password) {
            logger.info("[AUTH] Password is required for sign up");            
            return res.status(400).render("sign-up", {locale: req.locale, result: new Result(false, 400, req.responses["FIELD_REQUIRED"], {field: "password"}), showModal: false});
        }

        // Validate format
        if (!constants.REGEX["USERNAME_REGEX"].test(username)) {
            logger.info("[AUTH] Username is not valid (sign up)");            
            return res.status(400).render("sign-up", {locale: req.locale, result: new Result(false, 400, req.responses["USERNAME_NOT_VALID"], {field: "username"}), showModal: false});
        }
        if (!constants.REGEX["EMAIL_REGEX"].test(email)) {
            logger.info("[AUTH] Email is not valid (sign up)");            
            return res.status(400).render("sign-up", {locale: req.locale, result: new Result(false, 400, req.responses["EMAIL_NOT_VALID"], {field: "email"}), showModal: false});
        }
        if (!constants.REGEX["PASSWORD_REGEX"].test(password)) {
            logger.info("[AUTH] Password is not valid (sign up)");
            return res.status(400).render("sign-up", {locale: req.locale, result: new Result(false, 400, req.responses["PASSWORD_NOT_VALID"], {field: "password"}), showModal: false});
        }

        // Register user in Firebase
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Login as an Admin
            const adminCredential = await signInWithEmailAndPassword(auth, constants.SECRETS["FIREBASE_ADMIN_EMAIL"], constants.SECRETS["FIREBASE_ADMIN_PASSWORD"]);
            // Create user in Tisk database
            const body = {
                username: username,
                email: email,
                firebaseUid: userCredential.user.uid
            }
            const result = await callHandler.handlePostCall(req.responses, "/users", adminCredential._tokenResponse.idToken, body);
            if (result.code != 200) {
                logger.error(`[AUTH] Error creating user in Tisk database: ${result}`);
                // Undo registration in Firebase
                await deleteUser(userCredential.user);
                return res.status(result.code).render("sign-up", {locale: req.locale, result: result, showModal: result.code != 400 || result.content.code != "EMAIL_ALREADY_EXISTS"});
            }
            else {
                // Automatically log the user in
                req.session.user = {
                    username: result.data.username,
                    email: result.data.email,
                    firebaseUid: result.data.firebaseUid,
                    notificationsAllowed: result.data.notificationsAllowed,
                    accessToken: userCredential.user.accessToken,
                    refreshToken: userCredential.user.refreshToken
                }
                req.session.save((err) => {
                    if (err)
                        throw new Error(`Error saving Express.js session: ${err}`);
                    else
                        return res.status(200).redirect(`/tasks/${req.locale}`);
                });
            }
        }
        catch (error) {
            if (error.code == "auth/email-already-in-use") {
                logger.info(`[AUTH] Email ${email} already exists in Firebase`);
                return res.status(400).render("sign-up", {locale: req.locale, result: new Result(false, 400, req.responses["EMAIL_ALREADY_EXISTS"], null), showModal: true});
            }
            else {
                logger.error(`[AUTH] Error creating user in Firebase: ${error}`);
                return res.status(500).render("sign-up", {locale: req.locale, result: new Result(false, 500, req.responses["SERVER_ERROR"], null), showModal: true});
            }
        }
    }


    // -- LOGIN --
    // Logs the user into Firebase retrieving an authentication token and creates an Express session for them
    login = async(req, res, next) => {
        // Get data
        const email = req.body["email"];
        const password = req.body["password"];
        
        // Validate empty fields
        if (!email) {
            logger.info("[AUTH] Email is required for login");
            return res.status(400).render("login", {locale: req.locale, result: new Result(false, 400, req.responses["FIELD_REQUIRED"], {field: "email"}), showModal: false});
        }
        if (!password) {
            logger.info("[AUTH] Password is required for register");
            return res.status(400).render("login", {locale: req.locale, result: new Result(false, 400, req.responses["FIELD_REQUIRED"], {field: "password"}), showModal: false});
        }

        // Login against Firebase
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Retrieve user info from Tisk database
            const result = await callHandler.handleGetCall(req.responses, "/users/me", userCredential._tokenResponse.idToken);
            if (result.code != 200) {
                logger.error(`[AUTH] Error retrieving information of user ${email} from Tisk database: ${result}`);
                return res.status(result.code).render("login", {locale: req.locale, result: result, showModal: true});
            }
            else {
                req.session.user = {
                    username: result.data.username,
                    email: result.data.email,
                    firebaseUid: result.data.firebaseUid,
                    notificationsAllowed: result.data.notificationsAllowed,
                    accessToken: userCredential._tokenResponse.idToken,
                    refreshToken: userCredential._tokenResponse.refreshToken
                }
                req.session.save((err) => {
                    if (err)
                        throw new Error(`Error saving Express.js session: ${err}`);
                    else
                        return res.status(200).redirect(`/tasks/${req.locale}`);
                });
            }
        }
        catch (error) {
            if (error.code == "auth/invalid-credential") {
                logger.info(`[AUTH] Email ${email} doesn't exist or wrong password`);
                return res.status(400).render("login", {locale: req.locale, result: new Result(false, 400, req.responses["WRONG_CREDENTIALS"], null), showModal: true});
            }
            else {
                logger.error(`[AUTH] Error signing the user into Firebase: ${error}`);
                return res.status(500).render("login", {locale: req.locale, result: new Result(false, 500, req.responses["SERVER_ERROR"], null), showModal: true});
            }
        }
    }


    // -- VERIFY TOKEN --
    verifyToken = async(req, res, next) => {
        const decodedToken = await admin.auth().verifyIdToken(req.session.user.accessToken);
        return true;
    }


    // -- REFRESH TOKEN --
    refreshToken = async(req) => {
        try {
            const response = await axios.post(`${constants.CONFIG["FIREBASE_API_TOKEN_URL"]}${constants.SECRETS["FIREBASE_API_KEY"]}`, {
                grant_type: "refresh_token",
                refresh_token: req.session.user.refreshToken
            });

            // Update session
            req.session.user.accessToken = response.data.id_token;
            req.session.user.refreshToken = response.data.refresh_token;
            
            req.session.save((err) => {
                if (err)
                    throw new Error(`Error saving Express.js session: ${err}`);
                else
                    return true;
            });
        } 
        catch (error) {
            logger.error(`[AUTH] Error refreshing token against API: ${error}`);
            return false;
        }
    }


    // -- LOGOUT --
    // Logs the user out of Firebase and then deletes Express session
    logout = async(req, res, next) => {
        try {
            await signOut(auth);
            if (req.session.user) {
                req.session.destroy((err) => {
                    if (err)
                        throw new Error(`Error destroying Express.js session: ${err}`);
                    else
                        return res.status(200).redirect(`/login/${req.locale}`);
                });                
            }
            else
                return res.status(401).redirect(`/login/${req.locale}`);
        }
        catch (error) {
            logger.error(`[AUTH] Error signing the user out: ${error}`);
            return res.status(500).json();
        }
    }
}

module.exports = new AuthService();