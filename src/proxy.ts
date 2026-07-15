import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server' // 🛠️ NextRequest টাইপ ইম্পোর্ট
import { auth } from './lib/auth'
import { headers } from 'next/headers'

// 🛠️ TypeScript Error Fix: request-এর টাইপ NextRequest সেট করা হয়েছে
export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    // Better-Auth টাইপ চেক এড়াতে ইউজারকে কাস্ট করা হলো
    const user = session?.user as any;

    if (user?.role === 'user' && user?.plan === "free") {
         return NextResponse.redirect(new URL('/pricing', request.url))
    }

    if (!session) {
        return NextResponse.redirect(new URL('/signin', request.url)) // 🛠️ '/signin' পাথ ফিক্সড
    }
}
 
export const config = {
  matcher: ['/profile', '/dashboard/user'],
}