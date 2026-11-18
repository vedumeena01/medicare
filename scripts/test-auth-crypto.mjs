import crypto from 'crypto';

const SESSION_EXPIRY_SECONDS = 7 * 24 * 60 * 60;
const secret = 'medicare_secure_session_secret_default_k9823h8912d';

async function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

async function verifyPassword(password, storedHash) {
  return new Promise((resolve) => {
    try {
      if (!storedHash || !storedHash.includes(':')) return resolve(false);
      const [salt, key] = storedHash.split(':');
      if (!salt || !key) return resolve(false);

      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) return resolve(false);
        const keyBuffer = Buffer.from(key, 'hex');
        if (keyBuffer.length !== derivedKey.length) return resolve(false);
        resolve(crypto.timingSafeEqual(keyBuffer, derivedKey));
      });
    } catch {
      resolve(false);
    }
  });
}

function base64UrlEncode(str) {
  return Buffer.from(str, 'utf-8').toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  return Buffer.from(base64, 'base64').toString('utf-8');
}

function createSessionToken(user) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = { userId: user.id, email: user.email, name: user.name, iat: now, exp: now + SESSION_EXPIRY_SECONDS };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const message = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto.createHmac('sha256', secret).update(message).digest('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${message}.${signature}`;
}

function verifySessionToken(token) {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [encodedHeader, encodedPayload, signature] = parts;
    const message = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = crypto.createHmac('sha256', secret).update(message).digest('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSignature);
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;
    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

async function run() {
  console.log('--- 1. Testing Scrypt Password Hashing ---');
  const hash = await hashPassword('DoctorSecurePass2026!');
  console.log('✓ Hash generated:', hash.slice(0, 32) + '...');

  const matchOk = await verifyPassword('DoctorSecurePass2026!', hash);
  if (!matchOk) throw new Error('Password verification failed for correct password');
  console.log('✓ Correct password matched');

  const matchBad = await verifyPassword('WrongPassword', hash);
  if (matchBad) throw new Error('Password verification falsely matched wrong password');
  console.log('✓ Incorrect password rejected');

  console.log('--- 2. Testing HMAC-SHA256 Session Token ---');
  const token = createSessionToken({ id: 'usr-12345', email: 'ved@medicare.ai', name: 'Vedprakash' });
  console.log('✓ Token generated:', token.slice(0, 45) + '...');

  const verified = verifySessionToken(token);
  if (!verified || verified.userId !== 'usr-12345') throw new Error('Token verification failed');
  console.log('✓ Token payload successfully verified for user:', verified.name, `(${verified.email})`);

  const tampered = verifySessionToken(token + 'tampered_signature_byte');
  if (tampered !== null) throw new Error('Tampered token was not rejected');
  console.log('✓ Tampered token signature successfully rejected');

  console.log('--------------------------------------------------');
  console.log('🎉 ALL CRYPTOGRAPHIC AUTH TESTS PASSED 100%');
  console.log('--------------------------------------------------');
}

run();
