import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { extractTextFromImage } from "../services/ocr.service.js";
import { parseSyllabus } from "../services/syllabusParser.service.js";

export const extractSyllabus = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    let text = "";

    if (ext === ".pdf") {
      const buffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse(buffer);

      // ✅ IMPORTANT: do NOT OCR PDF directly
      if (pdfData.text && pdfData.text.length > 200) {
        text = pdfData.text;
      } else {
        return res.status(400).json({
          error: "Scanned PDF detected. Please upload a clear image-based syllabus."
        });
      }
    } else {
      // Image file → OCR
      text = await extractTextFromImage(req.file.path);
    }

    const syllabus = parseSyllabus(text);

    fs.unlinkSync(req.file.path);

    if (!syllabus || syllabus.length === 0) {
      return res.status(400).json({
        error: "No syllabus units detected. Please upload a valid syllabus PDF."
      });
    }

    res.json({ syllabus });
  } catch (err) {
    console.error("❌ Backend error:", err);
    res.status(500).json({ error: "Extraction failed at server" });
  }
};
