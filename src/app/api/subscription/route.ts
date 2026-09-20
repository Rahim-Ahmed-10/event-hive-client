import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const origin = headersList.get('origin') || 'http://localhost:3000';

    // ১. Better-Auth থেকে ইউজারের বর্তমান সেশন চেক
    const userSession = await auth.api.getSession({
      headers: await headers()
    });

    const user = userSession?.user;

    // 🔒 ইউজার লগইন না থাকলে JSON এরর পাঠাবে (যাতে ক্লায়েন্ট সাইড /signin এ পাঠাতে পারে)
    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized", redirectUrl: `${origin}/signin` },
        { status: 401 }
      );
    }

    // স্ট্রাইপ প্রাইস আইডি
    const PRICE_ID = "price_1TtAFgErmWxQp6eFVoWhkw9X";

    // ২. স্ট্রাইপ চেকআউট সেশন তৈরি
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        userEmail: user.email || '',
      },
      mode: 'subscription',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#pricing`,
    });

    // ৩. রিডাইরেক্ট করার বদলে JSON এ URL পাঠানো হচ্ছে
    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error("Stripe Subscription Error: ", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: err.statusCode || 500 }
    );
  }
}