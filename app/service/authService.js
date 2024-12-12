"use strict"

// ----- Import modules -----
const {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    deleteUser
} = require('../config/firebaseConfig');
const { ERROR_RESPONSE } = require('../utils/responseEnum');
const constants = require("../config/constants");
const callHandler = require("../utils/callHandler");
const Result = require("../utils/result");


// ----- Get auth object -----
const auth = getAuth();


class AuthService {

    // --- REGISTER ---
    // Creates a new user in Tisk, first registering them in Firebase and then calling API to create user in DB
    async signUp(req, res, next) {
        // Get data
        const username = req.body["username"];
        const email = req.body["email"];
        const password = req.body["password"];
        
        // Validate empty fields
        if (!username)
            return res.status(400).render("sign-up", {result: new Result(false, 400, ERROR_RESPONSE["FIELD_REQUIRED"], {field: "username"}), showModal: false});
        if (!email)
            return res.status(400).render("sign-up", {result: new Result(false, 400, ERROR_RESPONSE["FIELD_REQUIRED"], {field: "email"}), showModal: false});
        if (!password)
            return res.status(400).render("sign-up", {result: new Result(false, 400, ERROR_RESPONSE["FIELD_REQUIRED"], {field: "password"}), showModal: false});

        // Validate format
        if (!constants.REGEX["USERNAME_REGEX"].test(username))
            return res.status(400).render("sign-up", {result: new Result(false, 400, ERROR_RESPONSE["USERNAME_NOT_VALID"], {field: "username"}), showModal: false});
        if (!constants.REGEX["EMAIL_REGEX"].test(email))
            return res.status(400).render("sign-up", {result: new Result(false, 400, ERROR_RESPONSE["EMAIL_NOT_VALID"], {field: "email"}), showModal: false});
        if (!constants.REGEX["PASSWORD_REGEX"].test(password))
            return res.status(400).render("sign-up", {result: new Result(false, 400, ERROR_RESPONSE["PASSWORD_NOT_VALID"], {field: "password"}), showModal: false});

        // Register user in Firebase
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Create user in Tisk database
            const body = {
                username: username,
                email: email,
                firebaseUid: userCredential.user.uid
            }
            const result = await callHandler.handlePostCall("/users", body);
            if (result.code != 200) {
                // Undo registration in Firebase
                await deleteUser(userCredential.user);
                return res.status(result.code).render("sign-up", {result: result, showModal: result.code != 400 || result.content.code != "EMAIL_ALREADY_EXISTS"});
            }
            else {
                // Automatically log the user in
                req.session.user = {
                    username: username,
                    email: email,
                    firebaseUid: userCredential.user.uid,
                    accessToken: userCredential.user.accessToken
                }
                return res.status(200).redirect("/tasks");
            }
        }
        catch (error) {
            if (error.code === "auth/email-already-in-use")
                return res.status(400).render("sign-up", {result: new Result(false, 400, ERROR_RESPONSE["EMAIL_ALREADY_EXISTS"], null), showModal: true});
            else
            return res.status(500).render("sign-up", {result: new Result(false, 500, ERROR_RESPONSE["SERVER_ERROR"], null), showModal: true});
        }
    }

}

module.exports = new AuthService();