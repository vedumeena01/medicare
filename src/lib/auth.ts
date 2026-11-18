import crypto from 'crypto';
import type { NextRequest, NextResponse } from 'next/server';
import { db } from './db';
import { UserProfile } from '@/types';

export const SESSION_COOKIE_NAME = 'medicare_session';
const SESSION_EXPIRY_DAYS = 7;
const SESSION_EXPIRY_SECONDS = SESSION_EXPIRY_DAYS * 24 * 60 * 60;

function getAuthSecret(): string {
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.trim().length >= 16) {
    return process.env.SESSION_SECRET.trim();
  }
  // Deterministic local secret derived for development if env not explicitly passed
  return 'medicare_secure_session_secret_default_k9823h8912d';
}

/**
 * Hashes a plaintext password using crypto.scrypt with a unique random salt.
 * Output format: "salt:hashHex"
 */
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

/**
 * Verifies a plaintext password against a stored "salt:hashHex" using timing-safe comparison.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      if (!storedHash || !storedHash.includes(':')) {
        return resolve(false);
      }
      const [salt, key] = storedHash.split(':');
      if (!salt || !key) return resolve(false);

      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) return resolve(false);
        const keyBuffer = Buffer.from(key, 'hex');
        if (keyBuffer.length !== derivedKey.length) {
          return resolve(false);
        }
        const matches = crypto.timingSafeEqual(keyBuffer, derivedKey);
        resolve(matches);
      });
    } catch {
      resolve(false);
    }
  });
}

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  exp: number; // Unix timestamp in seconds
  iat: number; // Issued at timestamp
}

/**
 * Base64URL encoding helper.
 */
function base64UrlEncode(str: string): string {
  return Buffer.from(str, 'utf-8')
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Base64URL decoding helper.
 */
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf-8');
}

/**
 * Creates a cryptographically signed HMAC-SHA256 JWT session token.
 */
export function createSessionToken(user: { id: string; email: string; name: string }): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    iat: now,
    exp: now + SESSION_EXPIRY_SECONDS,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const message = `${encodedHeader}.${encodedPayload}`;

  const secret = getAuthSecret();
  const signature = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${message}.${signature}`;
}

/**
 * Verifies and decodes an HMAC-SHA256 JWT session token.
 * Returns decoded payload if valid and unexpired; returns null otherwise.
 */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const message = `${encodedHeader}.${encodedPayload}`;
    const secret = getAuthSecret();

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(message)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    // Timing safe comparison between signatures
    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSignature);
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }

    const payloadText = base64UrlDecode(encodedPayload);
    const payload: SessionPayload = JSON.parse(payloadText);

    // Verify expiration timestamp
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired token
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies the current session user from incoming NextRequest cookies or headers.
 */
export async function getSessionUser(req: NextRequest): Promise<UserProfile | null> {
  try {
    // 1. Check HTTP-only cookie
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const verified = verifySessionToken(token);
    if (!verified || !verified.userId) return null;

    // 2. Fetch user profile from database
    const user = db.getUser();
    if (user && user.id === verified.userId) {
      return user;
    }

    // Try finding by id or email in Prisma SQLite if multi-user
    try {
      const dbUser = await db.prisma.user.findUnique({
        where: { id: verified.userId },
      });
      if (dbUser) {
        return {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          mobile: dbUser.mobile,
          age: dbUser.age,
          gender: dbUser.gender as UserProfile['gender'],
          language: dbUser.language as UserProfile['language'],
        };
      }
    } catch {}

    return user;
  } catch {
    return null;
  }
}

/**
 * Helper to attach the HTTP-only session cookie to a NextResponse.
 */
export function setSessionCookie(res: NextResponse, token: string): void {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_EXPIRY_SECONDS,
  });
}

/**
 * Helper to delete/clear the HTTP-only session cookie upon logout.
 */
export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
