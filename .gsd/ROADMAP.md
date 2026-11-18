# MediExplain AI — Implementation Roadmap & Milestones

## Phase 1: Foundation & Codebase Audit (COMPLETED)
- [x] Complete front-matter, technical diagrams, and LaTeX project report generation.
- [x] Automated test runner verification (200/200 smoke checks passing).
- [x] Static typecheck verification (`npx tsc --noEmit` 0 errors).
- [x] Codebase structural audit: inspected all 16 API routes, core `lib/` modules, and Prisma schema.

## Phase 2: Database Layer & Persistence Alignment (UPCOMING - PRIORITY 1)
- [ ] Align Prisma SQLite Schema with `data/medicare.db.json`:
  - Add missing models: `Doctor`, `Appointment`, `Consultation`, `NotificationItem`, `FeedbackItem`, `AllergyRecord`.
  - Update `db.syncToSqlite()` to mirror all 9 entities, resolving the partial-sync discrepancy.
  - Generate Prisma migration and update SQLite seed script.

## Phase 3: Real Authentication & Session Security (UPCOMING - PRIORITY 2)
- [ ] Replace simulated `localStorage` auth (`usr-1` / fake user) with secure session handling:
  - Implement `/api/auth/login`, `/api/auth/register`, and `/api/auth/logout`.
  - Password hashing with bcrypt / argon2 for credentials.
  - Secure HTTP-only JWT cookies or NextAuth/Iron-Session.
  - Server-side FIDO2 WebAuthn challenge generation & verification endpoint (`/api/auth/webauthn/verify`).

## Phase 4: AI & Clinical Intelligence Hardening (UPCOMING - PRIORITY 3)
- [ ] Multi-turn AI Chat Context Assembly (`/api/ai-chat`):
  - Expand beyond single latest report: build longitudinal patient timeline context.
  - Add semantic similarity or vector search across past lab findings.
- [ ] Real-world testing with live Gemini API keys across diverse messy lab report formats.

## Phase 5: Automated Dispatch & Telehealth Video Rooms (UPCOMING - PRIORITY 4)
- [ ] Background Dispatch Engine:
  - Integrate server-side WhatsApp Cloud API / Twilio SMS gateway for automated background dose alerts.
- [ ] Telehealth Doctor Consultation Room:
  - WebRTC peer-to-peer or Daily.co / Agora integration for live patient-doctor video consultations.
