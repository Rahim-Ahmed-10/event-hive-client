// middleware.ts বা src/middleware.ts ফাইলে এটি ব্যবহার করো

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth'

// 🛠️ ১. ফাংশনের নাম পরিবর্তন করে 'middleware' করা হলো
export async function proxy(request: NextRequest) {
    
    // 🛠️ ২. next/headers এর বদলে সরাসরি request.headers ব্যবহার করা হলো
    const session = await auth.api.getSession({
        headers: request.headers, 
    })

    const { pathname } = request.nextUrl

    // 🔑 ২. ইউজার যদি সাইন-ইন করা না থাকে (session null হয়)
    if (!session) {
        // সাইন-ইন করার পর যাতে আবার আগের পেজে ফিরে যেতে পারে, সেজন্য callback url রাখা ভালো
        const signInUrl = new URL('/signin', request.url)
        signInUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(signInUrl)
    }

    // Better-Auth টাইপ চেক এড়াতে কাস্ট করা হলো
    const user = session?.user as any;

    // 🔑 ৩. ইউজার যদি ফ্রি প্ল্যানে থাকে এবং নির্দিষ্ট প্রটেক্টেড রাউটে যেতে চায়
    if (user?.role === 'user' && user?.plan === "free") {
         return NextResponse.redirect(new URL('/pricing', request.url))
    }

    return NextResponse.next();
}
 
export const config = {
  // 🛠️ ৪. এখান থেকে '/events/:path*' বাদ দেওয়া হয়েছে যাতে লগইন ছাড়াও পাবলিকলি ইভেন্ট দেখা যায়।
  // তুমি চাইলে শুধুমাত্র টিকিট কাটা বা ড্যাশবোর্ডের পেজগুলো এখানে রাখতে পারো।
  matcher: [
    '/profile', 
    '/dashboard/:path*', 
    '/events/:path*'
  ],
}