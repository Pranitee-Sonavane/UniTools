import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { FileText, Download, Loader2, CheckCircle, Check, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const fontFamilies = [
  "Times New Roman",
  "Arial",
  "Calibri",
  "Georgia",
  "Cambria",
];

const fontSizes = ["10", "11", "12", "14"];
const lineSpacings = ["1.0", "1.15", "1.5", "2.0"];
const margins = ["0.75 inch", "1 inch", "1.25 inch", "1.5 inch"];

export default function UniFormat() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"standard" | "custom">("standard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Custom mode state
  const [fontFamily, setFontFamily] = useState("Times New Roman");
  const [fontSize, setFontSize] = useState("12");
  const [lineSpacing, setLineSpacing] = useState("1.5");
  const [margin, setMargin] = useState("1 inch");
  const [pageNumbering, setPageNumbering] = useState(true);
  const [headerText, setHeaderText] = useState("");
  const [footerText, setFooterText] = useState("");
  const [coverPage, setCoverPage] = useState(true);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFormat = async () => {
    if (!file) return;
    
    if (!user) {
      toast({
        title: "Sign in Required",
        description: "Please sign in to format your documents.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsUploading(true);

    try {
      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Create formatting job record
      const formatSettings = mode === "custom" ? {
        fontFamily,
        fontSize,
        lineSpacing,
        margin,
        pageNumbering,
        headerText,
        footerText,
        coverPage,
      } : {
        fontFamily: "Times New Roman",
        fontSize: "12",
        lineSpacing: "1.5",
        margin: "1 inch",
        pageNumbering: true,
        coverPage: true,
      };

      const { error: jobError } = await supabase
        .from("formatting_jobs")
        .insert({
          user_id: user.id,
          original_file_path: filePath,
          format_mode: mode,
          format_settings: formatSettings,
          status: "processing",
        });

      if (jobError) {
        throw jobError;
      }

      setIsUploading(false);
      setIsProcessing(true);

      // Simulate processing (in real app, this would be handled by an edge function)
      setTimeout(() => {
        setIsProcessing(false);
        setIsComplete(true);
        toast({
          title: "Formatting Complete!",
          description: "Your document has been formatted successfully.",
        });
      }, 2000);

    } catch (error: any) {
      setIsUploading(false);
      setIsProcessing(false);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your formatted document is being prepared for download.",
    });
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
              Format your assignments with standard academic layout or custom rules.
            </p>
          </div>

          {/* Auth Notice */}
          {!user && (
            <div className="mb-8 p-4 rounded-xl bg-secondary/5 border border-secondary/20 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Sign in to save your documents</p>
                <p className="text-sm text-muted-foreground">Your formatted files will be stored securely in your account.</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => navigate("/auth")}>
                <LogIn className="w-4 h-4 mr-1" />
                Sign In
              </Button>
            </div>
          )}

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
              onValueChange={(value) => setMode(value as "standard" | "custom")}
              className="flex flex-col gap-3"
            >
              <label 
                htmlFor="standard" 
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  mode === "standard" 
                    ? "border-secondary bg-secondary/5" 
                    : "border-border bg-background hover:border-secondary/50"
                }`}
              >
                <RadioGroupItem value="standard" id="standard" className="mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-foreground">Standard Academic Format</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Times New Roman, 12pt, 1.5 spacing, 1-inch margins, page numbers, cover page
                  </p>
                </div>
                {mode === "standard" && (
                  <Check className="w-5 h-5 text-secondary mt-0.5" />
                )}
              </label>
              <label 
                htmlFor="custom" 
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  mode === "custom" 
                    ? "border-secondary bg-secondary/5" 
                    : "border-border bg-background hover:border-secondary/50"
                }`}
              >
                <RadioGroupItem value="custom" id="custom" className="mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-foreground">Custom Formatting</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Define your own formatting rules for font, size, spacing, and more
                  </p>
                </div>
                {mode === "custom" && (
                  <Check className="w-5 h-5 text-secondary mt-0.5" />
                )}
              </label>
            </RadioGroup>
          </div>

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
                  <Label htmlFor="page-numbering" className="cursor-pointer">Page Numbering (bottom center)</Label>
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
                disabled={!file || isProcessing || isUploading}
                className="min-w-[200px]"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : isProcessing ? (
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
