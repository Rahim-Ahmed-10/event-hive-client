// src/middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 🍪 Better-Auth এর লোকাল এবং প্রোডাকশন (Vercel) দুই ধরনের কুকিই চেক করা হচ্ছে
    const sessionToken = 
        request.cookies.get("better-auth.session_token")?.value || 
        request.cookies.get("__Secure-better-auth.session_token")?.value;

    // 🔑 ইউজার যদি লগইন করা না থাকে (কোনো সেশন কুকি না থাকে)
    if (!sessionToken) {
        const signInUrl = new URL('/signin', request.url)
        signInUrl.searchParams.set('callbackUrl', pathname) // লগইন করার পর আগের পেজে ফেরত নেওয়ার জন্য
        return NextResponse.redirect(signInUrl)
    }

    return NextResponse.next();
}

// 🛠️ ম্যাচার কনফিগারেশন: শুধুমাত্র প্রটেক্টেড রাউটগুলোতে মিডলওয়্যার রান করবে
export const config = {
  matcher: [
    '/profile', 
    '/dashboard/:path*', 
    '/events/:id([a-zA-Z0-9]+)', // নির্দিষ্ট ফরম্যাটের ইভেন্ট আইডি পেজগুলোকে লক রাখবে
  ],
}