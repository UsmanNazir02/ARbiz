const { sign } = require("jsonwebtoken");

// Response generation utility
exports.generateResponse = (data, message, res, code = 200) => {
    return res.status(code).json({
        statusCode: code,
        message,
        data,
    });
}

// Body parsing utility
exports.parseBody = (body) => typeof body === 'object' ? body : JSON.parse(body);

// async handler
exports.asyncHandler = (requestHandler) => {
    return (req, res, next) => Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
}

// generate token
exports.generateToken = (user) => {
    const { JWT_EXPIRATION, JWT_SECRET } = process.env;

    const token = sign({
        id: user._id,
        email: user.email,
        role: user.role,
    }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

    return token;
};

// generate refresh token
exports.generateRefreshToken = (user) => {
    const refreshToken = sign({ id: user._id }, process.env.REFRESH_JWT_SECRET, {
        expiresIn: process.env.REFRESH_JWT_EXPIRATION, // Set the expiration time for the refresh token
    });

    return refreshToken;
};