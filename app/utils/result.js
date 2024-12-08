"use strict"

class Result {
    constructor(success, code, response, data) {
        this.success = success;
        this.code = code;
        this.title = response != null ? response.title : null;
        this.message = response != null ? response.message : null;
        this.data = data;
    }
}

module.exports = Result;