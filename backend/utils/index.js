const { sign } = require("jsonwebtoken");
const multer = require('multer');
const crypto = require('crypto');
const QRCode = require('qrcode');

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

exports.upload = (folderName) => {
    return multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                const uploadPath = `uploads/${folderName}/`;
                fs.mkdirSync(uploadPath, { recursive: true })
                cb(null, uploadPath);
            },

            // By default, multer removes file extensions so let's add them back
            filename: generateFilename
        }),
        limits: { fileSize: 10 * 1024 * 1024 },  // max 10MB //
        fileFilter: filterImage
    })
}

exports.createPublicId = () => crypto.randomBytes(4).toString('hex');   // 8-char slug

exports.createQr = async (viewerUrl) => QRCode.toDataURL(viewerUrl, { margin: 1 });   