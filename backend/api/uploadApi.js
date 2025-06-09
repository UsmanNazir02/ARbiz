const { uploadCardImages } = require('../config/cloudinary');
const { uploadLogo, uploadBackground, cardImagesUpload } = require('../controllers/uploadController');

const router = require('express').Router();

class UploadAPI {
    constructor() {
        this.router = router;
        this.setupRoutes();
    }

    setupRoutes() {
        const router = this.router;

        router.post('/logo', uploadCardImages, uploadLogo);
        router.post('/background', uploadCardImages, uploadBackground);
        router.post('/images', uploadCardImages, cardImagesUpload);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/upload';
    }
}

module.exports = UploadAPI;