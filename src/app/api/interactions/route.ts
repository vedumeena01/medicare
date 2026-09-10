import { NextRequest, NextResponse } from 'next/server';
import { checkDrugInteractionsWithAI } from '@/lib/gemini';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { drugs, allergies, conditions, language } = body;

    if (!drugs || !Array.isArray(drugs) || drugs.length === 0) {
      return NextResponse.json(
        { error: 'Please provide at least one medication name to screen.' },
        { status: 400 }
      );
    }

    // Attempt to pull user allergies if not passed
    let effectiveAllergies = allergies;
    if (!effectiveAllergies || effectiveAllergies.length === 0) {
      const user = db.getUser();
      if (user?.allergies && user.allergies.length > 0) {
        effectiveAllergies = user.allergies;
      }
    }

    const result = await checkDrugInteractionsWithAI({
      drugs,
      allergies: effectiveAllergies || [],
      conditions: conditions || [],
      language: language || 'en',
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: unknown) {
    console.error('Error in /api/interactions:', error);
    return NextResponse.json(
      { error: (error as Error)?.message || 'Failed to check drug interactions' },
      { status: 500 }
    );
  }
}
