import { jsPDF } from "jspdf";

export interface CvDataForPdf {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string | null;
  portfolio?: string | null;
  targetJobTitle: string;
  yearsOfExperience?: number;
  summary: string;
  workExperiences: Array<{
    company: string;
    jobTitle: string;
    location?: string | null;
    startDate: string;
    endDate?: string | null;
    isCurrent: boolean;
    responsibilities: string;
  }>;
  educations: Array<{
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string | null;
    grade?: string | null;
  }>;
  skills: Array<{ name: string; category?: string | null }>;
  certifications?: Array<{ name: string; issuer: string; issueDate?: string | null }>;
  languages?: Array<{ name: string; proficiency: string }>;
}

export function generateSelectablePdf(data: CvDataForPdf): Buffer {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = margin + 10;

  function checkPageBreak(requiredSpace: number) {
    if (y + requiredSpace > pageHeight - margin) {
      doc.addPage();
      y = margin + 15;
    }
  }

  // Header: Full Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42); // #0f172a
  doc.text(data.fullName || "Candidate Name", margin, y);
  y += 20;

  // Target Job Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(0, 174, 239); // #00AEEF Primary
  doc.text(data.targetJobTitle ? data.targetJobTitle.toUpperCase() : "PROFESSIONAL", margin, y);
  y += 16;

  // Contact Info Line
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // #475569

  const contactItems = [
    data.email,
    data.phone,
    data.location,
    data.linkedin?.replace(/^https?:\/\//, ""),
    data.portfolio?.replace(/^https?:\/\//, ""),
  ].filter(Boolean);

  const contactText = contactItems.join("  |  ");
  doc.text(contactText, margin, y);
  y += 14;

  // Horizontal separator line
  doc.setDrawColor(226, 232, 240); // #e2e8f0
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);
  y += 18;

  // Helper function for section headings
  function addSectionHeader(title: string) {
    checkPageBreak(35);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(title.toUpperCase(), margin, y);
    y += 5;

    doc.setDrawColor(0, 174, 239);
    doc.setLineWidth(1.2);
    doc.line(margin, y, margin + 45, y);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin + 45, y, pageWidth - margin, y);
    y += 14;
  }

  // 1. Professional Summary
  if (data.summary && data.summary.trim()) {
    addSectionHeader("Professional Summary");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);

    const splitSummary = doc.splitTextToSize(data.summary.trim(), contentWidth);
    for (const line of splitSummary) {
      checkPageBreak(14);
      doc.text(line, margin, y);
      y += 13;
    }
    y += 10;
  }

  // 2. Work Experience
  if (data.workExperiences && data.workExperiences.length > 0) {
    addSectionHeader("Work Experience");

    for (const exp of data.workExperiences) {
      checkPageBreak(40);

      // Job Title and Date
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(exp.jobTitle, margin, y);

      const dateStr = `${exp.startDate} - ${exp.isCurrent ? "Present" : exp.endDate || "Present"}`;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      const dateWidth = doc.getTextWidth(dateStr);
      doc.text(dateStr, pageWidth - margin - dateWidth, y);
      y += 13;

      // Company and Location
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      const companyLocation = exp.location ? `${exp.company} — ${exp.location}` : exp.company;
      doc.text(companyLocation, margin, y);
      y += 12;

      // Responsibilities Bullets
      if (exp.responsibilities) {
        const bullets = exp.responsibilities
          .split("\n")
          .map(b => b.trim().replace(/^[-*•]\s*/, ""))
          .filter(Boolean);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);

        for (const bullet of bullets) {
          const bulletLines = doc.splitTextToSize(bullet, contentWidth - 14);
          checkPageBreak(bulletLines.length * 12 + 4);

          // Bullet point character
          doc.text("•", margin + 2, y);

          let lineIndex = 0;
          for (const line of bulletLines) {
            doc.text(line, margin + 12, y);
            y += 12;
            lineIndex++;
          }
          y += 2;
        }
      }
      y += 8;
    }
  }

  // 3. Education
  if (data.educations && data.educations.length > 0) {
    addSectionHeader("Education");

    for (const edu of data.educations) {
      checkPageBreak(30);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      const degreeText = `${edu.degree} in ${edu.fieldOfStudy}`;
      doc.text(degreeText, margin, y);

      const dateStr = `${edu.startDate} - ${edu.endDate || "Completed"}`;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      const dateWidth = doc.getTextWidth(dateStr);
      doc.text(dateStr, pageWidth - margin - dateWidth, y);
      y += 13;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      const schoolDetails = edu.grade ? `${edu.school} (${edu.grade})` : edu.school;
      doc.text(schoolDetails, margin, y);
      y += 16;
    }
  }

  // 4. Skills
  if (data.skills && data.skills.length > 0) {
    addSectionHeader("Skills & Competencies");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);

    const skillNames = data.skills.map(s => s.name).join("  •  ");
    const skillLines = doc.splitTextToSize(skillNames, contentWidth);
    for (const line of skillLines) {
      checkPageBreak(13);
      doc.text(line, margin, y);
      y += 13;
    }
    y += 10;
  }

  // 5. Certifications & Languages
  if ((data.certifications && data.certifications.length > 0) || (data.languages && data.languages.length > 0)) {
    if (data.certifications && data.certifications.length > 0) {
      addSectionHeader("Certifications");
      for (const cert of data.certifications) {
        checkPageBreak(15);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        doc.text(cert.name, margin, y);

        const issuerText = cert.issueDate ? `${cert.issuer} (${cert.issueDate})` : cert.issuer;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        const issuerWidth = doc.getTextWidth(issuerText);
        doc.text(issuerText, pageWidth - margin - issuerWidth, y);
        y += 13;
      }
      y += 6;
    }

    if (data.languages && data.languages.length > 0) {
      addSectionHeader("Languages");
      const langText = data.languages.map(l => `${l.name} (${l.proficiency})`).join("  •  ");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      checkPageBreak(14);
      doc.text(langText, margin, y);
      y += 14;
    }
  }

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
