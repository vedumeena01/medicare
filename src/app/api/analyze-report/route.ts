import { NextRequest, NextResponse } from 'next/server';
import { analyzeMedicalDocumentWithAI } from '@/lib/gemini';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { base64Data, mimeType, fileName, reportType, language, selectedGoals } = body;

    if (!fileName || typeof fileName !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid fileName in request' },
        { status: 400 }
      );
    }

    if (!base64Data || typeof base64Data !== 'string') {
      return NextResponse.json(
        { error: 'Missing document payload (base64Data).' },
        { status: 400 }
      );
    }

    // Limit base64 payload to max 15MB to prevent memory exhaustion
    if (base64Data.length > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Document payload exceeds the maximum allowed size of 15MB.' },
        { status: 413 }
      );
    }

    const result = await analyzeMedicalDocumentWithAI({
      base64Data,
      mimeType: mimeType || 'application/pdf',
      fileName: fileName.trim().substring(0, 255),
      reportType: reportType || 'Blood Test',
      language: language || 'en',
      selectedGoals,
    });

    if (!result.report) {
      return NextResponse.json(
        { error: 'Document could not be analyzed.' },
        { status: 500 }
      );
    }

    // Automatically persist verified report in database
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
