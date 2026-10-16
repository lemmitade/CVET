import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { memoryStore } from "@/lib/store";

export async function GET(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser(req);
    if (!sessionUser) {
      return NextResponse.json({ cvs: [] });
    }

    const userCvs = memoryStore.cvs.filter(c => c.userId === sessionUser.userId);
    return NextResponse.json({ cvs: userCvs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser(req);
    const body = await req.json();

    const cvId = body.id || `cv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const existingIndex = memoryStore.cvs.findIndex(c => c.id === cvId);

    const cvRecord = {
      id: cvId,
      userId: sessionUser?.userId || body.userId || "guest",
      title: body.title || `${body.targetJobTitle || "Professional"} CV`,
      targetJobTitle: body.targetJobTitle || "",
      yearsOfExperience: Number(body.yearsOfExperience) || 0,
      fullName: body.fullName || "",
      email: body.email || "",
      phone: body.phone || "",
      location: body.location || "",
      linkedin: body.linkedin || "",
      portfolio: body.portfolio || "",
      summary: body.summary || "",
      jobDescription: body.jobDescription || "",
      templateCode: body.templateCode || "standard_ats",
      isPurchased: existingIndex !== -1 ? memoryStore.cvs[existingIndex].isPurchased : false,
      workExperiences: Array.isArray(body.workExperiences) ? body.workExperiences : [],
      educations: Array.isArray(body.educations) ? body.educations : [],
      skills: Array.isArray(body.skills) ? body.skills : [],
      certifications: Array.isArray(body.certifications) ? body.certifications : [],
      languages: Array.isArray(body.languages) ? body.languages : [],
      createdAt: existingIndex !== -1 ? memoryStore.cvs[existingIndex].createdAt : new Date(),
      updatedAt: new Date(),
    };

    if (existingIndex !== -1) {
      memoryStore.cvs[existingIndex] = cvRecord;
    } else {
      memoryStore.cvs.unshift(cvRecord);
    }

    return NextResponse.json({ success: true, cv: cvRecord });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save CV" }, { status: 500 });
  }
}
