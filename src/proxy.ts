import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth'

// 💡 Vercel-এ Edge Runtime-এর কারণে MongoDB/Better-Auth ক্র্যাশ হওয়া রোধ করতে Node.js রানটাইম ব্যবহার করা হলো
export const runtime = 'nodejs';

export async function proxy(request: NextRequest) {
    
    // 🛠️ সরাসরি রিকোয়েস্ট হেডার দিয়ে সেশন রিড করা হচ্ছে (Vercel ফ্রেন্ডলি)
    const session = await auth.api.getSession({
        headers: request.headers, 
    })

    const { pathname } = request.nextUrl

    // 🔑 ১. ইউজার যদি সাইন-আউট (লগইন না করা) থাকে
    if (!session) {
        // সাইন-ইন করার পর যাতে ইউজার আবার সরাসরি এই পেজেই ফিরে আসতে পারে
        const signInUrl = new URL('/signin', request.url)
        signInUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(signInUrl)
    }

    // Better-Auth টাইপ চেক এড়াতে কাস্ট করা হলো
    const user = session?.user as any;

    // 🔑 ২. ইউজার যদি ফ্রি প্ল্যানে থাকে এবং ড্যাশবোর্ড বা প্রটেক্টেড রাউটে যেতে চায়
    if (user?.role === 'user' && user?.plan === "free") {
         return NextResponse.redirect(new URL('/pricing', request.url))
    }

    return NextResponse.next();
}
 
export const config = {
  // 🛠️ ম্যাচার কনফিগারেশন:
  matcher: [
    '/profile', 
    '/dashboard/:path*', 
    
    // 🔒 এই রেগুলার এক্সপ্রেশনটি কেবল আইডি ওয়ালা ইভেন্ট ডিটেইলস পেজগুলোকে প্রটেক্ট করবে।
    // ফলে সাইন-আউট থাকা অবস্থায় কেউ ইভেন্ট ডিটেইলস দেখতে পারবে না, কিন্তু অন্য সাধারণ পেজগুলোতে সমস্যা হবে না।
    '/events/:id([a-zA-Z0-9]+)', 
  ],
}