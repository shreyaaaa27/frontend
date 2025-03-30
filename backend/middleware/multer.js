import multer from 'multer';

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        // Specify the folder where files will be saved
        callback(null, 'uploads/');
    },
    filename: function (req, file, callback) {
        // Use the original file name for saving
        callback(null, file.originalname);
    }
});

// Initialize Multer with the storage configuration
const upload = multer({ storage });

export default upload;
export const uploadMiddleware = (req, res, next) => {
    upload.single('file')(req, res, function (err) {
        if (err) {
            return res.status(500).json({ error: 'File upload failed' });
        }
        next();
    });
};