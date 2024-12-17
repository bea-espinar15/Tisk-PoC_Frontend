"use strict"

// * ----- Import modules ----- *
const axios = require('axios');
const constants = require("../config/constants");
const logger = require("../config/logger");
const Result = require("./result");


// * ----- Handle call ----- *
// -- GET --
async function handleGetCall(responses, url, accessToken, queryParams = {}) {
    try {
        // Make API resquest
        const response = await axios.get(`${constants.CONFIG["API_SERVICES_URL"]}/${url}`, {
            params: queryParams, 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
        });

        // Handle response
        return new Result(true, response.status, null, response.data.content);
    }
    catch (error) {
        // Handle error
        if (error.response) 
            if (error.response.data.code in responses)
                return new Result(false, error.response.status, responses[error.response.data.code], error.response.data.content);
            else {
                logger.error(`[GENERAL] - API Services returned an unexpected error code: ${error.response.data.code}`);
                return new Result(false, 500, responses.SERVER_ERROR, null);
            }
        else {
            logger.error(`[GENERAL] - Error at sending request to API Services`);
            return new Result(false, 500, responses.SERVER_ERROR, null);
        }        
    }
}

// -- POST --
async function handlePostCall(responses, url, accessToken, body) {
    try {
        // Make API request
        const response = await axios.post(`${constants.CONFIG["API_SERVICES_URL"]}/${url}`, body, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
        });

        // Handle response
        return new Result(true, response.status, responses[response.data.code], response.data.content);
    }
    catch (error) {
        // Handle error
        if (error.response)
            if (error.response.data.code in responses)
                return new Result(false, error.response.status, responses[error.response.data.code], error.response.data.content);
            else {
                logger.error(`[GENERAL] - API Services returned an unexpected error code: ${error.response.data.code}`);
                return new Result(false, 500, responses.SERVER_ERROR, null);
            }
        else {
            logger.error("[GENERAL] - Error at sending request to API Services");
            return new Result(false, 500, responses.SERVER_ERROR, null);
        }        
    }
}

module.exports =  {
    handleGetCall,
    handlePostCall
};