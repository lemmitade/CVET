import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { memoryStore } from "@/lib/store";

export type StorageFolder = "CV_UPLOADS" | "GENERATED_PDFS" | "PAYMENT_SCREENSHOTS" | "ATS_REPORTS";

export interface StoredFileRecord {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  googleDriveFileId?: string | null;
  localPath?: string | null;
  folderType: StorageFolder;
  userId?: string | null;
  createdAt: Date;
}

function getGoogleDriveClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !privateKey || clientEmail.trim() === "" || clientEmail.includes("service-account@project")) {
    return null;
  }

  // Format private key appropriately if escaped in env
  privateKey = privateKey.replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  return google.drive({ version: "v3", auth });
}

export async function uploadFileToStorage(params: {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  folderType: StorageFolder;
  userId?: string | null;
}): Promise<StoredFileRecord> {
  const fileId = `file_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  let googleDriveFileId: string | null = null;
  let localPath: string | null = null;

  const drive = getGoogleDriveClient();
  const parentFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (drive && parentFolderId && !parentFolderId.includes("1A2B3C4D")) {
    try {
      const stream = new Readable();
      stream.push(params.buffer);
      stream.push(null);

      const response = await drive.files.create({
        requestBody: {
          name: `${params.folderType}_${params.fileName}`,
          parents: [parentFolderId],
          description: `CVET file: ${params.folderType} uploaded by ${params.userId || "guest"}`,
        },
        media: {
          mimeType: params.mimeType,
          body: stream,
        },
        fields: "id, name, mimeType, size",
      });

      googleDriveFileId = response.data.id || null;
    } catch (err) {
      console.error("Google Drive API upload failed, falling back to local file cache:", err);
    }
  }

  // Local storage cache fallback
  try {
    const uploadDir = path.join(process.cwd(), "uploads", params.folderType.toLowerCase());
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const safeName = `${fileId}_${path.basename(params.fileName).replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    localPath = path.join(uploadDir, safeName);
    fs.writeFileSync(localPath, params.buffer);
  } catch (err) {
    console.warn("Could not save to local filesystem:", err);
  }

  const record: StoredFileRecord = {
    id: fileId,
    name: params.fileName,
    mimeType: params.mimeType,
    size: params.buffer.length,
    googleDriveFileId,
    localPath,
    folderType: params.folderType,
    userId: params.userId || null,
    createdAt: new Date(),
  };

  memoryStore.files.push(record);
  return record;
}

export async function getFileStream(fileId: string): Promise<{
  buffer: Buffer;
  mimeType: string;
  name: string;
} | null> {
  const record = memoryStore.files.find(f => f.id === fileId);
  if (!record) return null;

  // 1. Try local file path first if available
  if (record.localPath && fs.existsSync(record.localPath)) {
    const buffer = fs.readFileSync(record.localPath);
    return {
      buffer,
      mimeType: record.mimeType,
      name: record.name,
    };
  }

  // 2. Fetch from Google Drive API if Drive ID exists
  if (record.googleDriveFileId) {
    const drive = getGoogleDriveClient();
    if (drive) {
      try {
        const response = await drive.files.get(
          { fileId: record.googleDriveFileId, alt: "media" },
          { responseType: "arraybuffer" }
        );
        return {
          buffer: Buffer.from(response.data as ArrayBuffer),
          mimeType: record.mimeType,
          name: record.name,
        };
      } catch (err) {
        console.error("Google drive download failed:", err);
      }
    }
  }

  return null;
}

export async function deleteFileFromStorage(fileId: string): Promise<boolean> {
  const index = memoryStore.files.findIndex(f => f.id === fileId);
  if (index === -1) return false;

  const record = memoryStore.files[index];

  if (record.googleDriveFileId) {
    const drive = getGoogleDriveClient();
    if (drive) {
      try {
        await drive.files.delete({ fileId: record.googleDriveFileId });
      } catch (err) {
        console.error("Failed to delete file from Google Drive:", err);
      }
    }
  }

  if (record.localPath && fs.existsSync(record.localPath)) {
    try {
      fs.unlinkSync(record.localPath);
    } catch {}
  }

  memoryStore.files.splice(index, 1);
  return true;
}
