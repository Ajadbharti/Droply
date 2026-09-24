import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import shareRoutes from "./routes/shareRoutes.js";
  import fileRoutes from "./routes/fileRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// ================= Database =================

connectDB();

// ================= Middleware =================

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(
  "/api/files",
  fileRoutes
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ================= Routes =================

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

app.use(
  "/api/shares",
  shareRoutes
);

// ================= Server =================

app.listen(PORT, () => {
  console.log(
    `🚀 Droply server running on http://localhost:${PORT}`
  );
});