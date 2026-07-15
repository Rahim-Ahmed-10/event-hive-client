// src/middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 🍪 Better-Auth এর ডিফল্ট সেশন কুকি চেক করা হচ্ছে
    // (যদি তোমার কাস্টম কুকি নেম থাকে তবে "better-auth.session_token" এর জায়গায় সেটি দেবে)
    const sessionToken = request.cookies.get("better-auth.session_token")?.value;

    // 🔑 ১. ইউজার যদি লগইন করা না থাকে (কুকি না থাকে)
    if (!sessionToken) {
        const signInUrl = new URL('/signin', request.url)
        signInUrl.searchParams.set('callbackUrl', pathname) // লগইন করার পর আগের পেজে ফেরত নেওয়ার জন্য
        return NextResponse.redirect(signInUrl)
    }

    // 💡 দ্রষ্টব্য: যদি ইউজার ফ্রি প্ল্যানে থাকে, তবে তার রোল বা প্ল্যান চেক করার জন্য 
    // সার্ভার সাইড পেজে (Server Component) বা layout.tsx-এ auth.api.getSession() কল করে pricing-এ রিডাইরেক্ট করা সবচেয়ে নিরাপদ।
    // মিডলওয়্যারে ডাটাবেজ ব্লক এড়াতে এই কুকি-বেসড মেথডটিই ভার্সেলের জন্য বেস্ট।

    return NextResponse.next();
}

export const config = {
  // 🛠️ ম্যাচার কনফিগারেশন:
  matcher: [
    '/profile', 
    '/dashboard/:path*', 
    '/events/:id([a-zA-Z0-9]+)', // ইভেন্ট আইডি পেজগুলোকে লক রাখবে
  ],
}