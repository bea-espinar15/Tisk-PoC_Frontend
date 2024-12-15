"use strict"

class Result {

    /**
     *  @param {boolean} success Whether the operation was successful
     *  @param {int} code The code of the response
     *  @param response A responseEnum containing the title and message of the response
     *  @param data Additional data, such as the field which caused an error or the result of a GET request
     *  
     *  @example
     *  new Result(false, 400, ERROR_RESPONSE["FIELD_REQUIRED"], {field: "email"});
    */
    constructor(success, code, response, data) {
        this.success = success;
        this.code = code;
        this.title = response != null ? response.title : null;
        this.message = response != null ? response.message : null;
        this.data = data;
    }
    
}

module.exports = Result;