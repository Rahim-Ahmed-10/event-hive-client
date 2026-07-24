import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './lib/auth';
import { headers } from 'next/headers';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    // 🌐 Better-Auth সেশন চেক
    const session = await auth.api.getSession({
      headers: await headers()
    });

    // 🔑 ১. ইউজার যদি লগইন করা না থাকে, তাহলে সাইন-ইন পেজে রিডাইরেক্ট
    if (!session) {
      const signInUrl = new URL('/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // 💳 ২. ইউজার যদি ফ্রি প্ল্যানের হয়, তাকে প্রাইসিং পেজে পাঠাবে
    if (session.user?.role === "user" && session.user?.plan === "free") {
      return NextResponse.redirect(new URL('/pricing', request.url));
    }

  } catch (error) {
    console.error("Middleware Auth Verification Error:", error);
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// 🎯 কোন কোন পেজ বা রাউটে প্রোটেকশন কাজ করবে
export const config = {
  matcher: [
    '/profile',
    '/dashboard/user',
    '/dashboard/:path*',
    '/events/:id*',
  ],
};