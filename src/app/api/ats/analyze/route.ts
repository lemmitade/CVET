import { NextRequest, NextResponse } from "next/server";
import { analyzeCvText } from "@/lib/ats-engine";
import { uploadFileToStorage } from "@/lib/storage";
import { getSessionUser } from "@/lib/auth";
import { memoryStore } from "@/lib/store";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

const MAX_FILE_SIZE = 1048576; // 1 MB = 1,048,576 bytes
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const jobDescription = (formData.get("jobDescription") as string) || "";
    const rawCvTextParam = (formData.get("cvText") as string) || "";

    let extractedText = "";
    let fileName = "pasted_cv_text";
    let fileSize = 0;
    let fileMimeType = "text/plain";

    if (file) {
      fileName = file.name;
      fileSize = file.size;
      fileMimeType = file.type || "application/octet-stream";

      // 1. Strict File Size Validation (Frontend & Backend: 1 MB = 1,048,576 bytes)
      if (fileSize > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            error: `File size exceeds the 1 MB limit (${(fileSize / (1024 * 1024)).toFixed(2)} MB uploaded). Maximum allowed size is 1,048,576 bytes.`,
          },
          { status: 400 }
        );
      }

      // 2. Strict File Extension / Type Validation
      const ext = fileName.split(".").pop()?.toLowerCase();
      const isValidExt = ext === "pdf" || ext === "docx" || ext === "doc" || ext === "txt";

      if (!isValidExt && !ALLOWED_MIME_TYPES.includes(fileMimeType)) {
        return NextResponse.json(
          {
            error: "Unsupported file type. Please upload a standard PDF (.pdf) or Microsoft Word (.docx) document.",
          },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Extract text based on file format
      if (ext === "docx" || fileMimeType.includes("wordprocessingml")) {
        try {
          const mammothResult = await mammoth.extractRawText({ buffer });
          extractedText = mammothResult.value;
        } catch (docxErr: any) {
          return NextResponse.json(
            { error: `Could not parse DOCX document text: ${docxErr.message}` },
            { status: 422 }
          );
        }
      } else if (ext === "pdf" || fileMimeType === "application/pdf") {
        try {
          // pdf-parse v2 API
          const parser: any = new PDFParse({ data: buffer });
          if (typeof parser.load === "function") {
            await parser.load();
          }
          const textRes: any = typeof parser.getText === "function" ? await parser.getText() : null;
          extractedText = typeof textRes === "string" ? textRes : (textRes?.text || "");
          if (!extractedText || extractedText.trim().length === 0) {
            // Raw text fallback
            extractedText = buffer.toString("latin1").replace(/[^\x20-\x7E\n\r\t]/g, " ");
          }
        } catch {
          // Fallback extraction
          extractedText = buffer.toString("latin1").replace(/[^\x20-\x7E\n\r\t]/g, " ");
        }
      } else {
        extractedText = buffer.toString("utf-8");
      }

      // Save file to storage
      const sessionUser = await getSessionUser(req);
      try {
        await uploadFileToStorage({
          buffer,
          fileName,
          mimeType: fileMimeType,
          folderType: "ATS_REPORTS",
          userId: sessionUser?.userId || null,
        });
      } catch (storageErr) {
        console.warn("Storage upload warning:", storageErr);
      }
    } else if (rawCvTextParam && rawCvTextParam.trim().length > 0) {
      extractedText = rawCvTextParam;
      fileSize = Buffer.byteLength(rawCvTextParam, "utf8");
    } else {
      return NextResponse.json(
        { error: "No CV file or text provided for ATS analysis." },
        { status: 400 }
      );
    }

    if (!extractedText || extractedText.trim().length < 20) {
      return NextResponse.json(
        {
          error: "The uploaded file contains little or no extractable text. Please ensure it is not a scanned image or password-protected document.",
        },
        { status: 422 }
      );
    }

    // Run ATS Engine
    const analysis = analyzeCvText(extractedText, fileName, jobDescription);

    // Record scan in memory / database
    const sessionUser = await getSessionUser(req);
    const scanRecord = {
      id: `scan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: sessionUser?.userId || null,
      fileName,
      fileSize,
      fileMimeType,
      score: analysis.score,
      readabilityScore: analysis.readabilityScore,
      sectionsScore: analysis.sectionsScore,
      experienceScore: analysis.experienceScore,
      skillsScore: analysis.skillsScore,
      formattingScore: analysis.formattingScore,
      jobMatchScore: analysis.jobMatchScore,
      jobDescription: jobDescription || null,
      matchedKeywords: analysis.matchedKeywords,
      missingKeywords: analysis.missingKeywords,
      issues: analysis.issues,
      recommendations: analysis.recommendations,
      createdAt: new Date(),
    };

    memoryStore.atsScans.unshift(scanRecord);

    return NextResponse.json({
      success: true,
      analysis,
      scanId: scanRecord.id,
      fileName,
      fileSize,
    });
  } catch (err: any) {
    console.error("ATS analysis error:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred during ATS analysis." },
      { status: 500 }
    );
  }
}
