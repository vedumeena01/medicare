import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const consultations = db.getConsultations();
    return NextResponse.json({ success: true, consultations });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to fetch consultations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.doctorName || !body.date) {
      return NextResponse.json({ error: 'Doctor name and consultation date are required' }, { status: 400 });
    }
    const consultation = db.saveConsultation(body);
    return NextResponse.json({ success: true, consultation });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to save consultation' }, { status: 500 });
  }
}
