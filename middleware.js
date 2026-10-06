import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'local_hands_jwt_secret_key_2026_super_secure_token'
);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Paths that require role protection
  const isCustomerPath = pathname.startsWith('/customer');
  const isProviderPath = pathname.startsWith('/provider');
  const isAdminPath = pathname.startsWith('/admin');

  if (!isCustomerPath && !isProviderPath && !isAdminPath) {
    return NextResponse.next();
  }

  const tokenCookie = request.cookies.get('lh_auth_token');
  const token = tokenCookie?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role;

    if (isCustomerPath && role !== 'customer') {
      const redirectUrl = role === 'admin' ? '/admin' : '/provider';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    if (isProviderPath && role !== 'provider') {
      const redirectUrl = role === 'admin' ? '/admin' : '/customer';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    if (isAdminPath && role !== 'admin') {
      const redirectUrl = role === 'provider' ? '/provider' : '/customer';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    return NextResponse.next();
  } catch (err) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/customer/:path*', '/provider/:path*', '/admin/:path*'],
};
