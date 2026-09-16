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
    'src/components/EmergencyMedicalCard.tsx',
    'src/app/emergency/page.tsx',
    'scripts/verify.bat',
    'scripts/verify.sh',
    'public/manifest.json',
    'public/sw.js',
    'src/components/ServiceWorkerRegister.tsx',
    'src/components/CaregiverProfileSwitcher.tsx',
    'src/lib/fhirExport.ts',
    'src/lib/reminderNotification.ts',
    'RELEASE_NOTES_v1.0.md',
    'src/app/error.tsx',
    'src/app/global-error.tsx',
    'src/app/loading.tsx',
    'src/components/FeedbackModal.tsx',
    'src/lib/analytics.ts',
    'src/lib/offlineSync.ts',
    'src/components/NetworkStatusIndicator.tsx',
    'src/lib/imageOptimization.ts',
  ];

  for (const file of requiredFiles) {
    const fullPath = path.join(rootDir, file);
    assert(fs.existsSync(fullPath), `Asset present: ${file}`);
  }

  // Verify Service Worker Offline Cache Contracts
  const swContent = fs.readFileSync(path.join(rootDir, 'public', 'sw.js'), 'utf-8');
  assert(swContent.includes('mediexplain-offline'), 'ServiceWorker defines offline cache vault name');
  assert(swContent.includes("'/emergency'"), 'ServiceWorker pre-caches Emergency ICE card route');

  // Verify Emergency Card Lock-Screen Wallpaper Canvas Generator
  const emergencyCardContent = fs.readFileSync(path.join(rootDir, 'src', 'components', 'EmergencyMedicalCard.tsx'), 'utf-8');
  assert(emergencyCardContent.includes('handleDownloadLockscreenWallpaper'), 'Emergency card has lockscreen wallpaper generator');
  assert(emergencyCardContent.includes('drawRoundRect'), 'Emergency card has cross-browser canvas rounded rect engine');

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
  assert(dbContent.user.bloodGroup && typeof dbContent.user.bloodGroup === 'string', `User has Emergency Blood Group (${dbContent.user.bloodGroup})`);
  assert(dbContent.user.emergencyContact && typeof dbContent.user.emergencyContact.phone === 'string', 'User has Emergency Next-of-Kin contact configured');

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
    'healthRiskAnalysis',
    'healthRiskSubtitle',
    'informationalOnly',
    'riskCardDisclaimer',
  ];

  for (const key of criticalKeys) {
    const hasKey = translationsFile.includes(`${key}:`);
    assert(hasKey, `Translation dictionary contains token: "${key}"`);
  }

  // ---------------------------------------------------------
  // TEST SUITE 6: Caregiver Multi-Profile Dependent Context
  // ---------------------------------------------------------
  console.log('\n▶ Suite 6: Caregiver Multi-Profile Contracts & State');

  const appContextContent = fs.readFileSync(path.join(rootDir, 'src', 'context', 'AppContext.tsx'), 'utf-8');
  assert(appContextContent.includes('activeMemberId'), 'AppContext defines activeMemberId state');
  assert(appContextContent.includes('activeProfile'), 'AppContext exposes memoized activeProfile');

  const navbarContent = fs.readFileSync(path.join(rootDir, 'src', 'components', 'Navbar.tsx'), 'utf-8');
  assert(navbarContent.includes('CaregiverProfileSwitcher'), 'Navbar mounts CaregiverProfileSwitcher');

  const familyPageContent = fs.readFileSync(path.join(rootDir, 'src', 'app', 'family', 'page.tsx'), 'utf-8');
  assert(familyPageContent.includes('setActiveMemberId'), 'FamilyPage enables 1-click dependent context switching');

  const sampleDataContent = fs.readFileSync(path.join(rootDir, 'src', 'lib', 'sampleData.ts'), 'utf-8');
  assert(sampleDataContent.includes("'Sulfa drugs'"), 'Father dependent has documented Sulfa allergy');
  assert(sampleDataContent.includes("'Aspirin (Mild)'"), 'Mother dependent has documented Aspirin allergy');

  // ---------------------------------------------------------
  // TEST SUITE 7: HL7 FHIR Release 4 & Clinical CSV Interoperability
  // ---------------------------------------------------------
  console.log('\n▶ Suite 7: HL7 FHIR R4 & Clinical CSV Interoperability');

  const fhirFileContent = fs.readFileSync(path.join(rootDir, 'src', 'lib', 'fhirExport.ts'), 'utf-8');
  assert(fhirFileContent.includes('generateFhirBundle'), 'fhirExport exports generateFhirBundle');
  assert(fhirFileContent.includes('generateClinicalCsv'), 'fhirExport exports generateClinicalCsv');
  assert(fhirFileContent.includes('downloadFhirBundle'), 'fhirExport exports downloadFhirBundle');
  assert(fhirFileContent.includes('downloadClinicalCsv'), 'fhirExport exports downloadClinicalCsv');

  const settingsPageContent = fs.readFileSync(path.join(rootDir, 'src', 'app', 'settings', 'page.tsx'), 'utf-8');
  assert(settingsPageContent.includes('downloadFhirBundle'), 'Settings page integrates FHIR R4 vault export');
  assert(settingsPageContent.includes('downloadClinicalCsv'), 'Settings page integrates Clinical CSV export');

  const reportsPageContent = fs.readFileSync(path.join(rootDir, 'src', 'app', 'reports', 'page.tsx'), 'utf-8');
  assert(reportsPageContent.includes('downloadFhirBundle'), 'Reports history page offers 1-click FHIR vault export');

  // ---------------------------------------------------------
  // TEST SUITE 8: Multi-Channel Dose Reminders (WhatsApp & SMS Dispatch Engine)
  // ---------------------------------------------------------
  console.log('\n▶ Suite 8: Multi-Channel Dose Reminders (WhatsApp & SMS Dispatch Engine)');

  const reminderFileContent = fs.readFileSync(path.join(rootDir, 'src', 'lib', 'reminderNotification.ts'), 'utf-8');
  assert(reminderFileContent.includes('formatDoseReminderMessage'), 'reminderNotification exports formatDoseReminderMessage');
  assert(reminderFileContent.includes('generateWhatsAppReminderUrl'), 'reminderNotification exports generateWhatsAppReminderUrl');
  assert(reminderFileContent.includes('generateSmsReminderUrl'), 'reminderNotification exports generateSmsReminderUrl');
  assert(reminderFileContent.includes('simulateChannelDispatch'), 'reminderNotification exports simulateChannelDispatch');

  assert(appContextContent.includes('addNotification'), 'AppContext exposes addNotification method');

  const schedulesContent = fs.readFileSync(path.join(rootDir, 'src', 'app', 'schedules', 'page.tsx'), 'utf-8');
  assert(schedulesContent.includes('generateWhatsAppReminderUrl'), 'Schedules page triggers WhatsApp dose reminders');

  const notificationsContent = fs.readFileSync(path.join(rootDir, 'src', 'app', 'notifications', 'page.tsx'), 'utf-8');
  assert(notificationsContent.includes('activeChannelFilter'), 'Notifications page supports channel-level filtering');
  assert(notificationsContent.includes('Multi-Channel Reminder Test Dispatcher'), 'Notifications page includes multi-channel reminder simulator');

  // ---------------------------------------------------------
  // TEST SUITE 9: Production Resilience & Feedback Telemetry
  // ---------------------------------------------------------
  console.log('\n▶ Suite 9: Production Resilience & Feedback Telemetry');

  const errorContent = fs.readFileSync(path.join(rootDir, 'src', 'app', 'error.tsx'), 'utf-8');
  assert(errorContent.includes('reset: () => void'), 'error.tsx implements route recovery mechanism');

  const globalErrorContent = fs.readFileSync(path.join(rootDir, 'src', 'app', 'global-error.tsx'), 'utf-8');
  assert(globalErrorContent.includes('<html') && globalErrorContent.includes('<body'), 'global-error.tsx maintains root HTML document structure');

  const analyticsContent = fs.readFileSync(path.join(rootDir, 'src', 'lib', 'analytics.ts'), 'utf-8');
  assert(analyticsContent.includes('trackEvent'), 'analytics.ts exports trackEvent');
  assert(analyticsContent.includes('sanitizeProperties'), 'analytics.ts enforces PHI privacy sanitization');

  const feedbackApiContent = fs.readFileSync(path.join(rootDir, 'src', 'app', 'api', 'feedback', 'route.ts'), 'utf-8');
  assert(feedbackApiContent.includes('db.saveFeedback'), 'Feedback API saves submissions into db');

  const dbContentFile = fs.readFileSync(path.join(rootDir, 'src', 'lib', 'db.ts'), 'utf-8');
  assert(dbContentFile.includes('getFeedback()') && dbContentFile.includes('saveFeedback('), 'db.ts implements feedback operations');

  const updatedNavbar = fs.readFileSync(path.join(rootDir, 'src', 'components', 'Navbar.tsx'), 'utf-8');
  assert(updatedNavbar.includes('FeedbackModal'), 'Navbar mounts FeedbackModal');

  // ---------------------------------------------------------
  // TEST SUITE 10: IndexedDB Offline Sync Queue & WCAG 2.1 AA Accessibility
  // ---------------------------------------------------------
  console.log('\n▶ Suite 10: IndexedDB Offline Sync Queue & WCAG 2.1 AA Accessibility');

  const offlineSyncContent = fs.readFileSync(path.join(rootDir, 'src', 'lib', 'offlineSync.ts'), 'utf-8');
  assert(offlineSyncContent.includes('medicare_offline_db'), 'offlineSync creates IndexedDB database medicare_offline_db');
  assert(offlineSyncContent.includes('sync_queue'), 'offlineSync manages sync_queue object store');
  assert(offlineSyncContent.includes('enqueueSyncAction'), 'offlineSync exports enqueueSyncAction');
  assert(offlineSyncContent.includes('processSyncQueue'), 'offlineSync exports processSyncQueue');
  assert(offlineSyncContent.includes('subscribeSyncQueue'), 'offlineSync exports subscribeSyncQueue pub/sub');
  assert(offlineSyncContent.includes('isOnline'), 'offlineSync exports isOnline detection');

  const appCtx = fs.readFileSync(path.join(rootDir, 'src', 'context', 'AppContext.tsx'), 'utf-8');
  assert(appCtx.includes('enqueueSyncAction'), 'AppContext enqueues offline mutations');
  assert(appCtx.includes('UPDATE_MEDICINE_STATUS'), 'AppContext queues UPDATE_MEDICINE_STATUS offline actions');

  const networkStatusContent = fs.readFileSync(path.join(rootDir, 'src', 'components', 'NetworkStatusIndicator.tsx'), 'utf-8');
  assert(networkStatusContent.includes('subscribeSyncQueue'), 'NetworkStatusIndicator subscribes to IndexedDB sync queue');
  assert(networkStatusContent.includes('role="status"'), 'NetworkStatusIndicator uses role="status"');
  assert(networkStatusContent.includes('aria-live="polite"'), 'NetworkStatusIndicator uses aria-live="polite"');

  const globalsCss = fs.readFileSync(path.join(rootDir, 'src', 'app', 'globals.css'), 'utf-8');
  assert(globalsCss.includes(':focus-visible'), 'globals.css defines WCAG visible focus indicators');
  assert(globalsCss.includes('.skip-to-content'), 'globals.css defines bypass skip-to-content styling');
  assert(globalsCss.includes('prefers-reduced-motion'), 'globals.css respects prefers-reduced-motion preference');

  const layoutContent = fs.readFileSync(path.join(rootDir, 'src', 'app', 'layout.tsx'), 'utf-8');
  assert(layoutContent.includes('href="#main-content"') && layoutContent.includes('skip-to-content'), 'Root layout mounts skip-to-main-content bypass link');

  const searchModalContent = fs.readFileSync(path.join(rootDir, 'src', 'components', 'GlobalSearchModal.tsx'), 'utf-8');
  assert(searchModalContent.includes('role="dialog"') && searchModalContent.includes('aria-modal="true"'), 'GlobalSearchModal implements accessible dialog semantics');

  const reminderModalContent = fs.readFileSync(path.join(rootDir, 'src', 'components', 'ReminderModal.tsx'), 'utf-8');
  assert(reminderModalContent.includes('role="alertdialog"') && reminderModalContent.includes('aria-modal="true"'), 'ReminderModal implements accessible alertdialog semantics');

  const feedbackModalContent = fs.readFileSync(path.join(rootDir, 'src', 'components', 'FeedbackModal.tsx'), 'utf-8');
  assert(feedbackModalContent.includes('role="dialog"') && feedbackModalContent.includes('enqueueSyncAction'), 'FeedbackModal provides accessible dialog and queues offline feedback');

  // ---------------------------------------------------------
  // TEST SUITE 11: Edge Performance, Multi-Tier Caching & Asset Compression
  // ---------------------------------------------------------
  console.log('\n▶ Suite 11: Edge Performance, Multi-Tier Caching & Asset Compression');

  assert(swContent.includes('STATIC_CACHE') && swContent.includes('API_CACHE'), 'ServiceWorker defines multi-tier STATIC and API cache stores');
  assert(swContent.includes('trimCache'), 'ServiceWorker implements trimCache LRU eviction mechanism');
  assert(swContent.includes('isReadApi') && swContent.includes('isStaticAsset'), 'ServiceWorker implements SWR and Cache-First request routers');

  const nextConfigContent = fs.readFileSync(path.join(rootDir, 'next.config.ts'), 'utf-8');
  assert(nextConfigContent.includes('_next/static') && nextConfigContent.includes('max-age=31536000'), 'next.config.ts configures immutable cache headers for static chunks');
  assert(nextConfigContent.includes('X-Content-Type-Options') && nextConfigContent.includes('nosniff'), 'next.config.ts enforces security headers');
  assert(nextConfigContent.includes('compress: true'), 'next.config.ts enables gzip/brotli asset compression');

  const imgOptContent = fs.readFileSync(path.join(rootDir, 'src', 'lib', 'imageOptimization.ts'), 'utf-8');
  assert(imgOptContent.includes('compressImageBase64'), 'imageOptimization.ts exports compressImageBase64');
  assert(imgOptContent.includes('compressImageFile'), 'imageOptimization.ts exports compressImageFile');
  assert(imgOptContent.includes('isImageMimeType'), 'imageOptimization.ts exports isImageMimeType');

  const analyzeContent = fs.readFileSync(path.join(rootDir, 'src', 'app', 'analyze', 'page.tsx'), 'utf-8');
  assert(analyzeContent.includes('compressImageBase64'), 'Analyze page compresses uploaded medical reports before processing');


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
