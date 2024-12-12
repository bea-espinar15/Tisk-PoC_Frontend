"use strict"

const SUCCESS_RESPONSE = Object.freeze({    
    TASK_CREATED: {
        title: "Task created successfully",
        message: "The task was created successfully. You can check it out in your task list!"
    }
});

const ERROR_RESPONSE = Object.freeze({
    NOT_FOUND: {
        title: "Oops! Page not found",
        message: "Unfortunately, the page you are trying to access does not exist"
    },
    SERVER_ERROR: {
        title: "Unknown error :(",
        message: "An unexpected error ocurred, try again in a few moments."
    },
    FIELD_REQUIRED: {
        title: "Invalid data",
        message: "You need to complete this field."
    },
    USERNAME_NOT_VALID: {
        title: "Invalid data",
        message: "Username must have between 5 and 20 characters and can only include lowercase letters, numbers and underscores."
    },
    EMAIL_NOT_VALID: {
        title: "Invalid data",
        message: "Please, enter a valid email."
    },
    PASSWORD_NOT_VALID: {
        title: "Invalid data",
        message: "Password must be 12 characters minimum and must contain at least one letter and one number."
    },
    EMAIL_ALREADY_EXISTS: {
        title: "User already exists",
        message: "This email is already registered in Tisk."
    }
});

module.exports = {
    SUCCESS_RESPONSE,
    ERROR_RESPONSE
};