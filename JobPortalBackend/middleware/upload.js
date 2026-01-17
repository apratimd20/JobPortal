import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads/resumes'));
    },
    filename: function (req, file, cb) {
        // Create unique filename: userId_timestamp_originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext);
        cb(null, `${req.user._id}_${uniqueSuffix}_${nameWithoutExt}${ext}`);
    }
});

// File filter - only allow certain file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const ext = path.extname(file.originalname).toLowerCase().substring(1);
    const mimetype = file.mimetype;

    if (allowedTypes.test(ext) && (mimetype === 'application/pdf' ||
        mimetype === 'application/msword' ||
        mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF, DOC, and DOCX files are allowed!'), false);
    }
};

// Create multer upload instance
export const uploadResume = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    }
});

// Configure storage for avatars
const avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads/avatars'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${req.user._id}_${uniqueSuffix}${ext}`);
    }
});

// File filter for avatars - only allow images
const avatarFileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const ext = path.extname(file.originalname).toLowerCase().substring(1);
    const mimetype = file.mimetype;

    if (allowedTypes.test(ext) && mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed!'), false);
    }
};

// Create multer upload instance for avatars
export const uploadAvatar = multer({
    storage: avatarStorage,
    fileFilter: avatarFileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB max file size for avatars
    }
});
