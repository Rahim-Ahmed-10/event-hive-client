// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 🍪 Better-Auth এর সেশন কুকি চেক করা হচ্ছে
    const sessionToken = 
        request.cookies.get("better-auth.session_token")?.value || 
        request.cookies.get("__Secure-better-auth.session_token")?.value;

    // 🔑 ১. ইউজার যদি লগইন করা না থাকে
    if (!sessionToken) {
        const signInUrl = new URL('/signin', request.url)
        signInUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(signInUrl)
    }

    return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile', 
    '/dashboard/:path*', 
    '/events/:id([a-zA-Z0-9]+)', 
  ],
}