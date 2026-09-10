import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const appointments = db.getAppointments();
    const doctors = db.getDoctors();
    return NextResponse.json({ success: true, appointments, doctors });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.doctorId || !body.date || !body.timeSlot) {
      return NextResponse.json({ error: 'Doctor, date and time slot are required' }, { status: 400 });
    }
    const appointment = db.bookAppointment(body);
    return NextResponse.json({ success: true, appointment });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to book appointment' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 });
    }
    const updated = db.updateAppointmentStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, appointment: updated });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to update appointment' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing appointment id' }, { status: 400 });
    }
    const success = db.deleteAppointment(id);
    return NextResponse.json({ success });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to delete appointment' }, { status: 500 });
  }
}
