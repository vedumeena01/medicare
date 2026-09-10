# 🩺 Medicare AI (MediExplain)
### Multilingual Medical Report & Prescription Simplifier Platform

Medicare is a comprehensive healthcare web application designed to simplify medical laboratory reports, diagnostic panels, and physician prescriptions into plain, patient-friendly language in both **English** and **Hindi (हिंदी)**, while providing medication adherence tools, health trend metrics, and specialist appointment booking.

---

## ✨ Key Features

- **📄 Multimodal AI Report Analysis**: Upload PDF, JPG, or PNG lab reports (CBC, Thyroid, Lipid, Metabolic, Diabetes HbA1c) and receive structured breakdowns of abnormal vs normal parameters.
- **🌐 Dual-Language Support (English & Hindi)**: Full synchronous translation across all reports, medical glossaries, doctor questions, and interface elements.
- **💊 Prescription Scanner & Scheduler**: Automatically extracts drug names, strengths, frequencies, and meal instructions (e.g. *after lunch*, *empty stomach*) into daily interactive schedules with reminder alarms.
- **📊 Health Command Center**: Computes an aggregate Health Score (e.g. 84/100) with visual Cardiovascular and Diabetes Risk stratification meters.
- **🩺 Specialist Directory & Appointments**: Book in-person clinic visits or video tele-consultations with verified cardiologists, endocrinologists, physicians, and pulmonologists.
- **🤖 Live AI Clinical Assistant**: Context-aware clinical chat for symptom guidance and dietary inquiries with non-diagnostic safety guardrails.
- **⚡ Instant 1-Click Demo Mode**: Includes 4 authentic sample clinical reports and 1-click loading for instant presentations and evaluation.

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- **Node.js** v18 or later
- **npm** (or yarn/pnpm)

### 2. Installation
```bash
# Clone or navigate to the repository
cd medicare

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(The platform runs gracefully with built-in heuristic clinical fallback even without an API key).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 5. Production Build Verification
```bash
npm run build
```
Builds cleanly with **0 TypeScript errors** across all 31 application routes.

---

## 📖 Mentor & Reviewer Guide

For evaluators and mentors reviewing the project, please consult:
👉 **[MENTOR_REVIEW_GUIDE.md](./MENTOR_REVIEW_GUIDE.md)** for:
- 3-Minute Quick Evaluation Walkthrough
- Test Credentials (OTP: `123456`)
- Downloadable Sample Medical PDF Files
- Architectural & Code Highlights

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.3 (App Router, Turbopack) |
| **Language** | TypeScript (Strict mode) |
| **Styling** | Tailwind CSS v4 |
| **Icons** | Lucide React |
| **Multimodal AI** | Google Gemini Generative AI SDK |
| **Persistence** | Local JSON File Database (`/data/medicare.db.json`) |

---

## ⚖️ Medical & Ethical Disclaimer
*Medicare AI is designed solely for educational, organizational, and informational purposes. It does not provide medical diagnoses, treatment prescriptions, or emergency triage. Users are always advised to seek guidance from licensed medical healthcare providers for clinical decisions.*
