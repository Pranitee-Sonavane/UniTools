import { ref, uploadBytesResumable, getDownloadURL, UploadTask } from "firebase/storage";
import { storage } from "./firebase";

export interface UploadProgress {
  progress: number;
  downloadUrl: string | null;
  error: string | null;
  isUploading: boolean;
  isComplete: boolean;
}

export interface UploadResult {
  downloadUrl: string;
  filePath: string;
}

/**
 * Upload a file to Firebase Storage
 * @param file - The file to upload
 * @param folder - The folder path in storage (e.g., "documents", "syllabi", "pyqs")
 * @param onProgress - Callback for upload progress updates
 * @returns Promise with download URL and file path
 */
export async function uploadFileToFirebase(
  file: File,
  folder: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `${folder}/${timestamp}_${sanitizedName}`;
    
    const storageRef = ref(storage, filePath);
    const uploadTask: UploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => {
        console.error("Upload error:", error);
        reject(new Error("Failed to upload file. Please try again."));
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ downloadUrl, filePath });
        } catch (error) {
          reject(new Error("Failed to get download URL."));
        }
      }
    );
  });
}
