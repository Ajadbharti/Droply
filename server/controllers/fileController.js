import path from "path";

// ==========================================
// Upload File
// ==========================================

export const uploadFile = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const file = req.file;

    // Create file URL
    const fileUrl = `${req.protocol}://${req.get(
      "host"
    )}/uploads/${file.filename}`;

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully",

      file: {
        name: file.filename,
        originalName: file.originalname,
        url: fileUrl,
        size: file.size,
        mimeType: file.mimetype,
        extension: path.extname(
          file.originalname
        ),
      },
    });
  } catch (error) {
    console.error(
      "Upload File Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to upload file",
    });
  }
};