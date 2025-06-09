// config/multer.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createUploadDirs = () => {
    const dirs = ['uploads', 'uploads/logos', 'uploads/backgrounds'];
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

// Initialize directories
createUploadDirs();

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';

        // Determine upload path based on field name
        if (file.fieldname === 'logo') {
            uploadPath += 'logos/';
        } else if (file.fieldname === 'background') {
            uploadPath += 'backgrounds/';
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        const fieldPrefix = file.fieldname === 'logo' ? 'logo' : 'bg';

        cb(null, `${fieldPrefix}-${uniqueSuffix}${fileExtension}`);
    }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Multer configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
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
                message: 'File too large. Maximum size is 5MB.'
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

// Utility function to delete old files
const deleteFile = (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting file:', err);
        });
    }
};

// Utility function to get file URL
const getFileUrl = (req, filename, type) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return `${baseUrl}/uploads/${type}s/${filename}`;
};

module.exports = {
    uploadCardImages,
    handleMulterError,
    deleteFile,
    getFileUrl
};