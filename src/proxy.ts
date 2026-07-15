import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server' // 🛠️ NextRequest টাইপ ইম্পোর্ট
import { auth } from './lib/auth'
import { headers } from 'next/headers'

// 🛠️ TypeScript Error Fix: request-এর টাইপ NextRequest সেট করা হয়েছে
export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    // 🔑 ১. ইউজার যদি সাইন-ইন করা না থাকে (session null হয়)
    // তাহলে তাকে সরাসরি সাইন-ইন পেজে পাঠিয়ে দেবে
    if (!session) {
        return NextResponse.redirect(new URL('/signin', request.url))
    }

    // Better-Auth টাইপ চেক এড়াতে ইউজারকে কাস্ট করা হলো
    const user = session?.user as any;

    // 🔑 ২. ইউজার যদি ফ্রি প্ল্যানে থাকে এবং নির্দিষ্ট রাউটে অ্যাক্সেস করতে চায়
    if (user?.role === 'user' && user?.plan === "free") {
         return NextResponse.redirect(new URL('/pricing', request.url))
    }

    return NextResponse.next();
}
 
export const config = {
  matcher: [
    '/profile', 
    '/dashboard/user', 
    '/events/:path*',
  ],
}