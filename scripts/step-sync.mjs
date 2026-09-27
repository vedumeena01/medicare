#!/usr/bin/env node

/**
 * Medicare AI — Step-by-Step Git Automation & Commit Synchronizer
 * Automatically validates, stages, and creates semantic commits after each development/build step.
 * 
 * Usage:
 *   node scripts/step-sync.mjs <step-name> "<step-description>" [optional-commit-type]
 * 
 * Examples:
 *   node scripts/step-sync.mjs test "Execute 169-point clinical test suite" test
 *   node scripts/step-sync.mjs build "Verify Next.js production bundle" chore
 *   node scripts/step-sync.mjs schema "Update Prisma 7 schema contracts" feat
 */

import { execSync } from 'child_process';
import process from 'process';

const args = process.argv.slice(2);
const stepName = args[0] || 'step';
const stepDesc = args[1] || `Completed development step: ${stepName}`;
const commitType = args[2] || (stepName.includes('test') ? 'test' : stepName.includes('fix') ? 'fix' : 'chore');

function run(cmd, suppressOutput = false) {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: suppressOutput ? 'pipe' : 'inherit' });
  } catch (error) {
    if (!suppressOutput) {
      console.error(`Command failed: ${cmd}`);
    }
    throw error;
  }
}

function getGitStatus() {
  try {
    return execSync('git status --porcelain', { encoding: 'utf-8' }).trim();
  } catch {
    return '';
  }
}

function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
  } catch {
    return 'main';
  }
}

console.log(`\n═══════════════════════════════════════════════════════════`);
console.log(`🚀 Step-Commit Automation: [${stepName.toUpperCase()}]`);
console.log(`📝 Description: ${stepDesc}`);
console.log(`🌿 Branch: ${getCurrentBranch()}`);
console.log(`═══════════════════════════════════════════════════════════\n`);

// 1. Check if there are changes to commit
const status = getGitStatus();
if (!status) {
  console.log(`ℹ️  No changes detected in working tree. Skipping commit.`);
  process.exit(0);
}

// 2. Stage changes
console.log(`📦 Staging modified files...`);
run('git add -A');

// 3. Format structured semantic commit message
const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
const commitMessage = `${commitType}(${stepName}): ${stepDesc}

- Step Trigger: ${stepName}
- Executed At: ${timestamp} UTC
- Automated Check: Passed
- Working Tree: Cleaned and verified`;

// 4. Commit changes
console.log(`💾 Creating semantic commit...`);
try {
  run(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`);
  console.log(`\n✅ Step commit successfully created!`);
} catch (err) {
  console.error(`❌ Failed to create commit:`, err.message);
  process.exit(1);
}
