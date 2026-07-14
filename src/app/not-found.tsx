"use client";
import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Home, ArrowLeft, Terminal } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center px-6 relative overflow-hidden select-none">
      
      {/* 🌌 প্রিমিয়াম ব্যাকগ্রাউন্ড গ্লো ইফেক্টস */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-600/10 blur-[150px] rounded-full animate-pulse p-20" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 blur-[180px] rounded-full animate-pulse delay-700" />

      {/* 📦 গ্লাস-মরফিজম কন্টেইনার কার্ড */}
      <div className="max-w-xl w-full text-center space-y-8 z-10 bg-white/[0.02] backdrop-blur-md border border-white/5 p-8 md:p-12 rounded-3xl shadow-2xl shadow-black/50">
        
        {/* আইকন এবং টার্মিনাল স্টাইল ব্যাজ */}
        <div className="flex flex-col items-center gap-3">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 shadow-inner shadow-orange-500/5 animate-bounce duration-1000">
            <ShieldAlert size={44} className="text-orange-500" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[11px] font-mono font-bold tracking-widest text-red-400 uppercase">
            <Terminal size={12} /> Status: 404_NOT_FOUND
          </div>
        </div>

        {/* 404 টেক্সট উইথ থ্রিডি গ্র্যাডিয়েন্ট */}
        <div className="relative">
          <h1 className="text-8xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-700 leading-none drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
            404
          </h1>
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-blue-500 rounded-lg blur-xl opacity-10 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 pointer-events-none"></div>
        </div>
        
        {/* মেসেজ সেকশন */}
        <div className="space-y-2.5">
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
            Lost in the <span className="text-orange-500">Hive</span>?
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto font-medium">
            The page you are trying to access doesn&apos;t exist or has been relocated to another node.
          </p>
        </div>

        {/* ডিভাইডার লাইন */}
        <hr className="border-white/5 my-2" />

        {/* অ্যাকশন বাটনসমূহ */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-7 py-3.5 rounded-xl font-bold uppercase text-xs tracking-widest transition-all duration-300 shadow-lg shadow-orange-950/50 active:scale-98"
          >
            <Home size={14} />
            Back to Home
          </Link>
          
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 hover:text-white text-gray-300 px-7 py-3.5 rounded-xl font-bold uppercase text-xs tracking-widest border border-white/10 hover:border-white/20 transition-all duration-300 active:scale-98"
          >
            <ArrowLeft size={14} />
            Dashboard
          </Link>
        </div>
      </div>

      {/* নিচে ছোট ব্র্যান্ডিং ফুটার */}
      <div className="absolute bottom-6 text-[10px] font-bold tracking-widest text-gray-600 uppercase">
        EventHive Ecosystem &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}