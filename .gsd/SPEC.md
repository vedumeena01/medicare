# MediExplain AI (Medicare AI) — System Specification

## 1. System Overview
MediExplain AI is an enterprise-grade, offline-first, multimodal clinical decision support & health literacy platform. It simplifies complex diagnostic lab reports, extracts prescription regimens via multimodal OCR, screens for Drug-Drug Interactions (DDI) and allergies ($O(k^2)$ complexity), manages medication adherence FSM (Scheduled $\to$ Upcoming $\to$ Taken / Skipped / Overdue / Snoozed), and provides bilingual (English/Hindi) explanations and FHIR R4 clinical interoperability.

## 2. Core Architecture
- **Tier 1 (Presentation):** Next.js 16.3 (App Router), React 19, Tailwind CSS v4, WebRTC Camera Viewfinder, Web Speech API Bilingual Voice Narrator, Web Audio API alarm sound synthesizer.
- **Tier 2 (Browser Cache & Offline Storage):** Service Worker (`public/sw.js`) with SWR & LRU cache eviction, IndexedDB (`medicare_offline_db`) with `sync_queue` store for offline mutation buffering and FIFO replay, Web Crypto PKCE.
- **Tier 3 (Route Handlers):** 16 Next.js REST API routes handling reports, medicines, appointments, consultations, family profiles, emergency ICE, notifications, health checks, and AI interactions.
- **Tier 4 (Multimodal AI & Reasoning):** Google Gemini Multi-tier Cascade (`gemini-3.8-flash` $\to$ `gemini-3.1-pro-preview` $\to$ `gemini-2.5-pro` $\to$ `gemini-1.5-flash`), pairwise DDI & allergy screening matrix, clinical biomarker normalization engine ($z_i = (v_i - \mu_i)/\delta_i$), HL7 FHIR R4 bundle generator.
- **Tier 5 (Dual-Store Persistence):** Primary atomic JSON store (`data/medicare.db.json`) with `.tmp` write and atomic rename; secondary asynchronous Prisma SQLite mirror (`prisma/dev.db`).

## 3. Verified Standards & Metrics
- **Automated Test Suite:** 13 Suites, 200 checks passing (`scripts/test-flows.mjs`).
- **Static Analysis:** Strict TypeScript (`npx tsc --noEmit` exits 0 with 0 errors).
- **Accessibility:** WCAG 2.1 AA compliant (color contrast $\ge$ 4.5:1, skip-to-content, ARIA live regions).
