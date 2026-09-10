---
name: get-shit-done
description: >-
  GSD (Get Shit Done) 5-Phase Execution Protocol. Use this skill when executing complex software development tasks
  demanding high velocity, rigorous quality, zero-placeholder implementation, and disciplined phase progression.
---

# GSD (Get Shit Done) 5-Phase Execution Protocol

The **GSD (Get Shit Done)** protocol is an aggressive, systematic framework for delivering complete, battle-tested software solutions with zero placeholders, full type safety, and immediate verification.

---

## The 5 Phases of GSD

### Phase 1: Discovery & Specification Analysis
- **Goal**: Fully comprehend requirements without making unverified assumptions.
- **Actions**:
  1. Inspect existing codebase, configurations, and dependencies.
  2. Parse user specifications, designs, or mockups.
  3. Identify all required routes, data contracts, and domain models.
  4. Flag potential breaking changes or ambiguous constraints upfront.

### Phase 2: Architectural Breakdown & Roadmap
- **Goal**: Formulate an immutable plan of action and state tracker.
- **Actions**:
  1. Initialize `ROADMAP.md` using the master template in `resources/ROADMAP-template.md`.
  2. Initialize `STATE.md` using `resources/STATE-template.md` to track current progress and blockers.
  3. Partition tasks into modular, self-contained epics and subtasks.
  4. Define explicit verification criteria for each milestone.

### Phase 3: Execution & Component Construction
- **Goal**: Rapid, zero-placeholder implementation of functional code.
- **Actions**:
  1. Build foundation first: core types, utilities, and global design tokens.
  2. Implement state management, context providers, and data layers.
  3. Construct reusable components adhering to design standards.
  4. Assemble full views and integrate routing.
  5. **Absolute Rule**: Never write dummy placeholders (`// TODO: implement later`, empty callbacks, or mock stubs without actual functionality).

### Phase 4: Validation, Testing & Verification
- **Goal**: Prove that the implementation functions as designed.
- **Actions**:
  1. Execute production build (`npm run build` or framework equivalent).
  2. Run type checker (`tsc --noEmit`) and fix all compiler diagnostics.
  3. Validate all routes respond with HTTP 200 OK.
  4. Verify interactive UI behaviors, modals, error states, and empty states.

### Phase 5: Delivery & State Documentation
- **Goal**: Deliver a clean handover with transparent audit trails.
- **Actions**:
  1. Update `STATE.md` marking completed tasks.
  2. Document completed work, route tables, and testing evidence in `walkthrough.md`.
  3. Provide exact local run instructions and summary to the user.
