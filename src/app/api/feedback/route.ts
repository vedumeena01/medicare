import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const feedback = db.getFeedback();
    return NextResponse.json({ success: true, feedback });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error)?.message || 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.rating || !body.category || !body.description) {
      return NextResponse.json(
        { error: 'Rating, category, and description are required fields.' },
        { status: 400 }
      );
    }

    const saved = db.saveFeedback({
      userId: body.userId || 'user-anon',
      userName: body.userName || 'Anonymous Patient',
      rating: Number(body.rating),
      category: body.category,
      description: String(body.description).trim(),
      deviceDetails: body.deviceDetails || {},
    });

    return NextResponse.json({ success: true, feedback: saved });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error)?.message || 'Failed to save feedback' },
      { status: 500 }
    );
  }
}
