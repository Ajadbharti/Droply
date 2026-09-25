import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import connectDB from "./config/db.js";
import shareRoutes from "./routes/shareRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const uploadsPath = path.join(
  process.cwd(),
  "uploads"
);

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ==========================================
// SERVE UPLOADED FILES
// ==========================================

app.use(
  "/uploads",
  express.static(uploadsPath)
);

// ==========================================
// TEST ROUTES
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Droply API is running 🚀",
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend is working correctly",
  });
});

// ==========================================
// API ROUTES
// ==========================================

app.use(
  "/api/shares",
  shareRoutes
);

app.use(
  "/api/files",
  fileRoutes
);

// ==========================================
// SERVER
// ==========================================

app.listen(PORT, () => {
  console.log(
    `🚀 Droply server running on http://localhost:${PORT}`
  );

  console.log(
    `📁 Uploads folder: ${uploadsPath}`
  );
});