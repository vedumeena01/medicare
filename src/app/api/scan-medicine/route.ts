import { NextRequest, NextResponse } from 'next/server';
import { scanMedicineWithAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { base64Data, mimeType, language } = body;

    const result = await scanMedicineWithAI({
      base64Data,
      mimeType: mimeType || 'image/jpeg',
      language: language || 'en',
    });

    return NextResponse.json({
      success: true,
      medicine: result.medicine,
      isLiveAI: result.isLiveAI,
      message: result.message,
    });
  } catch (error: unknown) {
    console.error('Error in /api/scan-medicine:', error);
    return NextResponse.json(
      { error: (error as Error)?.message || 'Failed to scan medicine' },
      { status: 500 }
    );
  }
}
