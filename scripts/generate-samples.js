const fs = require('fs');
const path = require('path');

const samplesDir = path.join(__dirname, '..', 'public', 'samples');
if (!fs.existsSync(samplesDir)) {
  fs.mkdirSync(samplesDir, { recursive: true });
}

function createSimplePdf(lines) {
  let contentStream = 'BT\n/F1 16 Tf\n50 740 Td\n';
  let y = 740;
  
  lines.forEach((item, idx) => {
    if (idx === 0) {
      contentStream += `(${escapePdf(item.text)}) Tj\n`;
    } else {
      const font = item.font || '/F2';
      const size = item.size || 11;
      const dy = item.dy || -22;
      y += dy;
      contentStream += `ET\nBT\n${font} ${size} Tf\n50 ${y} Td\n(${escapePdf(item.text)}) Tj\n`;
    }
  });
  contentStream += 'ET\n';

  const streamBuf = Buffer.from(contentStream, 'latin1');
  const streamLength = streamBuf.length;

  const objects = [];
  objects[1] = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  objects[2] = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  objects[3] = '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >> >> /Contents 7 0 R >>\nendobj\n';
  objects[4] = '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n';
  objects[5] = '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';
  objects[6] = '6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>\nendobj\n';
  objects[7] = `7 0 obj\n<< /Length ${streamLength} >>\nstream\n${contentStream}endstream\nendobj\n`;

  let pdf = '%PDF-1.4\n';
  const offsets = [];
  for (let i = 1; i <= 7; i++) {
    offsets[i] = Buffer.byteLength(pdf, 'latin1');
    pdf += objects[i];
  }

  const startXref = Buffer.byteLength(pdf, 'latin1');
  pdf += 'xref\n0 8\n0000000000 65535 f \n';
  for (let i = 1; i <= 7; i++) {
    pdf += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  }
  pdf += 'trailer\n<< /Size 8 /Root 1 0 R >>\nstartxref\n' + startXref + '\n%%EOF\n';

  return Buffer.from(pdf, 'latin1');
}

