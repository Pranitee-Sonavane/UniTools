// File validation utilities with safe DOCX + PDF handling
// IMPORTANT: No UI changes, only validation reliability fixes

export type FileValidationType = "uniformal" | "syllabus" | "pyq";

interface ValidationConfig {
  allowedExtensions: string[];
  allowedMimeTypes: string[];
  maxSizeMB: number;
  displayFormats: string;
}

const validationConfigs: Record<FileValidationType, ValidationConfig> = {
  uniformal: {
    allowedExtensions: [".pdf", ".docx"],
    allowedMimeTypes: [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      // Some browsers report empty or generic MIME for DOCX
      "application/octet-stream",
    ],
    maxSizeMB: 10,
    displayFormats: "PDF, DOCX",
  },

  syllabus: {
    allowedExtensions: [".pdf"],
    allowedMimeTypes: ["application/pdf"],
    maxSizeMB: 2, // ✅ CHANGED FROM 10MB TO 2MB
    displayFormats: "PDF",
  },

  pyq: {
    allowedExtensions: [".pdf"],
    allowedMimeTypes: ["application/pdf"],
    maxSizeMB: 10,
    displayFormats: "PDF",
  },
};

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export function validateFile(
  file: File,
  type: FileValidationType
): ValidationResult {
  const config = validationConfigs[type];

  if (!config) {
    return { isValid: false, error: "Invalid validation type." };
  }

  const fileName = file.name.toLowerCase();
  const fileExtension = "." + fileName.split(".").pop();

  // ✅ EXTENSION CHECK (PRIMARY – reliable)
  if (!config.allowedExtensions.includes(fileExtension)) {
    return {
      isValid: false,
      error: `Invalid file format. Please upload a ${config.displayFormats} file.`,
    };
  }

  // ✅ MIME CHECK (SECONDARY – tolerant)
  if (file.type && !config.allowedMimeTypes.includes(file.type)) {
    // Allow DOCX even if MIME is missing or generic
    if (fileExtension !== ".docx") {
      return {
        isValid: false,
        error: `Invalid file type. Please upload a ${config.displayFormats} file.`,
      };
    }
  }

  // ✅ FILE SIZE CHECK
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > config.maxSizeMB) {
    return {
      isValid: false,
      error: `File size exceeds ${config.maxSizeMB}MB limit.`,
    };
  }

  return { isValid: true, error: null };
}

export function getAcceptedFormats(type: FileValidationType): string[] {
  const config = validationConfigs[type];
  return config
    ? config.displayFormats.split(", ").map((f) => f.trim())
    : ["PDF"];
}

export function getAcceptAttribute(type: FileValidationType): string {
  const config = validationConfigs[type];
  return config
    ? config.allowedExtensions.join(",")
    : ".pdf";
}

export function getMaxSize(type: FileValidationType): string {
  const config = validationConfigs[type];
  return config
    ? `${config.maxSizeMB}MB`
    : "10MB";
}
