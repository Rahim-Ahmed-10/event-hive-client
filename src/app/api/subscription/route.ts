import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';

export async function POST() {
  try {
    const headersList = await headers();
    const origin = headersList.get('origin') || 'http://localhost:3000';

    // ১. Better-Auth থেকে ইউজারের বর্তমান সেশন চেক করা হচ্ছে
    const userSession = await auth.api.getSession({
      headers: await headers()
    });

    const user = userSession?.user;

    // 🔒 নিরাপত্তা চেক: ইউজার যদি লগইন না থাকে, তবে ক্র্যাশ না করে সাইন-ইন পেজে রিডাইরেক্ট করবে
    if (!user || !user.id) {
      return NextResponse.redirect(`${origin}/signin`, 307);
    }

    // আপনার স্ট্রাইপ প্রাইস আইডি (Stripe Product Price ID)
    const PRICE_ID = "price_1TtAFgErmWxQp6eFVoWhkw9X";

    // ২. স্ট্রাইপ চেকআউট সেশন তৈরি (সঠিক প্যারামিটার সহ)
    const session = await stripe.checkout.sessions.create({
      // ✅ customer_email ব্যবহার করা হয়েছে (userEmail এর পরিবর্তে)
      customer_email: user.email, 
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      // মেটাডাটায় আপনার কাস্টম ডাটা সেভ রাখা হচ্ছে যা পরবর্তীতে Webhook-এ লাগবে
      metadata: {
        userId: user.id,
        userEmail: user.email || '',
      },
      mode: 'subscription',
      // পেমেন্ট সফল হলে এই ইউআরএল-এ যাবে
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      // পেমেন্ট ক্যানসেল করলে বা ব্যাক করলে আবার প্রাইসিং সেকশনে ফিরিয়ে আনবে
      cancel_url: `${origin}/#pricing`, 
    });

    // ৩. স্ট্রাইপের পেমেন্ট পেজে রিডাইরেক্ট করা হচ্ছে (Status 303 Form Submission এর জন্য পারফেক্ট)
    return NextResponse.redirect(session.url!, 303);

  } catch (err: any) {
    console.error("Stripe Subscription Error: ", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: err.statusCode || 500 }
    );
  }
}