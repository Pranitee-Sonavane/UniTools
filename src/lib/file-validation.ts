// File validation utilities with strict type checking

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
    ],
    maxSizeMB: 10,
    displayFormats: "PDF, DOCX",
  },
  syllabus: {
    allowedExtensions: [".pdf"],
    allowedMimeTypes: ["application/pdf"],
    maxSizeMB: 10,
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

  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = config.allowedExtensions.some((ext) =>
    fileName.endsWith(ext)
  );

  if (!hasValidExtension) {
    return {
      isValid: false,
      error: `Invalid file format. Please upload a ${config.displayFormats} file.`,
    };
  }

  // Check MIME type
  if (!config.allowedMimeTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Please upload a ${config.displayFormats} file.`,
    };
  }

  // Check file size
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > config.maxSizeMB) {
    return {
      isValid: false,
      error: `File size exceeds ${config.maxSizeMB}MB limit. Please upload a smaller file.`,
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
  return config ? config.allowedExtensions.join(",") : ".pdf";
}

export function getMaxSize(type: FileValidationType): string {
  const config = validationConfigs[type];
  return config ? `${config.maxSizeMB}MB` : "10MB";
}
