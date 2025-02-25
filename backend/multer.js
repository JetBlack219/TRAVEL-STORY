import multer from "multer";
import path from "path";

// Storage configuration
export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/"); // Destination folder for storing uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Use extname to get the file extension
    },
});

// File filter to accept only images
export const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) { // Correct property is mimetype
        cb(null, true);
    } else {
        cb(new Error("Only images are allowed"), false); // Provide proper error message
    }
};

// Initialize multer instance
const upload = multer({ storage, fileFilter });

export default upload;