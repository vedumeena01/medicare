# 🩺 Medicare AI (MediExplain)
### Multilingual Medical Report & Prescription Simplifier Platform

[![Quality Verification](https://img.shields.io/badge/Quality%20Verification-Passing%20(123%2F123)-brightgreen.svg)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black.svg)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Medicare is a comprehensive healthcare web application designed to simplify medical laboratory reports, diagnostic panels, and physician prescriptions into plain, patient-friendly language in both **English** and **Hindi (हिंदी)**, while providing medication adherence tools, health trend metrics, and specialist appointment booking.

---

## ✨ Key Features

- **📄 Multimodal AI Report Analysis**: Upload PDF, JPG, or PNG lab reports (CBC, Thyroid, Lipid, Metabolic, Diabetes HbA1c) and receive structured breakdowns of abnormal vs normal parameters.
- **🌐 Dual-Language Support (English & Hindi)**: Full synchronous translation across all reports, medical glossaries, doctor questions, and interface elements.
- **📸 Live AR Camera Scanner**: Real-time camera optical recognition for medicine strips, boxes, and prescriptions with audio TTS instructions.
- **🔬 Real-Time Scanner Safety Screening**: Live cross-screening of detected drugs against active prescriptions & allergies directly inside the camera scanner HUD.
- **🚨 Emergency Medical ID (ICE)**: Rapid paramedic/triage access to Blood Group, Drug Allergies, Next-of-Kin contacts, and active meds at `/emergency`.
- **🛡️ Drug-Drug Interaction Checker**: Screen multiple active medications for cross-drug clashes, penicillin/paracetamol allergies, and food timing rules.
- **💊 Multi-Channel Dose Reminders & Alarms**: Schedule daily doses with automated audio alerts, plus 1-click **WhatsApp** and **SMS Gateway** reminder dispatch for family caregivers.
- **🏥 HL7 FHIR R4 Health Vault & Clinical CSV**: Export standards-compliant FHIR Release 4 JSON bundles and RFC 4180 clinical spreadsheets for modern hospital and EMR integration.
- **💬 In-App Feedback & HIPAA Telemetry**: Built-in 5-star ratings, bug reporting channel (`/api/feedback`), and privacy-safe event logging.
- **🛡️ Production Resilience & Error Recovery**: Route-level Next.js error boundaries (`error.tsx`, `global-error.tsx`) and skeleton loaders (`loading.tsx`) ensuring zero blank screens.
- **📊 Health Command Center**: Computes an aggregate Health Score with visual Cardiovascular and Diabetes Risk stratification meters.
- **🩺 Specialist Directory & Appointments**: Book in-person clinic visits or video tele-consultations with verified cardiologists, endocrinologists, physicians, and pulmonologists.
- **🤖 Live AI Clinical Assistant**: Context-aware clinical chat for symptom guidance and dietary inquiries with non-diagnostic safety guardrails.
- **⚡ Evaluator Sandbox & Persona Selector**: 3 one-click clinical personas (Diabetic, Post-Op, Thyroid) with 1-click demo restoration or clean wipe.

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

### 3. Automated Health Verification & Multi-Tier CI
```bash
# Run the 71-point automated health suite:
npm test

# Or run the complete multi-tier CI pipeline (Typecheck + 71 Tests + Production Build):
npm run ci

# On Windows (1-Click double-clickable script):
scripts\verify.bat
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 5. Production Build Verification
```bash
npm run build
```
Builds cleanly with **0 TypeScript errors** across all 38 application routes.

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
