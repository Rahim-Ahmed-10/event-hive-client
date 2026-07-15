// src/middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 🍪 Better-Auth এর লোকাল (HTTP) এবং প্রোডাকশন (HTTPS/Vercel) সেশন কুকি চেক করা হচ্ছে
    const sessionToken = 
        request.cookies.get("better-auth.session_token")?.value || 
        request.cookies.get("__Secure-better-auth.session_token")?.value;

    // 🔑 ১. ইউজার যদি লগইন করা না থাকে (কোনো সেশন কুকি না থাকে)
    if (!sessionToken) {
        const signInUrl = new URL('/signin', request.url)
        signInUrl.searchParams.set('callbackUrl', pathname) // লগইন সফল হওয়ার পর যেন আগের পেজেই ফেরত নিয়ে যায়
        return NextResponse.redirect(signInUrl)
    }

    // 🔓 ২. ইউজার লগইন করা থাকলে তাকে সামনে যেতে দাও
    return NextResponse.next();
}

// 🛠️ ম্যাচার কনফিগারেশন: শুধুমাত্র নিচের রাউটগুলোতে মিডলওয়্যার রান করবে এবং পেজ লক রাখবে
export const config = {
  matcher: [
    '/profile', 
    '/dashboard/:path*', 
    '/events/:id([a-zA-Z0-9]+)', // নির্দিষ্ট ডাইনামিক আইডি ওয়ালা ইভেন্ট পেজগুলোকে প্রটেক্ট করবে
  ],
}