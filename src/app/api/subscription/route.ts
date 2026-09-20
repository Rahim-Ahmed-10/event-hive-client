import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const reqHeaders = await headers();
    
    // Njia bora ya kuchukua origin mbadala
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || 'http://localhost:3000';
    const origin = reqHeaders.get('origin') || appUrl;

    // 1. Angalia kikao cha mtumiaji (Session) kutoka Better-Auth
    const userSession = await auth.api.getSession({
      headers: reqHeaders, // Tumia kigezo tulichokiweka hapo juu
    });

    const user = userSession?.user;

    // 🔒 Ikiwa mtumiaji hajajisajili, rudisha kosa la JSON
    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized", redirectUrl: `${origin}/signin` },
        { status: 401 }
      );
    }

    // Vitambulisho vya Bei vya Stripe (Stripe Price ID)
    const PRICE_ID = "price_1TtAFgErmWxQp6eFVoWhkw9X";

    // 2. Tengeza kikao cha Stripe Checkout
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

    // 3. Rudisha URL ya Stripe kuwezesha kuelekezwa (redirect) kutoka upande wa mteja (Client side)
    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error("Stripe Subscription Error: ", err);
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: err?.statusCode || 500 }
    );
  }
}