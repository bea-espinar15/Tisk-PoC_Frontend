"use strict"

// ----- Import modules -----
const axios = require('axios');
const constants = require("../config/constants");
const logger = require("../config/logger");
const Result = require("./result");
const SUCCESS_RESPONSE = require("./responseEnum").SUCCESS_RESPONSE;
const ERROR_RESPONSE = require("./responseEnum").ERROR_RESPONSE;


// ----- Handle call -----
async function handlePostCall(url, body) {
    try {
        const response = await axios.post(`${constants.CONFIG["API_SERVICES_URL"]}/${url}`, body, {
            headers: {
                'Content-Type': 'application/json'
            },
        });

        // Handle response
        return new Result(true, response.status, SUCCESS_RESPONSE[response.data.code], response.data.content);
    }
    catch (error) {
        // Handle error
        if (error.response)
            return new Result(false, error.response.status, ERROR_RESPONSE[error.response.data.code], null);
        else {
            logger.error(`[GENERAL] - Error at sending request to API Services`);
            return new Result(false, 500, ERROR_RESPONSE.SERVER_ERROR, null);
        }        
    }
}

module.exports =  {
    handlePostCall: handlePostCall
};