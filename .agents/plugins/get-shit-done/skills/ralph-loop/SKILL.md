---
name: ralph-loop
description: >-
  Ralph Loop Iterative Autonomous Protocol. Drives complex tasks forward through continuous, self-correcting cycles
  of execution, testing, logging, and state updating until all milestone criteria are satisfied.
---

# Ralph Loop Iterative Autonomous Protocol

The **Ralph Loop** is a self-sustaining autonomous iteration cycle that powers continuous software engineering progress. It prevents premature halts, detects failures immediately, and systematically marches toward 100% completion.

---

## Loop Execution Architecture

```text
       ┌────────────────────────────────────────────────────────┐
       ▼                                                        │
[ 1. READ STATE ] ──► [ 2. SELECT TASK ] ──► [ 3. EXECUTE ]     │
                            │                     │             │
                            ▼                     ▼             │
                     All Done? ──► [ EXIT ]   [ 4. VERIFY ]     │
                                                  │             │
                                                  ▼             │
                                          [ 5. LOG & UPDATE ] ──┘
```

---

## Loop Steps

### Step 1: Read State & Roadmap
- Read `STATE.md` and `ROADMAP.md` to identify current position, completed tasks, and active blockers.
- Inspect the latest entries in `progress.txt`.

### Step 2: Determine Next Actionable Chunk
- Select the next unblocked item with the highest priority.
- If all items in `ROADMAP.md` are marked complete and verified, exit loop.

### Step 3: Execute Atomics
- Perform the code edit, file creation, or configuration change.
- Never batch unrelated tasks together; keep changes atomic and traceable.

### Step 4: Verification & Feedback
- Immediately run verification commands (`npm run build`, unit tests, lint).
- If an error occurs, do not abandon the task; diagnose and fix within the same loop iteration.

### Step 5: Log Progress & Update State
- Append an entry to `progress.txt` documenting:
  - Timestamp
  - Action taken
  - Verification result
  - Next planned action
- Update status in `STATE.md` and `ROADMAP.md`.
- Loop back to Step 1.

---

## Safeguards & Loop Rules
1. **Never Give Up on First Error**: If a build or test fails, analyze compiler output and resolve it.
2. **Verification is Mandatory**: An iteration is never marked complete without passing build/test checks.
3. **Keep Logs Concise**: Document facts, errors resolved, and files touched.
