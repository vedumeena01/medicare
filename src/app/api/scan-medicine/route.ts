import { NextRequest, NextResponse } from 'next/server';
import { scanMedicineWithAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { base64Data, mimeType, language } = body;

    if (!base64Data || typeof base64Data !== 'string') {
      return NextResponse.json(
        { error: 'Missing medicine packaging image payload (base64Data).' },
        { status: 400 }
      );
    }

    if (base64Data.length > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image payload exceeds the maximum allowed size of 15MB.' },
        { status: 413 }
      );
    }

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
