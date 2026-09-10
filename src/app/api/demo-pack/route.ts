import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const demoFiles = [
    {
      id: 'demo-cbc',
      title: 'Complete Blood Count (CBC) & Lipid Panel',
      titleHi: 'कम्पलीट ब्लड काउंट (CBC) और लिपिड टेस्ट',
      fileName: 'Sample_CBC_Blood_Test_Report.pdf',
      downloadUrl: '/samples/Sample_CBC_Blood_Test_Report.pdf',
      type: 'Blood Test',
      highlights: ['Hemoglobin 10.8 g/dL (Mild Anemia)', 'Fasting Sugar 140 mg/dL (Elevated)', 'LDL 170 mg/dL (High)'],
      summary: 'Ideal for demonstrating multi-parameter blood work analysis, abnormal risk warnings, and lifestyle suggestions.',
      targetReportId: 'rep-cbc-june-2026',
    },
    {
      id: 'demo-hba1c',
      title: 'Diabetes Glycated Hemoglobin (HbA1c) Panel',
      titleHi: 'डायबिटीज HbA1c और ब्लड शुगर टेस्ट',
      fileName: 'Sample_HbA1c_Diabetes_Report.pdf',
      downloadUrl: '/samples/Sample_HbA1c_Diabetes_Report.pdf',
      type: 'Blood Test',
      highlights: ['HbA1c 7.4% (Diabetic Range)', 'Average Glucose 165 mg/dL', 'Post-Prandial 195 mg/dL'],
      summary: 'Demonstrates chronic illness risk assessment, glucose control metrics, and diabetic dietary advice.',
      targetReportId: 'rep-hba1c-june-2026',
    },
    {
      id: 'demo-thyroid',
      title: 'Thyroid Function Test (TSH, T3, T4)',
      titleHi: 'थायरॉयड प्रोफाइल टेस्ट (TSH, T3, T4)',
      fileName: 'Sample_Thyroid_Profile_Report.pdf',
      downloadUrl: '/samples/Sample_Thyroid_Profile_Report.pdf',
      type: 'Blood Test',
      highlights: ['TSH 2.8 uIU/mL (Optimal)', 'T3 & T4 in Healthy Limits'],
      summary: 'Demonstrates normal hormone profile assessment and reassuring diagnostic interpretation.',
      targetReportId: 'rep-thyroid-may-2026',
    },
    {
      id: 'demo-rx',
      title: 'Physician Multi-Drug Prescription Slip',
      titleHi: 'डॉक्टर का प्रिस्क्रिप्शन पर्चा (5 दवाएं)',
      fileName: 'Sample_Doctor_Prescription.pdf',
      downloadUrl: '/samples/Sample_Doctor_Prescription.pdf',
      svgUrl: '/samples/Sample_Doctor_Prescription.svg',
      type: 'Prescription',
      highlights: ['Dolo 650mg (SOS)', 'Augmentin 625mg (5-day antibiotic)', 'Pantoprazole 40mg (Empty Stomach)', 'Vitamin D3 60K'],
      summary: 'Perfect for showcasing automated medicine extraction, dosage frequency detection, and schedule creation.',
      targetReportId: 'rep-cbc-june-2026',
    },
  ];

  return NextResponse.json({ success: true, samples: demoFiles });
}

export async function POST() {
  try {
    const loadedData = db.loadDemoData();
    return NextResponse.json({
      success: true,
      message: 'Demo dataset loaded successfully with 4 sample reports, 5 medicines, and upcoming appointments.',
      data: loadedData,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error)?.message || 'Failed to load demo pack' },
      { status: 500 }
    );
  }
}
