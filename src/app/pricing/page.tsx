"use client";

import React, { useState } from "react";
import { Check, Zap, ShieldCheck, Loader2, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function PricingSection() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const handleUpgrade = async (role: string) => {
    // ১. ইউজার না থাকলে সাইন-ইন পেজে নিয়ে যাবে
    if (!user) {
      router.push("/signin");
      return;
    }

    setLoadingRole(role);
    try {
      // ২. স্ট্রাইপ চেকআউট সেশনের জন্য API কল
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      const data = await response.json();

      // ৩. ইউজার অথরাইজড না থাকলে সাইন-ইন পেজে রিডাইরেক্ট
      if (response.status === 401 && data?.redirectUrl) {
        router.push(data.redirectUrl);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate checkout");
      }

      // ৪. পেমেন্ট পেজে রিডাইরেক্ট
      if (data?.url) {
        window.location.href = data.url;
      } else {
        router.push(`/dashboard/upgrade?role=${role}`);
      }
    } catch (error: any) {
      console.error("Subscription Error:", error);
      alert(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <section id="pricing" className="bg-[#070b14] text-slate-300 py-24 px-6 relative overflow-hidden border-t border-slate-800/60 select-none">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-blue-600/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Section Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold backdrop-blur-md">
          <Sparkles size={14} className="animate-pulse" />
          <span className="tracking-widest uppercase text-[11px]">Membership Plans</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          Choose Your <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">Hive</span> Experience
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto font-medium leading-relaxed">
          Start for free to explore community events or upgrade to Premium tiers to unlock high-impact management features.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch relative z-10">
        
        {/* Tier 1: Free (User) */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl flex flex-col justify-between transition-all duration-500 hover:border-slate-700 hover:shadow-2xl hover:-translate-y-1 group">
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-bold text-xl">Standard User</h3>
              <p className="text-slate-400 text-xs mt-1 font-medium">Perfect for event attendees.</p>
            </div>
            <div className="flex items-baseline text-white">
              <span className="text-4xl font-black tracking-tight">$0</span>
              <span className="text-slate-500 text-xs font-semibold ml-1">/ forever</span>
            </div>
            <hr className="border-slate-800/80" />
            <ul className="space-y-4 text-xs font-medium text-slate-300">
              <li className="flex items-center gap-3">
                <Check size={16} className="text-emerald-400 shrink-0" />
                <span>Browse & Join Public Events</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-emerald-400 shrink-0" />
                <span>Basic Profile Dashboard</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600 line-through">
                <Check size={16} className="shrink-0" />
                <span>Create Public/Private Events</span>
              </li>
            </ul>
          </div>
          
          <Link
            href={user ? "/dashboard" : "/signup"}
            className="mt-8 w-full bg-slate-950/80 hover:bg-slate-800 text-slate-200 text-center font-extrabold text-xs uppercase tracking-wider py-4 rounded-2xl border border-slate-800 transition-all duration-300 shadow-md block"
          >
            {user ? "Your Current Plan" : "Get Started Free"}
          </Link>
        </div>

        {/* Tier 2: Pro Organizer (Admin/Pro) - Highlighted */}
        <div className="bg-slate-900/80 backdrop-blur-2xl border-2 border-orange-500/80 p-8 rounded-3xl flex flex-col justify-between relative shadow-2xl shadow-orange-500/10 md:-translate-y-3 transition-all duration-500 hover:-translate-y-4">
          
          {/* Badge */}
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-orange-600/30 flex items-center gap-1.5">
            <Zap size={12} fill="white" /> Most Popular
          </span>

          <div className="space-y-6">
            <div>
              <h3 className="text-white font-bold text-xl">Pro Organizer</h3>
              <p className="text-orange-400/90 text-xs mt-1 font-medium">Best for event hosts & managers.</p>
            </div>
            <div className="flex items-baseline text-white">
              <span className="text-4xl font-black tracking-tight">$19</span>
              <span className="text-slate-400 text-xs font-semibold ml-1">/ month</span>
            </div>
            <hr className="border-slate-800/80" />
            <ul className="space-y-4 text-xs font-medium text-slate-200">
              <li className="flex items-center gap-3">
                <Check size={16} className="text-orange-400 shrink-0" />
                <span>Create Unlimited Events</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-orange-400 shrink-0" />
                <span>Ecosystem Analytics Dashboard</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-orange-400 shrink-0" />
                <span>Manage User Accounts & Roles</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-orange-400 shrink-0" />
                <span>Stripe Cash Flows Integration</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleUpgrade("pro")}
            disabled={loadingRole === "pro"}
            className="mt-8 w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:opacity-90 text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-2xl shadow-xl shadow-orange-600/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loadingRole === "pro" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span>Upgrade to Pro</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>

        {/* Tier 3: Verified Doctor / Specialist */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl flex flex-col justify-between transition-all duration-500 hover:border-slate-700 hover:shadow-2xl hover:-translate-y-1 group">
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-bold text-xl flex items-center gap-2">
                Medical Specialist
                <ShieldCheck size={18} className="text-blue-400" />
              </h3>
              <p className="text-slate-400 text-xs mt-1 font-medium">For certified healthcare creators.</p>
            </div>
            <div className="flex items-baseline text-white">
              <span className="text-4xl font-black tracking-tight">$29</span>
              <span className="text-slate-500 text-xs font-semibold ml-1">/ month</span>
            </div>
            <hr className="border-slate-800/80" />
            <ul className="space-y-4 text-xs font-medium text-slate-300">
              <li className="flex items-center gap-3">
                <Check size={16} className="text-blue-400 shrink-0" />
                <span>Verified Doctor License Badge</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-blue-400 shrink-0" />
                <span>Manage Schedules & Days</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-blue-400 shrink-0" />
                <span>Appointments Inbox & Panel</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-blue-400 shrink-0" />
                <span>Prescriptions Cabin Access</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleUpgrade("doctor")}
            disabled={loadingRole === "doctor"}
            className="mt-8 w-full bg-slate-950/80 hover:bg-slate-800 text-slate-200 hover:text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-2xl border border-slate-800 hover:border-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loadingRole === "doctor" ? (
              <Loader2 size={16} className="animate-spin text-blue-400" />
            ) : (
              <span>Apply as Doctor</span>
            )}
          </button>
        </div>

      </div>
    </section>
  );
}