function escapePdf(str) {
  return str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

// 1. CBC & Lipid Blood Test Report
const cbcLines = [
  { text: 'METRO DIAGNOSTICS & PATHOLOGY LABORATORY', font: '/F1', size: 15, dy: 0 },
  { text: 'NABL Accredited Healthcare Lab | ISO 15189 Certified', font: '/F3', size: 9, dy: -14 },
  { text: '------------------------------------------------------------------------------------------------------------------', font: '/F2', size: 10, dy: -14 },
  { text: 'Patient Name: Vedprakash                   Age / Gender: 28 Y / Male', font: '/F1', size: 11, dy: -18 },
  { text: 'Referred By: Dr. Rajesh Sharma            Sample Date: 20 June 2026', font: '/F2', size: 10, dy: -15 },
  { text: 'Report ID: MED-2026-CBC-8821              Collection: 07:30 AM (Fasting)', font: '/F2', size: 10, dy: -15 },
  { text: '------------------------------------------------------------------------------------------------------------------', font: '/F2', size: 10, dy: -15 },
  { text: 'TEST NAME                              OBSERVED VALUE    UNIT         REFERENCE RANGE     FLAG', font: '/F1', size: 9, dy: -18 },
  { text: '------------------------------------------------------------------------------------------------------------------', font: '/F2', size: 9, dy: -12 },
  { text: 'Hemoglobin (Hb)                        10.8              g/dL         12.0 - 16.0         LOW *', font: '/F1', size: 10, dy: -16 },
  { text: 'Red Blood Cell (RBC) Count             4.2               mill/mcL     4.0 - 5.5           NORMAL', font: '/F2', size: 10, dy: -16 },
  { text: 'White Blood Cell (WBC) Count           8,500             /mcL         4,000 - 11,000      NORMAL', font: '/F2', size: 10, dy: -16 },
  { text: 'Platelet Count                         2.5               Lakhs/mcL    1.5 - 4.0           NORMAL', font: '/F2', size: 10, dy: -16 },
  { text: 'Fasting Blood Sugar (Glucose)          140               mg/dL        70 - 110            HIGH *', font: '/F1', size: 10, dy: -18 },
  { text: 'Total Cholesterol                      210               mg/dL        < 200               HIGH *', font: '/F1', size: 10, dy: -16 },
  { text: 'LDL Cholesterol (Bad Fat)              170               mg/dL        < 100               HIGH *', font: '/F1', size: 10, dy: -16 },
  { text: 'HDL Cholesterol (Good Fat)             40                mg/dL        > 40                BORDERLINE', font: '/F2', size: 10, dy: -16 },
  { text: 'Serum Triglycerides                    135               mg/dL        < 150               NORMAL', font: '/F2', size: 10, dy: -16 },
  { text: 'Serum Creatinine                       0.9               mg/dL        0.7 - 1.3           NORMAL', font: '/F2', size: 10, dy: -16 },
  { text: 'Blood Urea Nitrogen (BUN)              14                mg/dL        7 - 20              NORMAL', font: '/F2', size: 10, dy: -16 },
  { text: '------------------------------------------------------------------------------------------------------------------', font: '/F2', size: 9, dy: -14 },
  { text: 'CLINICAL REMARKS & INTERPRETATION:', font: '/F1', size: 10, dy: -18 },
  { text: '1. Hemoglobin (10.8 g/dL) reveals mild microcytic anemia. Iron studies advised.', font: '/F2', size: 9, dy: -14 },
  { text: '2. Fasting glucose (140 mg/dL) & elevated LDL (170 mg/dL) warrant medical evaluation.', font: '/F2', size: 9, dy: -14 },
  { text: '3. Follow up with primary physician or endocrinologist for HbA1c testing.', font: '/F2', size: 9, dy: -14 },
  { text: 'End of Report  |  Verified by: Dr. Anita Roy, MD (Pathology)', font: '/F3', size: 8, dy: -25 }
];

fs.writeFileSync(path.join(samplesDir, 'Sample_CBC_Blood_Test_Report.pdf'), createSimplePdf(cbcLines));
console.log('Created Sample_CBC_Blood_Test_Report.pdf');

// 2. Thyroid Profile Report
const thyroidLines = [
  { text: 'APEX ENDOCRINE & PATHOLOGY SPECIALISTS', font: '/F1', size: 15, dy: 0 },
  { text: 'Super Speciality Hormone & Metabolic Diagnostic Center', font: '/F3', size: 9, dy: -14 },
  { text: '------------------------------------------------------------------------------------------------------------------', font: '/F2', size: 10, dy: -14 },
  { text: 'Patient Name: Sunita (Mother)              Age / Gender: 54 Y / Female', font: '/F1', size: 11, dy: -18 },
  { text: 'Referred By: Dr. Ananya Verma              Sample Date: 15 May 2026', font: '/F2', size: 10, dy: -15 },
  { text: 'Report ID: APX-THY-2026-4409               Method: Chemiluminescence Immunoassay (CLIA)', font: '/F2', size: 9, dy: -15 },
  { text: '------------------------------------------------------------------------------------------------------------------', font: '/F2', size: 10, dy: -15 },
  { text: 'TEST NAME                              OBSERVED VALUE    UNIT         REFERENCE RANGE     STATUS', font: '/F1', size: 9, dy: -18 },
  { text: '------------------------------------------------------------------------------------------------------------------', font: '/F2', size: 9, dy: -12 },
  { text: 'TSH (Ultrasensitive 3rd Gen)           2.8               uIU/mL       0.4 - 4.2           OPTIMAL', font: '/F1', size: 10, dy: -16 },
  { text: 'Total Triiodothyronine (T3)            1.2               ng/mL        0.8 - 2.0           NORMAL', font: '/F2', size: 10, dy: -16 },
  { text: 'Total Thyroxine (T4)                   8.4               ug/dL        5.1 - 14.1          NORMAL', font: '/F2', size: 10, dy: -16 },
  { text: 'Free T3 (FT3)                          3.1               pg/mL        2.3 - 4.2           NORMAL', font: '/F2', size: 10, dy: -16 },
  { text: 'Free T4 (FT4)                          1.15              ng/dL        0.8 - 1.8           NORMAL', font: '/F2', size: 10, dy: -16 },
  { text: '------------------------------------------------------------------------------------------------------------------', font: '/F2', size: 9, dy: -14 },
  { text: 'INTERPRETATION:', font: '/F1', size: 10, dy: -18 },
  { text: 'Euthyroid state observed under current maintenance dosage. No dosage adjustment indicated.', font: '/F2', size: 9, dy: -14 },
  { text: 'Routine re-evaluation recommended after 6 months.', font: '/F2', size: 9, dy: -14 },
  { text: 'End of Report  |  Chief Biochemist: Dr. K. Ramanathan', font: '/F3', size: 8, dy: -25 }
];

fs.writeFileSync(path.join(samplesDir, 'Sample_Thyroid_Profile_Report.pdf'), createSimplePdf(thyroidLines));
console.log('Created Sample_Thyroid_Profile_Report.pdf');

// 3. HbA1c Diabetes Report
const diabetesLines = [
  { text: 'CAREPLUS DIABETES & METABOLIC CARE LAB', font: '/F1', size: 15, dy: 0 },
  { text: 'Advanced Glycated Hemoglobin & Lipid Testing', font: '/F3', size: 9, dy: -14 },
  { text: '------------------------------------------------------------------------------------------------------------------', font: '/F2', size: 10, dy: -14 },
  { text: 'Patient Name: Ramesh (Father)              Age / Gender: 58 Y / Male', font: '/F1', size: 11, dy: -18 },
  { text: 'Referred By: Dr. Ananya Verma              Sample Date: 18 June 2026', font: '/F2', size: 10, dy: -15 },
  { text: 'Report ID: CP-HBA1C-99210                  Sample: Whole Blood EDTA (HPLC Gold Standard)', font: '/F2', size: 9, dy: -15 },
  { text: '------------------------------------------------------------------------------------------------------------------', font: '/F2', size: 10, dy: -15 },
  { text: 'TEST NAME                              OBSERVED VALUE    UNIT         REFERENCE RANGE     INTERPRETATION', font: '/F1', size: 9, dy: -18 },
  { text: '------------------------------------------------------------------------------------------------------------------', font: '/F2', size: 9, dy: -12 },
  { text: 'HbA1c (Glycated Hemoglobin)            7.4               %            < 5.7 Normal        ELEVATED (Diabetic) *', font: '/F1', size: 10, dy: -16 },
  { text: 'Estimated Average Glucose (eAG)        165               mg/dL        < 117 Normal        HIGH *', font: '/F1', size: 10, dy: -16 },
  { text: 'Fasting Blood Glucose                  132               mg/dL        70 - 100            HIGH *', font: '/F2', size: 10, dy: -16 },
  { text: 'Post Prandial Blood Glucose (2h)       195               mg/dL        < 140               HIGH *', font: '/F2', size: 10, dy: -16 },
  { text: '------------------------------------------------------------------------------------------------------------------', font: '/F2', size: 9, dy: -14 },
  { text: 'HbA1c REFERENCE CRITERIA (ADA Guidelines):', font: '/F1', size: 10, dy: -18 },
  { text: 'Normal: Below 5.7%  |  Prediabetes: 5.7% - 6.4%  |  Diabetes: 6.5% or above', font: '/F2', size: 9, dy: -14 },
  { text: 'Result indicates suboptimal glycemic regulation over the preceding 90-120 days.', font: '/F2', size: 9, dy: -14 },
  { text: 'End of Report  |  Consultant Diabetologist: Dr. Ananya Verma', font: '/F3', size: 8, dy: -25 }
];

fs.writeFileSync(path.join(samplesDir, 'Sample_HbA1c_Diabetes_Report.pdf'), createSimplePdf(diabetesLines));
console.log('Created Sample_HbA1c_Diabetes_Report.pdf');

// 4. Doctor Prescription (PDF + SVG)
const prescriptionLines = [
  { text: 'MAX SUPER SPECIALITY HOSPITAL', font: '/F1', size: 16, dy: 0 },
  { text: 'Department of Cardiology & Internal Medicine  |  Tel: +91 11 2651 5050', font: '/F3', size: 9, dy: -14 },
  { text: 'Dr. Rajesh Sharma, MD (Med), DM (Cardiology), FACC', font: '/F1', size: 11, dy: -16 },
  { text: 'Reg No: MCI-2008-41029  |  OPD Room No: 204', font: '/F2', size: 9, dy: -12 },
  { text: '==================================================================================================================', font: '/F2', size: 10, dy: -14 },
  { text: 'Patient: Vedprakash                     Age: 28 Y / Male          Date: 20 June 2026', font: '/F1', size: 10, dy: -16 },
  { text: 'Diagnosis: Mild Dyslipidemia with borderline Glycemia & Iron Insufficiency', font: '/F2', size: 10, dy: -15 },
  { text: '------------------------------------------------------------------------------------------------------------------', font: '/F2', size: 10, dy: -14 },
  { text: 'Rx (Prescription):', font: '/F1', size: 12, dy: -18 },
  { text: '1. Tab. Dolo 650mg                    (Paracetamol)             1 Tab SOS after meals (Max 3/day)', font: '/F1', size: 10, dy: -18 },
  { text: '2. Tab. Augmentin 625mg               (Amox + Clavulanic)       1 Tab Twice daily x 5 Days (After food)', font: '/F1', size: 10, dy: -16 },
  { text: '3. Tab. Pantoprazole 40mg             (Pantocid)                1 Tab Morning empty stomach x 14 Days', font: '/F1', size: 10, dy: -16 },
  { text: '4. Cap. Vitamin D3 60,000 IU          (Cholecalciferol)         1 Cap Weekly with warm milk x 8 Weeks', font: '/F1', size: 10, dy: -16 },
  { text: '5. Tab. Amlodipine 5mg                (BP Care)                 1 Tab Once daily morning after food', font: '/F1', size: 10, dy: -16 },
  { text: '------------------------------------------------------------------------------------------------------------------', font: '/F2', size: 10, dy: -16 },
  { text: 'General Advice & Diet:', font: '/F1', size: 10, dy: -16 },
  { text: '- 30 minutes brisk walking daily. Reduce deep-fried food and refined sugar.', font: '/F2', size: 9, dy: -14 },
  { text: '- Review after 4 weeks with fresh Fasting Glucose and Lipid Panel.', font: '/F2', size: 9, dy: -14 },
  { text: 'Doctor Signature: [ Dr. Rajesh Sharma, MD, DM ]', font: '/F1', size: 10, dy: -25 }
];

fs.writeFileSync(path.join(samplesDir, 'Sample_Doctor_Prescription.pdf'), createSimplePdf(prescriptionLines));
console.log('Created Sample_Doctor_Prescription.pdf');

// Also create an SVG version of the prescription for instant visual demo & image uploads
const prescriptionSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <defs>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
  </defs>
  <!-- Background Paper -->
  <rect width="800" height="1000" fill="#fcfdfd" stroke="#cbd5e1" stroke-width="2"/>
  
  <!-- Clinic Header -->
  <rect x="0" y="0" width="800" height="130" fill="url(#headerGrad)"/>
  <circle cx="50" cy="65" r="30" fill="#ffffff" opacity="0.2"/>
  <path d="M42 65 L58 65 M50 57 L50 73" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
  <text x="95" y="52" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="bold" fill="#ffffff">MAX SUPER SPECIALITY HOSPITAL</text>
  <text x="95" y="76" font-family="Helvetica, Arial, sans-serif" font-size="13" fill="#93c5fd">Department of Cardiology &amp; Internal Medicine</text>
  <text x="95" y="96" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#bfdbfe">Dr. Rajesh Sharma, MD, DM (Cardiology), FACC  |  Reg No: MCI-2008-41029</text>
  <text x="630" y="65" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#bfdbfe">Ph: +91 11 2651 5050</text>
  <text x="630" y="82" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#bfdbfe">OPD Room No: 204</text>

  <!-- Patient Details Bar -->
  <rect x="25" y="145" width="750" height="70" rx="8" fill="#f1f5f9" stroke="#e2e8f0"/>
  <text x="45" y="172" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">Patient Name: <tspan font-weight="normal">Vedprakash</tspan></text>
  <text x="320" y="172" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">Age/Gender: <tspan font-weight="normal">28 Y / Male</tspan></text>
  <text x="560" y="172" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">Date: <tspan font-weight="normal">20 June 2026</tspan></text>
  <text x="45" y="198" font-family="Helvetica, Arial, sans-serif" font-size="12" font-weight="bold" fill="#475569">Clinical Diagnosis: <tspan font-weight="normal" fill="#0f172a">Mild Dyslipidemia + Borderline Fasting Glycemia &amp; Low Hemoglobin</tspan></text>

  <!-- Rx Symbol -->
  <text x="45" y="275" font-family="Georgia, serif" font-size="44" font-weight="bold" fill="#2563eb">Rx</text>
  
  <!-- Medicines Table -->
  <g transform="translate(45, 300)">
    <!-- Med 1 -->
    <rect x="0" y="0" width="710" height="75" rx="8" fill="#ffffff" stroke="#e2e8f0"/>
    <circle cx="25" cy="28" r="8" fill="#dbeafe"/>
    <text x="21" y="32" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#1d4ed8">1</text>
    <text x="45" y="28" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="bold" fill="#0f172a">Tab. DOLO 650 mg (Paracetamol)</text>
    <text x="45" y="52" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="#64748b">Dosage: 1 Tablet as needed (SOS) after food  |  Frequency: Max 3 times/day</text>
    <rect x="580" y="18" width="110" height="26" rx="4" fill="#eff6ff"/>
    <text x="595" y="35" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#2563eb">For Mild Fever/Pain</text>

    <!-- Med 2 -->
    <rect x="0" y="90" width="710" height="75" rx="8" fill="#ffffff" stroke="#e2e8f0"/>
    <circle cx="25" cy="118" r="8" fill="#dbeafe"/>
    <text x="21" y="122" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#1d4ed8">2</text>
    <text x="45" y="118" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="bold" fill="#0f172a">Tab. AUGMENTIN 625 mg (Amoxicillin + Clavulanic Acid)</text>
    <text x="45" y="142" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="#64748b">Dosage: 1 Tablet Twice Daily (1-0-1) after meals  |  Duration: 5 Days Course</text>
    <rect x="580" y="108" width="110" height="26" rx="4" fill="#fef3c7"/>
    <text x="600" y="125" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#d97706">Antibiotic Course</text>

    <!-- Med 3 -->
    <rect x="0" y="180" width="710" height="75" rx="8" fill="#ffffff" stroke="#e2e8f0"/>
    <circle cx="25" cy="208" r="8" fill="#dbeafe"/>
    <text x="21" y="212" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#1d4ed8">3</text>
    <text x="45" y="208" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="bold" fill="#0f172a">Tab. PANTOPRAZOLE 40 mg (Pantocid 40)</text>
    <text x="45" y="232" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="#64748b">Dosage: 1 Tablet early morning 30 mins before breakfast (1-0-0)  |  Duration: 14 Days</text>
    <rect x="580" y="198" width="110" height="26" rx="4" fill="#ecfdf5"/>
    <text x="600" y="215" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#059669">Antacid / Empty St.</text>

    <!-- Med 4 -->
    <rect x="0" y="270" width="710" height="75" rx="8" fill="#ffffff" stroke="#e2e8f0"/>
    <circle cx="25" cy="298" r="8" fill="#dbeafe"/>
    <text x="21" y="302" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#1d4ed8">4</text>
    <text x="45" y="298" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="bold" fill="#0f172a">Cap. VITAMIN D3 60,000 IU (Cholecalciferol)</text>
    <text x="45" y="322" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="#64748b">Dosage: 1 Capsule Once Weekly with a glass of warm milk  |  Duration: 8 Weeks</text>
    <rect x="580" y="288" width="110" height="26" rx="4" fill="#fdf4ff"/>
    <text x="605" y="305" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#9333ea">Weekly Dose</text>

    <!-- Med 5 -->
    <rect x="0" y="360" width="710" height="75" rx="8" fill="#ffffff" stroke="#e2e8f0"/>
    <circle cx="25" cy="388" r="8" fill="#dbeafe"/>
    <text x="21" y="392" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#1d4ed8">5</text>
    <text x="45" y="388" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="bold" fill="#0f172a">Tab. AMLODIPINE 5 mg</text>
    <text x="45" y="412" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="#64748b">Dosage: 1 Tablet once daily (1-0-0) after breakfast  |  Blood Pressure Monitor</text>
    <rect x="580" y="378" width="110" height="26" rx="4" fill="#fff1f2"/>
    <text x="615" y="395" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#e11d48">BP Control</text>
  </g>

  <!-- Lifestyle / Diet Advice -->
  <rect x="45" y="765" width="710" height="100" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
  <text x="65" y="792" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">Diet &amp; Lifestyle Instructions:</text>
  <text x="65" y="815" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="#475569">• 30 minutes brisk walking daily. Reduce processed carbohydrate &amp; deep-fried snacks.</text>
  <text x="65" y="835" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="#475569">• Drink 2.5-3 liters of water daily. Repeat Fasting Blood Sugar &amp; Lipid Profile after 4 weeks.</text>
  <text x="65" y="855" font-family="Helvetica, Arial, sans-serif" font-size="11" font-style="italic" fill="#64748b">* In case of medication rash, swelling, or dizziness, seek immediate medical consultation.</text>

  <!-- Doctor Signature & Stamp -->
  <line x1="530" y1="940" x2="730" y2="940" stroke="#475569" stroke-width="1.5"/>
  <text x="540" y="930" font-family="'Brush Script MT', cursive, sans-serif" font-size="24" fill="#1e3a8a">Dr. Rajesh Sharma</text>
  <text x="540" y="958" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a">Dr. Rajesh Sharma, MD, DM</text>
  <text x="540" y="974" font-family="Helvetica, Arial, sans-serif" font-size="10" fill="#64748b">Senior Consultant Cardiologist</text>
</svg>`;

fs.writeFileSync(path.join(samplesDir, 'Sample_Doctor_Prescription.svg'), prescriptionSvg);
console.log('Created Sample_Doctor_Prescription.svg');
