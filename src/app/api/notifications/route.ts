import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const notifications = db.getNotifications();
    return NextResponse.json({ success: true, notifications });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.all) {
      db.markAllNotificationsRead();
      return NextResponse.json({ success: true });
    }
    if (body.id) {
      const ok = db.markNotificationRead(body.id);
      return NextResponse.json({ success: ok });
    }
    return NextResponse.json({ error: 'id or all flag is required' }, { status: 400 });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to update notifications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const item = db.addNotification(body);
    return NextResponse.json({ success: true, notification: item });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to create notification' }, { status: 500 });
  }
}
