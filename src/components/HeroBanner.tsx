"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Sparkles, ShieldCheck, Ticket, Users } from "lucide-react";

export default function HeroBanner() {
  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#0f172a] text-gray-300 font-sans relative overflow-hidden flex flex-col justify-between">
      
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-orange-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      {/* Hero Core Content */}
      <div className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col lg:flex-row items-center gap-12 pt-12 pb-20 relative z-10">
        
        {/* Left Side: Text and CTAs */}
        <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold border rounded-full bg-orange-500/10 border-orange-500/20 text-orange-500 mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DISCOVER UNFORGETTABLE EXPERIENCES</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1] mb-6">
            Don't Just Exist. <br />
            Experience with <span className="text-orange-500">EventHive</span>
          </h1>

          {/* Subtitle Description */}
          <p className="text-base sm:text-lg text-gray-400 max-w-xl mb-10 leading-relaxed font-light">
            Find and book tickets to the best concerts, tech conferences, sports tournaments, and local meetups. Your gateway to the most happening events around you.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/events" 
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-full transition-all duration-300 shadow-lg shadow-orange-900/40 active:scale-[0.98]"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
            
            <Link 
              href="/create-event" 
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all duration-300 active:scale-[0.98]"
            >
              <Calendar className="w-4 h-4 text-orange-500" />
              <span>Host an Event</span>
            </Link>
          </div>
        </div>

        {/* Right Side: Event Ticket / Pass Visual Box */}
        <div className="flex-1 w-full max-w-md lg:max-w-none flex justify-center items-center relative">
          
          {/* Main Ticket Card Graphic */}
          <div className="relative w-full aspect-[4/3] max-w-[440px] rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-3xl group">
            
            {/* Grid Overlay inside the graphic box */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:2rem_2rem]" />

            {/* Top Row Label */}
            <div className="relative z-10 flex justify-between items-center">
              <span className="text-[10px] uppercase font-black tracking-widest bg-orange-600 text-white px-2 py-0.5 rounded">VIP Pass</span>
              <span className="text-xs text-gray-500 font-mono">#EH-2026</span>
            </div>

            {/* Centered Large Concept Typography */}
            <div className="relative z-10 text-center select-none py-4">
              <span className="block text-6xl font-black text-white/5 tracking-tighter uppercase group-hover:text-white/10 transition-colors duration-500">
                LIVE SHOW
              </span>
              <span className="block text-xl font-bold text-orange-500 tracking-widest uppercase mt-[-10px]">
                GRAND OPENING
              </span>
            </div>

            {/* Bottom Floating Event Details Tag */}
            <div className="relative z-10 bg-[#0f172a]/90 border border-white/5 rounded-2xl p-4 backdrop-blur-md flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Date & Time</p>
                <p className="text-xs font-bold text-white">July 25, 2026 • 08:00 PM</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Location</p>
                <p className="text-xs font-bold text-orange-500">Dhaka, BD</p>
              </div>
            </div>

            {/* Abstract Decorative Ticket Notch Designs (Left & Right Cutouts) */}
            <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0f172a] border-r border-white/10" />
            <div className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0f172a] border-l border-white/10" />
          </div>

        </div>
      </div>

      {/* Bottom Features Banner Info Row */}
      <div className="border-t border-white/5 bg-[#0b1120] py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center sm:justify-start">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">Instant Ticketing</h4>
              <p className="text-xs text-gray-400">Get your QR pass immediately via email</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center sm:justify-start border-y sm:border-y-0 sm:border-x border-white/5 py-4 sm:py-0 sm:px-6">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">Verified Hosts</h4>
              <p className="text-xs text-gray-400">100% authentic and trusted event organizers</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center sm:justify-start">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">Secure Payments</h4>
              <p className="text-xs text-gray-400">Fully encrypted safe checkout gateway</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}