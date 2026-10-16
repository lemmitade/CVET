import { NextRequest, NextResponse } from "next/server";
import { generateSelectablePdf, CvDataForPdf } from "@/lib/pdf-generator";
import { uploadFileToStorage } from "@/lib/storage";
import { getSessionUser } from "@/lib/auth";
import { memoryStore } from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionUser = await getSessionUser(req);

    const cv = memoryStore.cvs.find(c => c.id === id);
    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    // Check payment or admin access
    const isOwner = sessionUser && sessionUser.userId === cv.userId;
    const isAdmin = sessionUser && sessionUser.role === "ADMIN";
    const isApprovedPayment = memoryStore.payments.some(
      p => p.cvId === id && p.status === "APPROVED"
    );

    const isUnlocked = cv.isPurchased || isApprovedPayment || isAdmin;

    // Check searchParam if preview is requested
    const url = new URL(req.url);
    const isPreview = url.searchParams.get("preview") === "true";

    if (!isUnlocked && !isPreview) {
      return NextResponse.json(
        {
          error: "Payment required. Please submit your payment verification to download the high-resolution ATS PDF.",
          paymentRequired: true,
          cvId: id,
        },
        { status: 402 }
      );
    }

    const pdfBuffer = generateSelectablePdf({
      fullName: cv.fullName,
      email: cv.email,
      phone: cv.phone,
      location: cv.location,
      linkedin: cv.linkedin,
      portfolio: cv.portfolio,
      targetJobTitle: cv.targetJobTitle,
      yearsOfExperience: cv.yearsOfExperience,
      summary: cv.summary,
      workExperiences: cv.workExperiences || [],
      educations: cv.educations || [],
      skills: cv.skills || [],
      certifications: cv.certifications || [],
      languages: cv.languages || [],
    });

    // Save generated PDF to Google Drive storage / local cache
    try {
      const sanitizedName = (cv.fullName || "Resume").replace(/[^a-zA-Z0-9]/g, "_");
      await uploadFileToStorage({
        buffer: pdfBuffer,
        fileName: `${sanitizedName}_CVET_ATS_Resume.pdf`,
        mimeType: "application/pdf",
        folderType: "GENERATED_PDFS",
        userId: cv.userId || null,
      });
    } catch (saveErr) {
      console.warn("Could not save to storage:", saveErr);
    }

    const cleanFilename = `${(cv.fullName || "CVET_Resume").replace(/[^a-zA-Z0-9]/g, "_")}_ATS_CV.pdf`;

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${cleanFilename}"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (err: any) {
    console.error("PDF download error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate PDF" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: CvDataForPdf = await req.json();

    const pdfBuffer = generateSelectablePdf(body);
    const cleanFilename = `${(body.fullName || "Resume").replace(/[^a-zA-Z0-9]/g, "_")}_ATS_CV.pdf`;

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${cleanFilename}"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate PDF" }, { status: 500 });
  }
}
