const { generateResponse, asyncHandler } = require('../utils');

exports.DefaultHandler = asyncHandler(async (req, res, next) => {
    generateResponse(null, `${process.env.APP_NAME} API - Health check passed`, res);
});
