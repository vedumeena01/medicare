import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const familyMembers = db.getFamilyMembers();
    return NextResponse.json({ success: true, familyMembers });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch family members';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.relation) {
      return NextResponse.json({ error: 'Name and relation are required' }, { status: 400 });
    }
    const member = db.addFamilyMember(body);
    return NextResponse.json({ success: true, familyMember: member });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to add family member';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing member id' }, { status: 400 });
    }
    const success = db.deleteFamilyMember(id);
    return NextResponse.json({ success });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete family member';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
