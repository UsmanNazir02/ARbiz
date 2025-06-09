const { handleMulterError } = require('../config/cloudinary');
const { generateResponse } = require('../utils');

exports.uploadLogo = (req, res) => {
    try {
        if (!req.files || !req.files.logo) {
            return res.status(400).json({
                success: false,
                message: 'No logo file uploaded'
            });
        }

        const logoFile = req.files.logo[0];
        generateResponse({ logo: logoFile.path }, 'Logo uploaded successfully', res);
    } catch (error) {
        console.error('Logo upload error:', error);
    }
};

exports.uploadBackground = (req, res) => {
    try {
        if (!req.files || !req.files.background) {
            return res.status(400).json({
                success: false,
                message: 'No background file uploaded'
            });
        }

        const backgroundFile = req.files.background[0];

        generateResponse({ background: backgroundFile.path }, 'Background uploaded successfully', res);
    } catch (error) {
        console.error('Background upload error:', error);
    }
};

exports.cardImagesUpload = (req, res) => {
    try {
        const result = {};

        if (req.files) {
            if (req.files.logo) {
                result.logo = req.files.logo[0].path;
            }
            if (req.files.background) {
                result.background = req.files.background[0].path;
            }
        }

        generateResponse(result, 'Images uploaded successfully', res);
    } catch (error) {
        console.error('Card images upload error:', error);
    }
};
