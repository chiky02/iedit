import { jwtVerify, SignJWT, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.AUTH_SECRET;
if (!secretKey) {
  throw new Error('AUTH_SECRET must be defined in the environment variables');
}

const secret = new TextEncoder().encode(secretKey);

export interface JwtPayload extends JWTPayload {
  userId: string;
  email: string;
}

export async function createToken(payload: JwtPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyAuth(): Promise<JwtPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    const verified = await jwtVerify(token, secret);
    return verified.payload as JwtPayload;
  } catch (error) {
    return null;
  }
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}
