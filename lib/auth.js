import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import dbConnect from './mongodb';
import User from '@/models/User';
import Provider from '@/models/Provider';

const JWT_SECRET = process.env.JWT_SECRET || 'local_hands_jwt_secret_key_2026_super_secure_token';
const COOKIE_NAME = 'lh_auth_token';

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export async function setAuthCookie(response, token) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearAuthCookie(response) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(COOKIE_NAME);
  return tokenCookie?.value || null;
}

export async function getCurrentUser() {
  try {
    const token = await getAuthToken();
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) return null;

    await dbConnect();
    const user = await User.findById(decoded.userId).select('-password').lean();
    if (!user || !user.isActive) return null;

    let provider = null;
    if (user.role === 'provider') {
      provider = await Provider.findOne({ user: user._id }).lean();
    }

    return {
      ...user,
      id: user._id.toString(),
      _id: user._id.toString(),
      provider: provider ? { ...provider, id: provider._id.toString(), _id: provider._id.toString() } : null,
    };
  } catch (error) {
    return null;
  }
}
