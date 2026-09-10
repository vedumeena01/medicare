import { NextRequest, NextResponse } from 'next/server';
import { analyzeMedicalDocumentWithAI } from '@/lib/gemini';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { base64Data, mimeType, fileName, reportType, language, selectedGoals } = body;

    if (!fileName) {
      return NextResponse.json(
        { error: 'Missing fileName in request' },
        { status: 400 }
      );
    }

    const result = await analyzeMedicalDocumentWithAI({
      base64Data,
      mimeType: mimeType || 'application/pdf',
      fileName,
      reportType: reportType || 'Blood Test',
      language: language || 'en',
      selectedGoals,
    });

    // Automatically persist report in database
    db.saveReport(result.report);

    return NextResponse.json({
      success: true,
      report: result.report,
      isLiveAI: result.isLiveAI,
      message: result.message,
    });
  } catch (error: unknown) {
    console.error('Error in /api/analyze-report:', error);
    return NextResponse.json(
      { error: (error as Error)?.message || 'Failed to process document' },
      { status: 500 }
    );
  }
}
