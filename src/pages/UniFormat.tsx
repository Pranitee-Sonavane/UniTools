import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { UploadBox } from "@/components/UploadBox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileText, Loader2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Footer,
  PageNumber,
} from "docx";
import { saveAs } from "file-saver";
import mammoth from "mammoth";

export default function UniFormat() {
  const defaultFont = "Times New Roman";
  const defaultFontSize = "24"; // Word units (12pt = 24)
  const defaultLineSpacing = "360"; // 1.5 spacing
  const defaultJustify = true;
  const defaultPageNumbers = true;

  const [file, setFile] = useState<File | null>(null);
  const [uploadKey, setUploadKey] = useState<number>(Date.now()); // reset UploadBox
  const [mode, setMode] = useState<"standard" | "custom">("standard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Custom options
  const [fontFamily, setFontFamily] = useState(defaultFont);
  const [customFont, setCustomFont] = useState(""); // for manual input
  const [fontSize, setFontSize] = useState(defaultFontSize);
  const [lineSpacing, setLineSpacing] = useState(defaultLineSpacing);
  const [justify, setJustify] = useState(defaultJustify);
  const [pageNumbers, setPageNumbers] = useState(defaultPageNumbers);

  const [previewContent, setPreviewContent] = useState<string>("");
  const [formattedDoc, setFormattedDoc] = useState<Document | null>(null);

  const { toast } = useToast();

  const commonFonts = [
    "Times New Roman",
    "Arial",
    "Calibri",
    "Georgia",
    "Verdana",
    "Tahoma",
    "Courier New",
    "Other",
  ];

  // Format file
  const handleFormat = async () => {
    if (!file || validationError) return;

    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const { value: text } = await mammoth.extractRawText({ arrayBuffer });

      const lines = text.split("\n").filter((l) => l.trim() !== "");

      const children: Paragraph[] = [];

      lines.forEach((line) => {
        const trimmedLine = line.trim();

        // Determine font to use
        let appliedFont = fontFamily === "Other" && customFont ? customFont : fontFamily;

        // Detect heading (all caps OR starts with 'Heading')
        const isHeading =
          trimmedLine === trimmedLine.toUpperCase() || trimmedLine.startsWith("Heading");

        // Insert empty line before heading or new paragraph
        if (children.length > 0) {
          children.push(new Paragraph(""));
        }

        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: trimmedLine,
                font: appliedFont,
                size: parseInt(fontSize),
                bold: isHeading,
              }),
            ],
            spacing: { line: parseInt(lineSpacing) },
            alignment: justify ? AlignmentType.JUSTIFIED : AlignmentType.LEFT,
          })
        );
      });

      const sections: any = [
        {
          properties: {},
          children,
        },
      ];

      // Add page numbers if enabled
      if ((mode === "standard" && defaultPageNumbers) || (mode === "custom" && pageNumbers)) {
        sections[0].footers = {
          default: new Footer({
            children: [
              new Paragraph({
                children: [new TextRun({ children: [PageNumber.CURRENT] })],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        };
      }

      const doc = new Document({ sections });
      setFormattedDoc(doc);

      // Preview (minimal)
      const previewLines = lines.join("\n");
      setPreviewContent(previewLines);

      setIsComplete(true);
      toast({
        title: "Formatting Complete",
        description: "Preview available. Download to save formatted file.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to process the Word document.",
      });
    }

    setIsProcessing(false);
  };

  const downloadFormattedFile = async () => {
    if (!formattedDoc || !file) return;
    const blob = await Packer.toBlob(formattedDoc);
    saveAs(blob, `formatted_${file.name}`);
  };

  const resetForm = () => {
    setFile(null);
    setIsComplete(false);
    setIsProcessing(false);
    setValidationError(null);
    setPreviewContent("");
    setFormattedDoc(null);
    setCustomFont("");

    // Reset all custom options to default
    setFontFamily(defaultFont);
    setFontSize(defaultFontSize);
    setLineSpacing(defaultLineSpacing);
    setJustify(defaultJustify);
    setPageNumbers(defaultPageNumbers);
    setMode("standard");

    // Force UploadBox to reset
    setUploadKey(Date.now());
  };

  const isSubmitDisabled = !file || isProcessing || !!validationError;

  return (
    <Layout>
      <div className="py-12">
        <div className="container max-w-3xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 text-secondary">
              <FileText className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-3">UniFormat</h1>
            <p className="text-muted-foreground">
              Format your assignments with standard or custom academic rules.
            </p>
          </div>

          {/* Upload */}
          <div className="mb-8">
            <Label className="mb-3 block">Upload Your Document</Label>
            <UploadBox
              key={uploadKey} // force reset when key changes
              validationType="uniformal"
              onFileSelect={setFile}
              onValidationError={setValidationError}
            />
          </div>

          {/* Mode Selection */}
          <div className="mb-6 flex gap-4">
            <Button
              variant={mode === "standard" ? "hero" : "outline"}
              onClick={() => setMode("standard")}
            >
              Standard
            </Button>
            <Button
              variant={mode === "custom" ? "hero" : "outline"}
              onClick={() => setMode("custom")}
            >
              Custom
            </Button>
          </div>

          <div className="mb-8 space-y-4 border p-4 rounded-md bg-muted/10 dark:bg-muted/80">
  {/* Font Family */}
  <div>
    <Label>Font Family</Label>
    <select
      value={fontFamily}
      onChange={(e) => setFontFamily(e.target.value)}
      className="w-full p-2 border rounded-md mb-2
                 bg-white text-black
                 dark:bg-muted dark:text-white dark:border-gray-600"
    >
      {commonFonts.map((font) => (
        <option
          key={font}
          value={font}
          className="bg-white text-black dark:bg-muted dark:text-white"
        >
          {font}
        </option>
      ))}
    </select>
    {fontFamily === "Other" && (
      <input
        type="text"
        value={customFont}
        onChange={(e) => setCustomFont(e.target.value)}
        placeholder="Enter font name"
        className="w-full p-2 border rounded-md
                   bg-white text-black
                   dark:bg-muted dark:text-white dark:border-gray-600"
      />
    )}
  </div>

  {/* Font Size */}
  <div>
    <Label>Font Size (pt)</Label>
    <input
      type="number"
      value={parseInt(fontSize) / 2}
      onChange={(e) => setFontSize((parseInt(e.target.value) * 2).toString())}
      className="w-full p-2 border rounded-md
                 bg-white text-black
                 dark:bg-muted dark:text-white dark:border-gray-600"
    />
  </div>

  {/* Line Spacing */}
  <div>
    <Label>Line Spacing (1=240, 1.5=360, 2=480)</Label>
    <input
      type="number"
      value={parseInt(lineSpacing) / 240}
      onChange={(e) => setLineSpacing((parseInt(e.target.value) * 240).toString())}
      className="w-full p-2 border rounded-md
                 bg-white text-black
                 dark:bg-muted dark:text-white dark:border-gray-600"
    />
  </div>

  {/* Justify */}
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={justify}
      onChange={(e) => setJustify(e.target.checked)}
      className="accent-primary dark:accent-secondary"
    />
    <Label>Justify Text</Label>
  </div>

  {/* Page Numbers */}
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={pageNumbers}
      onChange={(e) => setPageNumbers(e.target.checked)}
      className="accent-primary dark:accent-secondary"
    />
    <Label>Include Page Numbers</Label>
  </div>
</div>
          {/* ACTION */}
          <div className="flex flex-col items-center gap-4">
            {!isComplete ? (
              <Button
                variant="hero"
                size="lg"
                onClick={handleFormat}
                disabled={isSubmitDisabled}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Format Assignment"
                )}
              </Button>
            ) : (
              <>
                <div className="w-full">
                  <Label className="mb-2 block">Preview</Label>
                  <textarea
                    value={previewContent}
                    readOnly
                    className="w-full h-72 p-3 border rounded-md text-sm bg-muted"
                  />
                </div>

                <Button
                  variant="hero"
                  size="lg"
                  className="mt-2"
                  onClick={downloadFormattedFile}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Formatted File
                </Button>

                <Button variant="outline" onClick={resetForm} className="mt-2">
                  Format Another
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
