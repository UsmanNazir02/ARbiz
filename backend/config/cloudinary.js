const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'business-cards', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { width: 1000, height: 1000, crop: 'limit' }, // Resize large images
            { quality: 'auto' } // Auto quality optimization
        ],
        public_id: (req, file) => {
            // Generate unique filename
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const fieldPrefix = file.fieldname === 'logo' ? 'logo' : 'bg';
            return `${fieldPrefix}-${uniqueSuffix}`;
        },
    },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Multer configuration with Cloudinary storage
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit (Cloudinary free tier supports up to 10MB)
        files: 2 // Max 2 files (logo + background)
    }
});

// Middleware for handling both logo and background uploads
const uploadCardImages = upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'background', maxCount: 1 }
]);

// Error handling middleware
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 10MB.'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Maximum 2 files allowed.'
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Unexpected file field.'
            });
        }
    }

    if (error.message === 'Only image files are allowed!') {
        return res.status(400).json({
            success: false,
            message: 'Only image files are allowed!'
        });
    }

    next(error);
};

// Utility function to delete images from Cloudinary
const deleteCloudinaryImage = async (imageUrl) => {
    try {
        if (!imageUrl) return;

        // Extract public_id from Cloudinary URL
        const publicId = imageUrl.split('/').pop().split('.')[0];
        const fullPublicId = `business-cards/${publicId}`;

        await cloudinary.uploader.destroy(fullPublicId);
        console.log('Image deleted from Cloudinary:', fullPublicId);
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
    }
};

module.exports = {
    uploadCardImages,
    handleMulterError,
    deleteCloudinaryImage,
    cloudinary
};