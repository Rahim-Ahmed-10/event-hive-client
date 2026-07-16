import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './lib/auth';
import { headers } from 'next/headers';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if(session?.user?.role == "user" && session?.user?.plan === "free"){
    return NextResponse.redirect(new URL('/pricing', request.url));
  }
  // 🍪 Better-Auth এর সেশন কুকি চেক করা হচ্ছে (নরমাল এবং সিকিউরড উভয়ই)
  const sessionToken = 
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  // 🔑 ১. ইউজার যদি লগইন করা না থাকে, তাহলে সাইন-ইন পেজে রিডাইরেক্ট করুন
  if (!sessionToken) {
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// 🎯 কোন কোন রাউটে এই মিডলওয়্যারটি রান করবে
export const config = {
  matcher: [
    '/profile',
    '/dashboard/user',
    '/dashboard/:path*',
    '/events/:id([a-zA-Z0-9]+)',
  ],
};