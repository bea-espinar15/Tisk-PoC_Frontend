"use strict"

class Result {
    constructor(success, code, response, data) {
        this.success = success;
        this.code = code;
        this.title = response.title;
        this.message = response.message;
        this.data = data;
    }
}

module.exports = Result;