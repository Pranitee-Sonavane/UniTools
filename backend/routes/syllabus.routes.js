import express from "express";
import multer from "multer";
import { extractSyllabus } from "../controllers/syllabus.controller.js";

const router = express.Router();

// ✅ DISK STORAGE (VERY IMPORTANT)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2 MB
  }
});

// ✅ HANDLE FILE SIZE ERROR PROPERLY
router.post(
  "/extract",
  (req, res, next) => {
    upload.single("file")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(413).json({
            error: "File too large. Upload syllabus of only one subject (max 2 MB)."
          });
        }
      }
      if (err) return res.status(400).json({ error: err.message });
      next();
    });
  },
  extractSyllabus
);

export default router;
