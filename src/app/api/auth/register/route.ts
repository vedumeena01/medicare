import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, createSessionToken, setSessionCookie } from '@/lib/auth';
import { UserProfile } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, mobile, age, gender, language } = body;

    // 1. Validate required inputs
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Please provide a valid full name (at least 2 characters).' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 2. Check if user already exists in Prisma or local DB
    try {
      const existing = await db.prisma.user.findUnique({
        where: { email: cleanEmail },
      });
      if (existing) {
        return NextResponse.json({ error: 'An account with this email address already exists. Please log in.' }, { status: 409 });
      }
    } catch {}

    // 3. Cryptographically hash password
    const passwordHash = await hashPassword(password);

    // 4. Create User Record
    const newUser: UserProfile = {
      id: 'usr-' + crypto.randomUUID(),
      name: name.trim(),
      email: cleanEmail,
      mobile: mobile ? mobile.trim() : '+91 98765 00000',
      age: typeof age === 'number' ? age : 28,
      gender: gender === 'Female' || gender === 'Other' ? gender : 'Male',
      language: language === 'hi' ? 'hi' : 'en',
    };

    // Save to local JSON store and persist in SQLite Prisma
    db.updateUser(newUser);

    try {
      await db.prisma.user.create({
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          mobile: newUser.mobile,
          passwordHash,
          age: newUser.age,
          gender: newUser.gender,
          language: newUser.language,
        },
      });
    } catch (err: unknown) {
      console.warn('[Prisma User Register Error]:', (err as Error)?.message);
    }

    // 5. Create secure session token and set HTTP-only cookie
    const token = createSessionToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });

    const response = NextResponse.json({
      success: true,
      user: newUser,
      message: 'Account registered successfully.',
    });

    setSessionCookie(response, token);
    return response;
  } catch (error: unknown) {
    console.error('Error in /api/auth/register:', error);
    return NextResponse.json(
      { error: (error as Error)?.message || 'Failed to register account' },
      { status: 500 }
    );
  }
}
