import multer from "multer";
import path from "path";
import fs from "fs";

// ==========================================
// Upload Directory
// ==========================================

const uploadDirectory = "uploads";

// Create uploads folder automatically
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// ==========================================
// Storage
// ==========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname
    );

    const uniqueName =
      `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${extension}`;

    cb(null, uniqueName);
  },
});

// ==========================================
// File Filter
// ==========================================

const fileFilter = (req, file, cb) => {
  // Allow all normal file types for now
  cb(null, true);
};

// ==========================================
// Multer Upload
// ==========================================

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

export default upload;