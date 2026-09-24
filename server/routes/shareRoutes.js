import express from "express";

import {
  createShare,
  joinShare,
  verifySharePassword,
} from "../controllers/shareController.js";

const router = express.Router();

// Create share
router.post(
  "/",
  createShare
);

// Join share
router.post(
  "/join",
  joinShare
);

// Verify password
router.post(
  "/verify-password",
  verifySharePassword
);

export default router;