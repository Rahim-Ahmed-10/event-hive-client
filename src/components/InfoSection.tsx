"use client";
import React from "react";
import Link from "next/link";
import { CalendarPlus, Ticket, ShieldCheck, ArrowRight, Users, Sparkles, Award } from "lucide-react";

export default function InfoSection() {
  return (
    <div className="bg-[#0b1120] text-gray-300 py-20 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-6 w-full">
        
        {/* Section 1: How It Works */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest block mb-2">
            Simple Steps
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            How <span className="text-orange-500">EventHive</span> Works
          </h2>
          <p className="text-sm text-gray-400 mt-3 font-light">
            Get started in minutes. Whether you are looking to attend an amazing event or hosting one yourself, we've got you covered.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          
          {/* Step 1 */}
          <div className="bg-[#0f172a] border border-white/5 p-8 rounded-3xl relative group hover:border-orange-500/20 transition-all">
            <div className="p-4 bg-orange-600/10 text-orange-500 rounded-2xl w-fit mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all">
              <CalendarPlus className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">1. Find or Create Events</h3>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              Discover local and online events tailored to your interests, or use our simple tools to create and manage your own event seamlessly.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#0f172a] border border-white/5 p-8 rounded-3xl relative group hover:border-orange-500/20 transition-all">
            <div className="p-4 bg-orange-600/10 text-orange-500 rounded-2xl w-fit mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all">
              <Ticket className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">2. Secure Your Tickets</h3>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              Book passes instantly using our fast and highly secure payment system. Receive your digital QR-ticket right in your profile dashboard.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#0f172a] border border-white/5 p-8 rounded-3xl relative group hover:border-orange-500/20 transition-all">
            <div className="p-4 bg-orange-600/10 text-orange-500 rounded-2xl w-fit mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">3. Experience & Enjoy</h3>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              Show your digital pass at the venue entry, walk right in, and enjoy an unforgettable event experience with your community.
            </p>
          </div>

        </div>

        {/* Section 2: Counter / Stats Grid */}
        <div className="bg-gradient-to-r from-[#0f172a] to-[#131d35] border border-white/5 rounded-3xl p-8 md:p-12 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center items-center">
          <div>
            <div className="flex justify-center text-orange-500 mb-2"><Users className="w-6 h-6" /></div>
            <h4 className="text-3xl font-black text-white tracking-tight">50K+</h4>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">Active Users</p>
          </div>
          <div>
            <div className="flex justify-center text-orange-500 mb-2"><Sparkles className="w-6 h-6" /></div>
            <h4 className="text-3xl font-black text-white tracking-tight">1,200+</h4>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">Events Hosted</p>
          </div>
          <div>
            <div className="flex justify-center text-orange-500 mb-2"><Ticket className="w-6 h-6" /></div>
            <h4 className="text-3xl font-black text-white tracking-tight">150K+</h4>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">Tickets Sold</p>
          </div>
          <div>
            <div className="flex justify-center text-orange-500 mb-2"><Award className="w-6 h-6" /></div>
            <h4 className="text-3xl font-black text-white tracking-tight">99.9%</h4>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">Satisfaction Rate</p>
          </div>
        </div>

        {/* Bottom Call to Action Grid */}
        <div className="mt-20 bg-orange-600 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl shadow-orange-900/10">
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Ready to host your own event?
            </h3>
            <p className="text-orange-100 text-sm font-light mt-1">
              Create your event page today and start managing your ticket sales easily.
            </p>
          </div>
          <Link 
            href="/create-event"
            className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all shrink-0 cursor-pointer"
          >
            <span>Create Event Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}