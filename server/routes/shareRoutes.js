import express from "express";

import {
  createShare,
  joinShare,
} from "../controllers/shareController.js";

const router = express.Router();

// Create Share
// POST /api/shares
router.post("/", createShare);

// Join Share
// POST /api/shares/join
router.post("/join", joinShare);

export default router;