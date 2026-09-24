import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import {
  uploadFile,
} from "../controllers/fileController.js";

const router = express.Router();

// ==========================================
// Upload Single File
// ==========================================

router.post(
  "/upload",
  upload.single("file"),
  uploadFile
);

export default router;