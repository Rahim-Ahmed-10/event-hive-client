import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import { CheckCircle2, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { subscription } from '@/lib/action/payment';

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function Success({ searchParams }: SuccessPageProps) {
  const { session_id } = await searchParams;

  // সেশন আইডি না থাকলে সরাসরি হোমে বা প্রাইসিং-এ পাঠিয়ে দেওয়া ভালো
  if (!session_id) {
    return redirect('/#pricing');
  }

  // স্ট্রাইপ থেকে পেমেন্ট সেশনের ডিটেইলস নিয়ে আসা
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  });

  const status = session.status;
  const customerEmail = session.customer_details?.email;

  // পেমেন্ট যদি এখনও ইনকমপ্লিট বা ওপেন থাকে, হোমে রিডাইরেক্ট করবে
  if (status === 'open') {
    return redirect('/');
  }

  if (status === 'complete') {
    const userId = session.metadata?.userId;
    const priceId = session.line_items?.data[0]?.price?.id || '';

    
    if (userId) {
      await subscription({
        userId: userId,
        priceId: priceId,
        sessionId: session_id,
      });
    }

    return (
      <main className="min-h-screen bg-[#0b1120] text-gray-300 flex items-center justify-center px-6 py-12 border-t border-white/5 font-sans">
        <div className="max-w-md w-full bg-[#0f172a] border border-white/10 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
          
          {/* গ্লো ইফেক্ট ব্যাকগ্রাউন্ড */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* সাকসেস আইকন অ্যানিমেশন */}
          <div className="flex justify-center mb-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-full animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
          </div>

          {/* হেডিং */}
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter mb-2">
            Payment <span className="text-orange-500">Successful!</span>
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Thank you for upgrading! Your subscription is now active.
          </p>

          <hr className="border-white/5 my-6" />

          {/* পেমেন্ট ইনফো বক্স */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-left space-y-3.5 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Confirmation Sent To</p>
                <p className="text-white font-medium break-all">{customerEmail}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Account Access</p>
                <p className="text-gray-400 font-medium text-xs mt-0.5">Your Pro features have been unlocked instantly.</p>
              </div>
            </div>
          </div>

          {/* হেল্প টেক্সট */}
          <p className="text-xs text-gray-500 mt-6 leading-relaxed">
            Have questions or facing issues? Email our support at{' '}
            <a href="mailto:support@eventhive.com" className="text-orange-400 hover:text-orange-300 transition-colors font-medium underline">
              support@eventhive.com
            </a>
          </p>

          {/* অ্যাকশন বাটন */}
          <div className="mt-8">
            <a
              href="/dashboard/user"
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-orange-950/40 transition-all flex items-center justify-center gap-2 group"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

        </div>
      </main>
    );
  }

  // কোনো কারণে স্ট্যাটাস কমপ্লিট না হলে রিডাইরেক্ট করা
  return redirect('/');
}