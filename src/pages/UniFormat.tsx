import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { UploadBox } from "@/components/UploadBox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileText, Download, Loader2, CheckCircle } from "lucide-react";

const universities = [
  "University of Delhi",
  "Mumbai University",
  "Anna University",
  "Jawaharlal Nehru University",
  "Other",
];

const assignmentTypes = [
  "Research Paper",
  "Lab Report",
  "Essay",
  "Case Study",
  "Thesis",
  "Project Report",
];

const fontFamilies = [
  "Times New Roman",
  "Arial",
  "Calibri",
  "Georgia",
  "Cambria",
];

const fontSizes = ["10", "11", "12", "14"];
const lineSpacings = ["1.0", "1.15", "1.5", "2.0"];
const margins = ["1 inch", "1.25 inch", "1.5 inch", "0.75 inch"];

export default function UniFormat() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"preset" | "custom">("preset");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Preset mode state
  const [university, setUniversity] = useState("");
  const [assignmentType, setAssignmentType] = useState("");

  // Custom mode state
  const [fontFamily, setFontFamily] = useState("Times New Roman");
  const [fontSize, setFontSize] = useState("12");
  const [lineSpacing, setLineSpacing] = useState("1.5");
  const [margin, setMargin] = useState("1 inch");
  const [pageNumbering, setPageNumbering] = useState(true);
  const [headerText, setHeaderText] = useState("");
  const [footerText, setFooterText] = useState("");
  const [coverPage, setCoverPage] = useState(true);

  const handleFormat = () => {
    if (!file) return;
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 2000);
  };

  const handleDownload = () => {
    // Placeholder for download functionality
    console.log("Downloading formatted document...");
  };

  const resetForm = () => {
    setFile(null);
    setIsComplete(false);
    setIsProcessing(false);
  };

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
              Automatically format assignments using university presets or custom rules.
            </p>
          </div>

          {/* Upload Section */}
          <div className="mb-8">
            <Label className="text-base font-medium mb-3 block">Upload Your Document</Label>
            <UploadBox onFileSelect={setFile} />
          </div>

          {/* Mode Selection */}
          <div className="mb-8">
            <Label className="text-base font-medium mb-3 block">Formatting Mode</Label>
            <RadioGroup
              value={mode}
              onValueChange={(value) => setMode(value as "preset" | "custom")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="preset" id="preset" />
                <Label htmlFor="preset" className="cursor-pointer">Use University Preset</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="cursor-pointer">Custom Formatting</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Preset Mode Options */}
          {mode === "preset" && (
            <div className="space-y-6 mb-8 p-6 bg-muted/30 rounded-xl border border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">University</Label>
                  <Select value={university} onValueChange={setUniversity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select university" />
                    </SelectTrigger>
                    <SelectContent>
                      {universities.map((uni) => (
                        <SelectItem key={uni} value={uni}>
                          {uni}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block">Assignment Type</Label>
                  <Select value={assignmentType} onValueChange={setAssignmentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Custom Mode Options */}
          {mode === "custom" && (
            <div className="space-y-6 mb-8 p-6 bg-muted/30 rounded-xl border border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">Font Family</Label>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((font) => (
                        <SelectItem key={font} value={font}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block">Font Size</Label>
                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontSizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}pt
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block">Line Spacing</Label>
                  <Select value={lineSpacing} onValueChange={setLineSpacing}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {lineSpacings.map((spacing) => (
                        <SelectItem key={spacing} value={spacing}>
                          {spacing}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block">Margins</Label>
                  <Select value={margin} onValueChange={setMargin}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {margins.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">Header Text (optional)</Label>
                  <Input 
                    placeholder="e.g., Assignment Title" 
                    value={headerText}
                    onChange={(e) => setHeaderText(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Footer Text (optional)</Label>
                  <Input 
                    placeholder="e.g., Your Name" 
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <Switch 
                    id="page-numbering" 
                    checked={pageNumbering}
                    onCheckedChange={setPageNumbering}
                  />
                  <Label htmlFor="page-numbering" className="cursor-pointer">Page Numbering</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch 
                    id="cover-page" 
                    checked={coverPage}
                    onCheckedChange={setCoverPage}
                  />
                  <Label htmlFor="cover-page" className="cursor-pointer">Include Cover Page</Label>
                </div>
              </div>
            </div>
          )}

          {/* Action Section */}
          <div className="flex flex-col items-center gap-4">
            {!isComplete ? (
              <Button
                variant="hero"
                size="lg"
                onClick={handleFormat}
                disabled={!file || isProcessing}
                className="min-w-[200px]"
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
              <div className="text-center">
                <div className="mb-4 inline-flex items-center gap-2 text-success font-medium">
                  <CheckCircle className="w-5 h-5" />
                  Formatting Complete!
                </div>
                <div className="flex gap-3">
                  <Button variant="hero" size="lg" onClick={handleDownload}>
                    <Download className="w-4 h-4" />
                    Download File
                  </Button>
                  <Button variant="outline" size="lg" onClick={resetForm}>
                    Format Another
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
