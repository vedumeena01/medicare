import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const medicines = db.getMedicines();
    return NextResponse.json({ success: true, medicines });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to fetch medicines' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const saved = db.saveMedicine(body);
    return NextResponse.json({ success: true, medicine: saved });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to save medicine' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }
    const updated = db.updateMedicineStatus(id, status);
    return NextResponse.json({ success: !!updated, medicine: updated });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to update medicine status' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing medicine id' }, { status: 400 });
    }
    const success = db.deleteMedicine(id);
    return NextResponse.json({ success });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to delete medicine' }, { status: 500 });
  }
}
