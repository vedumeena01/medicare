---
description: Zero-Placeholder, Strict Type Safety, and Mandatory Verification Rules for GSD execution.
globs: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"]
always_on: true
---

# GSD Rules: Zero-Placeholder & Mandatory Verification

These rules apply across the entire workspace to ensure industrial-grade software quality.

---

## 1. Zero Placeholders
- **Forbidden**: `// TODO`, `// FIXME`, `/* implement later */`, stubbed `() => {}` callbacks without action, empty modal dialogs, or dummy lorem ipsum text where realistic domain data belongs.
- **Requirement**: Every user action (clicks, form submits, status changes, filters, exports) must execute a realistic functional workflow, update reactive state, and persist where appropriate.

## 2. Strict Type Safety
- Never use `any` unless interacting with untyped third-party browser window APIs.
- Define explicit interfaces and types for all entities, component props, and API payloads.
- Ensure exhaustive type checking with zero compiler warnings.

## 3. Mandatory Build Verification
- Before presenting work as finished, you MUST run the project build command (`npm run build`).
- Verify that every route prerenders or server-renders without unhandled runtime exceptions.

## 4. Error & Empty State Completeness
- Every list, table, or async section must provide a polished empty state.
- Form inputs must have inline validation feedback and clear error states.

## 5. Healthcare Privacy & Safety Standards
- Clearly present medical safety disclaimers: AI tools are educational and non-diagnostic.
- Never present AI predictions as definitive clinical diagnoses.
- For emergency symptoms, instruct the user to contact local emergency medical services immediately.
