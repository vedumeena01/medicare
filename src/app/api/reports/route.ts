import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const reports = db.getReports();
    return NextResponse.json({ success: true, reports });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const saved = db.saveReport(body);
    return NextResponse.json({ success: true, report: saved });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to save report' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing report id' }, { status: 400 });
    }
    const success = db.deleteReport(id);
    return NextResponse.json({ success });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to delete report' }, { status: 500 });
  }
}
