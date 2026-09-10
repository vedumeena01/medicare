import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    const clean = db.resetDatabase();
    return NextResponse.json({ success: true, data: clean });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to reset database' }, { status: 500 });
  }
}
