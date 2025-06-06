"use strict"

// * ----- Import modules ----- *
const firebase = require("firebase/app");
const {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    deleteUser,
} = require("firebase/auth");
const admin = require("firebase-admin");
const constants = require("./constants");
const serviceAccount = constants.FIREBASE_SERVICE;

// * ----- Configure Firebase and init app ----- *
const firebaseConfig = {
    apiKey: constants.SECRETS["FIREBASE_API_KEY"],
    authDomain: constants.SECRETS["FIREBASE_AUTH_DOMAIN"],
    projectId: constants.SECRETS["FIREBASE_PROJECT_ID"],
    storageBucket: constants.SECRETS["FIREBASE_STORAGE_BUCKET"],
    messagingSenderId: constants.SECRETS["FIREBASE_MESSAGING_SENDER_ID"],
    appId: constants.SECRETS["FIREBASE_APP_ID"]
};

firebase.initializeApp(firebaseConfig);

// * ----- Configure admin Service Account ----- *
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    deleteUser,
    admin
};
