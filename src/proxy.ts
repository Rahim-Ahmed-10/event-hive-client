// src/middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 💡 Next.js মিডলওয়্যার সবসময় Edge runtime-এ রান করে। 
// তাই সরাসরি 'auth' ইম্পোর্ট করে ডাটাবেজ হিট না করে কুকি চেক করা সবচেয়ে দ্রুত ও নিরাপদ সমাধান।

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 🍪 সেশন কুকি রিড করা হচ্ছে
    const sessionToken = 
        request.cookies.get("better-auth.session_token")?.value || 
        request.cookies.get("__Secure-better-auth.session_token")?.value;

    // 🔑 ১. ইউজার যদি সাইন-আউট বা লগইন না করা থাকে
    if (!sessionToken) {
        const signInUrl = new URL('/signin', request.url)
        signInUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(signInUrl)
    }

    // নোট: যদি তোমার রোল ও প্ল্যান (user.role / user.plan) চেক করা অত্যন্ত জরুরি হয়, 
    // তবে কুকি ডিকোড করে বা API কল দিয়ে করা যায়। তবে ডাটাবেজ কানেকশন মিডলওয়্যারে সরাসরি ইম্পোর্ট করলে Vercel-এ বিল্ড এরর আসবেই।
    return NextResponse.next();
}

export const config = {
  // 🛠️ ম্যাচার কনফিগারেশন:
  matcher: [
    '/profile', 
    '/dashboard/:path*', 
    '/events/:id([a-zA-Z0-9]+)', 
  ],
}