import { useState, useCallback } from "react";
import { Upload, File, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadBoxProps {
  acceptedFormats?: string[];
  maxSize?: string;
  onFileSelect?: (file: File | null) => void;
}

export function UploadBox({ 
  acceptedFormats = ["PDF", "DOCX"], 
  maxSize = "10MB",
  onFileSelect 
}: UploadBoxProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      onFileSelect?.(files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      onFileSelect?.(files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    onFileSelect?.(null);
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
        isDragging 
          ? "border-secondary bg-secondary/5" 
          : selectedFile 
            ? "border-success bg-success/5" 
            : "border-border hover:border-secondary/50"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {selectedFile ? (
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-3 bg-success/10 text-success px-4 py-2 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{selectedFile.name}</span>
            <span className="text-sm opacity-75">
              ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={removeFile} className="text-muted-foreground hover:text-destructive">
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-foreground font-medium mb-1">
            Drag & drop your file here
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            or click to browse
          </p>
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".pdf,.docx,.doc"
            onChange={handleFileInput}
          />
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <File className="w-3 h-3" />
            <span>Accepted: {acceptedFormats.join(", ")}</span>
            <span>•</span>
            <span>Max: {maxSize}</span>
          </div>
        </>
      )}
    </div>
  );
}
