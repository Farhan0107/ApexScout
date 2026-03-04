/**
 * Standarize API response
 * @param {Object} res 
 * @param {Number} statusCode 
 * @param {Object} data 
 * @param {String} message 
 */
const sendResponse = (res, statusCode, data, message = null) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

module.exports = sendResponse;
