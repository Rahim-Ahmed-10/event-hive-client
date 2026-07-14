"use client";
import React from "react";
import { Check, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function PricingSection() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // ডাইনামিকলি রিডাইরেক্ট পাথ সেট করা (লগইন না থাকলে signin এ পাঠাবে)
  const getUpgradeLink = (role: string) => {
    if (!user) return "/signin";
    return `/dashboard/upgrade?role=${role}`;
  };

  return (
    <section className="bg-[#0b1120] text-gray-300 py-20 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto text-center space-y-4 mb-16">
        <span className="text-orange-500 text-xs font-black uppercase tracking-widest bg-orange-500/10 px-3 py-1 rounded-full">
          Membership plans
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
          Choose Your <span className="text-orange-500">Hive</span> Experience
        </h2>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Start for free to explore community events or upgrade to Premium/Doctor tiers to unlock pro management features.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
        
        {/* Tier 1: Free (User) */}
        <div className="bg-[#0f172a] border border-white/5 p-8 rounded-3xl flex flex-col justify-between transition-all duration-300 hover:border-white/10 hover:shadow-xl">
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-bold text-lg">Standard User</h4>
              <p className="text-gray-400 text-xs mt-1">Perfect for event attendees.</p>
            </div>
            <div className="flex items-baseline text-white">
              <span className="text-4xl font-black tracking-tight">$0</span>
              <span className="text-gray-500 text-xs font-semibold ml-1">/ forever</span>
            </div>
            <hr className="border-white/5" />
            <ul className="space-y-3.5 text-sm font-medium text-gray-400">
              <li className="flex items-center gap-3">
                <Check size={16} className="text-emerald-500 shrink-0" />
                <span>Browse & Join Public Events</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-emerald-500 shrink-0" />
                <span>Basic Profile Dashboard</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 line-through">
                <Check size={16} className="shrink-0" />
                <span>Create Public/Private Events</span>
              </li>
            </ul>
          </div>
          <Link
            href={user ? "/dashboard" : "/signup"}
            className="mt-8 block w-full bg-white/5 hover:bg-white/10 text-white text-center font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all"
          >
            {user ? "Your Current Plan" : "Get Started Free"}
          </Link>
        </div>

        {/* Tier 2: Pro Organizer (Admin/Pro) - Highlighted */}
        <div className="bg-[#0f172a] border-2 border-orange-500 p-8 rounded-3xl flex flex-col justify-between relative shadow-2xl shadow-orange-950/20 transform md:-translate-y-2">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <Zap size={10} fill="white" /> Most Popular
          </span>
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-bold text-lg">Pro Organizer</h4>
              <p className="text-orange-400/80 text-xs mt-1">Best for event management & hosts.</p>
            </div>
            <div className="flex items-baseline text-white">
              <span className="text-4xl font-black tracking-tight">$19</span>
              <span className="text-gray-500 text-xs font-semibold ml-1">/ month</span>
            </div>
            <hr className="border-white/5" />
            <ul className="space-y-3.5 text-sm font-medium text-gray-300">
              <li className="flex items-center gap-3">
                <Check size={16} className="text-orange-500 shrink-0" />
                <span>Create Unlimited Events</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-orange-500 shrink-0" />
                <span>Ecosystem Analytics Dashboard</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-orange-500 shrink-0" />
                <span>Manage User Accounts & Roles</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-orange-500 shrink-0" />
                <span>Stripe Cash Flows Integration</span>
              </li>
            </ul>
          </div>
          <Link
            href={getUpgradeLink("admin")}
            className="mt-8 block w-full bg-orange-600 hover:bg-orange-500 text-white text-center font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg shadow-orange-950/50 transition-all"
          >
            Upgrade to Pro / Admin
          </Link>
        </div>

        {/* Tier 3: Verified Doctor / Specialist */}
        <div className="bg-[#0f172a] border border-white/5 p-8 rounded-3xl flex flex-col justify-between transition-all duration-300 hover:border-white/10 hover:shadow-xl">
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-bold text-lg">Medical Specialist</h4>
              <p className="text-gray-400 text-xs mt-1">For certified healthcare creators.</p>
            </div>
            <div className="flex items-baseline text-white">
              <span className="text-4xl font-black tracking-tight">$29</span>
              <span className="text-gray-500 text-xs font-semibold ml-1">/ month</span>
            </div>
            <hr className="border-white/5" />
            <ul className="space-y-3.5 text-sm font-medium text-gray-400">
              <li className="flex items-center gap-3">
                <Check size={16} className="text-blue-500 shrink-0" />
                <span>Verified Doctor License Badge</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-blue-500 shrink-0" />
                <span>Manage Schedules & Days</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-blue-500 shrink-0" />
                <span>Appointments Inbox & Panel</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-blue-500 shrink-0" />
                <span>Prescriptions Cabin Access</span>
              </li>
            </ul>
          </div>
          <Link
            href={getUpgradeLink("doctor")}
            className="mt-8 block w-full bg-white/5 hover:bg-white/10 text-white text-center font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all"
          >
            Apply as Doctor
          </Link>
        </div>

      </div>
    </section>
  );
}