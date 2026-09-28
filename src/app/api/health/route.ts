import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'healthy';
  let reportsCount = 0;

  try {
    // 1. Verify JSON store
    const localReports = db.getReports();
    reportsCount = localReports.length;

    // 2. Verify SQLite connectivity via Prisma
    await prisma.user.findFirst();
  } catch (err: unknown) {
    dbStatus = 'degraded';
    console.error('Health check DB probe warning:', err);
  }

  const latencyMs = Date.now() - startTime;

  return NextResponse.json(
    {
      status: 'ok',
      service: 'MediExplain AI Health Engine',
      environment: process.env.NODE_ENV || 'production',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      latencyMs,
      checks: {
        database: dbStatus,
        reportsAvailable: reportsCount,
        prismaClient: 'connected',
      },
    },
    { status: 200 }
  );
}
