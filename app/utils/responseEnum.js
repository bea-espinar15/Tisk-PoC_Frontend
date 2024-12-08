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
    TITLE_REQUIRED: {
        title: "Invalid data",
        message: "You need to complete this field."
    }
});

module.exports = {
    SUCCESS_RESPONSE: SUCCESS_RESPONSE,
    ERROR_RESPONSE: ERROR_RESPONSE
};