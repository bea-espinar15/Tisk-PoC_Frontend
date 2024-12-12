"use strict"

// ----- Import modules -----
const axios = require('axios');
const constants = require("../config/constants");
const logger = require("../config/logger");
const Result = require("./result");
const { SUCCESS_RESPONSE, ERROR_RESPONSE } = require("./responseEnum");


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
            if (error.response.data.code in ERROR_RESPONSE)
                return new Result(false, error.response.status, ERROR_RESPONSE[error.response.data.code], error.response.data.content);
            else {
                logger.error(`[GENERAL] - API Services returned an unexpected error code: ${error.response.data.code}`);
                return new Result(false, 500, ERROR_RESPONSE.SERVER_ERROR, null);
            }
        else {
            logger.error("[GENERAL] - Error at sending request to API Services");
            return new Result(false, 500, ERROR_RESPONSE.SERVER_ERROR, null);
        }        
    }
}

async function handleGetCall(url, queryParams = {}) {
    try {
        const response = await axios.get(`${constants.CONFIG["API_SERVICES_URL"]}/${url}`, {
            params: queryParams, 
            headers: {
                'Content-Type': 'application/json'
            },
        });

        // Handle response
        return new Result(true, response.status, null, response.data.content);
    }
    catch (error) {
        // Handle error
        if (error.response) 
            if (error.response.data.code in ERROR_RESPONSE)
                return new Result(false, error.response.status, ERROR_RESPONSE[error.response.data.code], error.response.data.content);
            else {
                logger.error(`[GENERAL] - API Services returned an unexpected error code: ${error.response.data.code}`);
                return new Result(false, 500, ERROR_RESPONSE.SERVER_ERROR, null);
            }
        else {
            logger.error(`[GENERAL] - Error at sending request to API Services`);
            return new Result(false, 500, ERROR_RESPONSE.SERVER_ERROR, null);
        }        
    }
}

module.exports =  {
    handlePostCall,
    handleGetCall
};