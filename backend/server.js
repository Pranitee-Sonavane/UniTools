import syllabusRoutes from "./routes/syllabus.routes.js";

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const JSZip = require('jszip');
const mammoth = require('mammoth');

app.use("/api", syllabusRoutes);

const app = express();
app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

async function performDeepAudit(buffer) {
    const zip = await JSZip.loadAsync(buffer);
    const docXmlStr = await zip.file("word/document.xml").async("string");
    
    // 1. JUSTIFICATION: Search for 'both' (case-insensitive, handles quotes)
    const isJustified = /w:val=["']both["']/i.test(docXmlStr);

    // 2. FONT: Look for the first font name
    const fontMatch = docXmlStr.match(/w:ascii=["']([^"']+)["']/);
    const detectedFont = fontMatch ? fontMatch[1] : "Standard";

    // 3. SIZE: Look for font size (half-points)
    const sizeMatch = docXmlStr.match(/w:sz w:val=["'](\d+)["']/);
    const detectedSize = sizeMatch ? parseInt(sizeMatch[1]) / 2 : 12;

    // 4. SPACING & MARGINS
    const spacingMatch = docXmlStr.match(/w:line=["'](\d+)["']/);
    const lineSpacing = spacingMatch ? parseInt(spacingMatch[1]) / 240 : 1.0;
    const marginMatch = docXmlStr.match(/w:left=["'](\d+)["']/);
    const margins = marginMatch ? parseInt(marginMatch[1]) / 1440 : 1.0;

    // 5. KEYWORDS
    const { value: text } = await mammoth.extractRawText({ buffer });
    const hasIntro = /introduction|abstract|summary|purpose/i.test(text);
    const hasConcl = /conclusion|discussion|references/i.test(text);

    return { 
        font: detectedFont, 
        size: detectedSize, 
        spacing: lineSpacing, 
        margins, 
        justified: isJustified, 
        hasIntro, 
        hasConcl 
    };
}

app.post('/api/check', upload.single('file'), async (req, res) => {
    try {
        const stats = await performDeepAudit(req.file.buffer);
        
        // We return the EXACT list the frontend needs
        const checks = [
            { id: "font", label: `Font: ${stats.font}`, status: stats.font.toLowerCase().includes("times") ? "pass" : "fail" },
            { id: "size", label: `Size: ${stats.size}pt`, status: stats.size >= 11 && stats.size <= 16 ? "pass" : "fail" },
            { id: "spacing", label: `Spacing: ${stats.spacing.toFixed(1)}`, status: stats.spacing >= 1.4 && stats.spacing <= 1.6 ? "pass" : "fail" },
            { id: "keywords", label: "Intro & Conclusion", status: (stats.hasIntro && stats.hasConcl) ? "pass" : "fail" },
            { id: "margins", label: `Margins: ${stats.margins.toFixed(1)}"`, status: stats.margins >= 0.8 && stats.margins <= 1.2 ? "pass" : "warning" },
        ];

        res.json({ results: checks });
    } catch (e) {
        res.status(500).json({ error: "Audit Failed" });
    }
});

app.listen(5000);