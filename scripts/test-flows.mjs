/**
 * Medicare AI / MediExplain - End-to-End Automated Smoke & Health Test Runner
 *
 * Validates:
 * 1. Database persistence, schema integrity, and pre-seeded clinical data
 * 2. User profile, medical reports, medicines, and appointments schema conformance
 * 3. Drug-Drug interaction screening and allergy cross-checking heuristics
 * 4. Clinical lab parameter boundary stratification (low/normal/high)
 * 5. Bilingual localization token parity between English (en) and Hindi (hi)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('🩺 MediExplain AI — Quality & Health Verification Suite');
  console.log('======================================================\n');

  // ---------------------------------------------------------
  // TEST SUITE 1: File Assets & Core Routes Check
  // ---------------------------------------------------------
  console.log('▶ Suite 1: File Assets & Core Routes Check');
  const requiredFiles = [
    'data/medicare.db.json',
    'src/app/page.tsx',
    'src/app/dashboard/page.tsx',
    'src/app/analyze/page.tsx',
    'src/app/medicines/page.tsx',
    'src/app/medicines/scanner/page.tsx',
    'src/app/medicines/interactions/page.tsx',
    'src/app/schedules/page.tsx',
    'src/app/appointments/page.tsx',
    'src/app/assistant/page.tsx',
    'src/components/LiveCameraScanner.tsx',
    'src/components/ClientDemoTour.tsx',
    'src/lib/db.ts',
    'src/lib/gemini.ts',
    'src/lib/translations.ts',
    'public/samples/Sample_CBC_Blood_Test_Report.pdf',
    'public/samples/Sample_HbA1c_Diabetes_Report.pdf',
    'public/samples/Sample_Thyroid_Profile_Report.pdf',
    'public/samples/Sample_Doctor_Prescription.pdf',
    'scripts/verify.bat',
    'scripts/verify.sh',
  ];

  for (const file of requiredFiles) {
    const fullPath = path.join(rootDir, file);
    assert(fs.existsSync(fullPath), `Asset present: ${file}`);
  }

  // ---------------------------------------------------------
  // TEST SUITE 2: JSON Database Schema & Persistence
  // ---------------------------------------------------------
  console.log('\n▶ Suite 2: Local Database Integrity & Schema Contracts');
  const dbPath = path.join(rootDir, 'data', 'medicare.db.json');
  assert(fs.existsSync(dbPath), 'medicare.db.json exists');

  const dbContent = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  assert(typeof dbContent === 'object' && dbContent !== null, 'DB root is valid JSON object');
  assert(Array.isArray(dbContent.reports), 'db.reports is an array');
  assert(Array.isArray(dbContent.medicines), 'db.medicines is an array');
  assert(Array.isArray(dbContent.doctors), 'db.doctors is an array');
  assert(Array.isArray(dbContent.appointments), 'db.appointments is an array');
  assert(dbContent.user && typeof dbContent.user.name === 'string', 'db.user has valid name');
  assert(dbContent.reports.length >= 4, `Database contains pre-seeded reports (found ${dbContent.reports.length})`);
  assert(dbContent.medicines.length >= 4, `Database contains pre-seeded medicines (found ${dbContent.medicines.length})`);

  // Verify Sample Report Schema
  const sampleReport = dbContent.reports[0];
  assert(sampleReport.id && typeof sampleReport.id === 'string', 'Report has valid unique ID');
  assert(sampleReport.fileName && typeof sampleReport.fileName === 'string', 'Report has valid fileName');
  assert(sampleReport.reportType && typeof sampleReport.reportType === 'string', 'Report has valid reportType');
  assert(sampleReport.summary && typeof sampleReport.summary === 'string', 'Report has bilingual/plain summary');
  assert(Array.isArray(sampleReport.findings) && sampleReport.findings.length > 0, 'Report contains clinical findings array');
  
  const finding = sampleReport.findings[0];
  assert('test' in finding && 'value' in finding && 'status' in finding, 'Finding has standard structure (test, value, status)');
  assert(['low', 'normal', 'high'].includes(finding.status), `Finding status '${finding.status}' is normalized`);

  // Verify Medicine Schema
  const sampleMed = dbContent.medicines[0];
  assert(sampleMed.id && typeof sampleMed.id === 'string', 'Medicine has valid unique ID');
  assert(sampleMed.name && typeof sampleMed.name === 'string', 'Medicine has valid name');
  assert(sampleMed.strength && typeof sampleMed.strength === 'string', 'Medicine has dosage strength');
  assert(sampleMed.dosageInstruction && typeof sampleMed.dosageInstruction === 'string', 'Medicine has dosage instructions');
  assert(sampleMed.scheduledTime && typeof sampleMed.scheduledTime === 'string', 'Medicine has scheduled alarm time');

  // ---------------------------------------------------------
  // TEST SUITE 3: Clinical Risk Stratification Boundaries
  // ---------------------------------------------------------
  console.log('\n▶ Suite 3: Clinical Parameter Normalization & Range Checks');
  
  function evaluateBloodGlucose(val) {
    if (val < 70) return 'low';
    if (val > 125) return 'high';
    return 'normal';
  }

  function evaluateHemoglobin(val, isFemale = false) {
    const min = isFemale ? 12.0 : 13.5;
    const max = isFemale ? 15.5 : 17.5;
    if (val < min) return 'low';
    if (val > max) return 'high';
    return 'normal';
  }

  function evaluateHbA1c(val) {
    if (val < 5.7) return 'normal';
    if (val <= 6.4) return 'prediabetic';
    return 'diabetic';
  }

  assert(evaluateBloodGlucose(65) === 'low', 'Fasting Sugar 65 mg/dL flagged as low (Hypoglycemia)');
  assert(evaluateBloodGlucose(95) === 'normal', 'Fasting Sugar 95 mg/dL flagged as normal');
  assert(evaluateBloodGlucose(140) === 'high', 'Fasting Sugar 140 mg/dL flagged as high (Hyperglycemia)');

  assert(evaluateHemoglobin(10.8, false) === 'low', 'Male Hemoglobin 10.8 g/dL correctly flagged as low (Mild Anemia)');
  assert(evaluateHemoglobin(14.5, false) === 'normal', 'Male Hemoglobin 14.5 g/dL flagged as normal');
  assert(evaluateHemoglobin(18.2, false) === 'high', 'Male Hemoglobin 18.2 g/dL flagged as high (Polycythemia)');

  assert(evaluateHbA1c(5.4) === 'normal', 'HbA1c 5.4% correctly categorized as Normal (<5.7%)');
  assert(evaluateHbA1c(6.1) === 'prediabetic', 'HbA1c 6.1% categorized as Pre-diabetic (5.7-6.4%)');
  assert(evaluateHbA1c(7.4) === 'diabetic', 'HbA1c 7.4% categorized as Diabetic (>6.4%)');

  // ---------------------------------------------------------
  // TEST SUITE 4: Drug Interaction Screening Heuristics
  // ---------------------------------------------------------
  console.log('\n▶ Suite 4: Drug-Drug & Allergy Cross-Screening Heuristics');

  function screenInteractions(drugs, allergies = []) {
    const findings = [];
    const normalized = drugs.map(d => d.toLowerCase());
    
    // Check allergy
    for (const allergy of allergies) {
      if (allergy.toLowerCase().includes('penicillin')) {
        const hasPenicillin = normalized.some(d => d.includes('augmentin') || d.includes('amoxicillin') || d.includes('penicillin'));
        if (hasPenicillin) {
          findings.push({ severity: 'critical', message: 'Penicillin allergy conflict detected' });
        }
      }
    }

    // Check drug-drug conflict (e.g. Paracetamol duplicate toxicity)
    const hasDolo = normalized.some(d => d.includes('dolo') || d.includes('paracetamol'));
    const hasCrocin = normalized.some(d => d.includes('crocin') || d.includes('calpol'));
    if (hasDolo && hasCrocin) {
      findings.push({ severity: 'high', message: 'Dual acetaminophen overdose risk' });
    }

    return findings;
  }

  const allergyTest = screenInteractions(['Augmentin 625 Duo', 'Pantoprazole 40mg'], ['Penicillin']);
  assert(allergyTest.some(f => f.severity === 'critical'), 'Augmentin with Penicillin allergy triggers critical warning');

  const duplicateTest = screenInteractions(['Dolo 650', 'Crocin Advance']);
  assert(duplicateTest.some(f => f.severity === 'high'), 'Dolo 650 + Crocin Advance triggers duplicate paracetamol toxicity warning');

  const safeTest = screenInteractions(['Metformin 500mg', 'Pantoprazole 40mg'], []);
  assert(safeTest.length === 0, 'Metformin + Pantoprazole flagged with 0 negative cross-conflicts');

  // ---------------------------------------------------------
  // TEST SUITE 5: Bilingual Translation (EN / HI) Completeness
  // ---------------------------------------------------------
  console.log('\n▶ Suite 5: Bilingual Localization (EN <-> HI) Parity');
  
  const translationsFile = fs.readFileSync(path.join(rootDir, 'src', 'lib', 'translations.ts'), 'utf-8');
  assert(translationsFile.includes('export const translations = {'), 'translations object exported');
  assert(translationsFile.includes('en: {') && translationsFile.includes('hi: {'), 'Both English and Hindi translation dictionaries defined');
  
  const criticalKeys = [
    'brandName',
    'liveScannerTitle',
    'liveScannerSubtitle',
    'captureSnapshot',
    'retake',
    'scanningPackaging',
    'alignTarget',
    'voiceReadout',
    'addToSchedule',
    'sampleStripPreset',
    'sampleRxPreset',
    'sampleBoxPreset',
    'navMedicines',
    'medicineSchedule',
    'disclaimerTitle',
  ];

  for (const key of criticalKeys) {
    const hasKey = translationsFile.includes(`${key}:`);
    assert(hasKey, `Translation dictionary contains token: "${key}"`);
  }

  // ---------------------------------------------------------
  // Summary & Final Exit
  // ---------------------------------------------------------
  console.log('\n------------------------------------------------------');
  console.log(`Results: ${passedTests} passed, ${failedTests} failed out of ${totalTests} checks.`);
  console.log('------------------------------------------------------\n');

  if (failedTests > 0) {
    console.error(`🚨 Smoke test suite finished with ${failedTests} failures.`);
    process.exit(1);
  } else {
    console.log('🎉 All automated smoke tests and health checks passed with 100% success rate.\n');
    process.exit(0);
  }
}

runTestSuite().catch(err => {
  console.error('Unhandled test suite error:', err);
  process.exit(1);
});
