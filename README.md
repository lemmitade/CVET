# CVET — AI ATS CV Builder & Checker (Ethiopia)

**Build Smarter. Get Hired Faster.**

A SaaS platform engineered specifically for the Ethiopian job market. CVET helps candidates create ATS-optimized CVs, check their CV compatibility score, match job descriptions, and download authentic vector PDFs with local Ethiopian Birr (ETB) payments.

---

## 🚀 Key Features

1. **Design System & Aesthetics**
   - Premium SaaS aesthetic inspired by Linear, Stripe, and Vercel.
   - Built with Next.js App Router, TypeScript, and Tailwind CSS.
   - Full dark mode and light mode support with `next-themes`.
   - Brand Palette: Primary `#00AEEF` (Cyan-blue), Secondary `#7259FF` (Electric Purple).

2. **One-Page Continuous CV Builder (`/builder`)**
   - Single-screen continuous workflow without multi-step interruptions.
   - Compact multi-column fields for personal details, experience, education, skills, certifications, and languages.
   - Real-time side-by-side ATS single-column preview.
   - AI actions: "AI Improve Summary", "AI Rewrite Bullet", "AI Suggest Skills".
   - Preserves candidate truth: never invents unearned degrees, false companies, or fake metrics.

3. **ATS Checker (`/ats-checker`)**
   - Upload PDF and DOCX documents with strict 1 MB (1,048,576 bytes) frontend and backend validation.
   - Complete algorithmic diagnostics:
     - Machine text extractability & font encoding.
     - Contact details (email, phone, location, LinkedIn).
     - Standard ATS section headers.
     - Action verb density & quantifiable impact.
     - Single-column formatting compliance.
     - Job Description keyword matching (matched vs. missing keywords).
     - Compatibility score (0–100) with categorized issues (Critical, Warning, Info) and clear disclaimers.

4. **Authentic Vector PDF Generator**
   - True selectable-text PDF generated via `jspdf`.
   - Never an image snapshot or canvas screenshot—guaranteed 100% parsable by HR automated systems.

5. **Ethiopian Payment Workflow (ETB)**
   - Displayed and transacted in Ethiopian Birr (e.g. 250 ETB, 450 ETB, 750 ETB).
   - Manual verification system supporting:
     - **Telebirr**
     - **Commercial Bank of Ethiopia (CBE)**
     - **Awash Bank**
   - Candidate uploads confirmation slip screenshot and enters transaction reference.
   - Automatic protection against duplicate transaction claims.
   - Audit trail and status pipeline: `PENDING`, `VERIFYING`, `APPROVED`, `REJECTED`, `MANUAL_REVIEW`.
   - Unlocked download upon admin approval.

6. **Google Drive Cloud File Storage**
   - Google Drive API client using service-account credentials.
   - Organized folders for `CV_UPLOADS`, `GENERATED_PDFS`, `PAYMENT_SCREENSHOTS`, and `ATS_REPORTS`.
   - Local filesystem cache fallback for offline/development environments.

7. **Neon PostgreSQL & Prisma ORM**
   - Complete Prisma schema in `prisma/schema.prisma`.
   - Models for Users, CVs, WorkExperiences, Educations, Skills, AtsScans, Payments, FileRecords, PricingPlans, AppSettings, AtsRules, and AuditLogs.

8. **Executive Admin Dashboard (`/admin`)**
   - Overview metrics: Revenue (ETB), Pending Approvals, Total Users, CVs, Scans.
   - Payment Verification: Screenshot viewer, approval, rejection, and decision notes.
   - ATS Rule Weights: Slider adjustments, category toggles, upload size thresholds.
   - AI Settings: Dynamic OpenAI model selection, editable prompts in database (no redeployment needed).
   - Pricing & Bank Accounts: Edit ETB rates and mobile banking recipient details.
   - File Manager: Search files, view storage usage (MB), delete from cloud.
   - User Management: Search users, view user resumes, suspend/activate accounts.
   - Audit Trail: Immutable record of administrator decisions.

---

## 🛠️ Setup and Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Neon PostgreSQL Connection URL
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-YOUR-PROJECT.us-east-2.aws.neon.tech/neondb?sslmode=require"

# JWT Secret
JWT_SECRET="your_secure_jwt_secret"

# Default Admin Credentials
INITIAL_ADMIN_EMAIL="admin@cvet.et"
INITIAL_ADMIN_PASSWORD="AdminPassword2026!"

# OpenAI API Key (Optional: rule-based fallback active if missing)
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4o-mini"

# Google Drive API (Optional: local file cache fallback active if missing)
GOOGLE_CLIENT_EMAIL="service-account@project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID="1A2B3C4D5E6F7G8H9I0J"

# ATS Upload Limit
ATS_MAX_FILE_SIZE_BYTES=1048576
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Default Test Accounts

| Role | Email | Password | Access |
|---|---|---|---|
| **Super Admin** | `admin@cvet.et` | `AdminPassword2026!` | `/admin`, all settings, verification |
| **Job Seeker** | `jobseeker@cvet.et` | `AdminPassword2026!` | `/dashboard`, `/builder`, `/ats-checker` |

---

## 📦 Vercel Deployment

1. Push your repository to GitHub.
2. Link the repository in your Vercel Dashboard.
3. Configure the Environment Variables listed above in Vercel Project Settings.
4. Set Build Command: `npm run build`.
5. Deploy!
