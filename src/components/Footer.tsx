"use client";
import React from "react";
import Link from "next/link";
// Lucide React এর সঠিক আইকন নামগুলো এখানে ইম্পোর্ট করা হয়েছে
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {

  const pathName = usePathname()
  if(pathName.includes("dashboard")){
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0b1120] text-gray-400 border-t border-white/5 font-sans">
      {/* Top Section: Links & Info */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Column 1: Brand & About */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex gap-2 items-center group">
            <h3 className="font-black text-2xl tracking-tighter text-white transition-all">
              Event<span className="text-orange-500 group-hover:text-orange-400">Hive</span>
            </h3>
          </Link>
          <p className="text-sm leading-relaxed font-light text-gray-400">
            Your ultimate gateway to discover, experience, and host unforgettable events. From music concerts to tech conferences, we connect you to the moments that matter.
          </p>
          
          {/* Social Icons using standard SVGs for 100% reliability */}
          <div className="flex items-center gap-4 mt-2">
            <a href="#" className="hover:text-orange-500 text-gray-400 transition-colors p-2 bg-white/5 rounded-full border border-white/5" aria-label="Facebook">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/></svg>
            </a>
            <a href="#" className="hover:text-orange-500 text-gray-400 transition-colors p-2 bg-white/5 rounded-full border border-white/5" aria-label="X (Twitter)">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="hover:text-orange-500 text-gray-400 transition-colors p-2 bg-white/5 rounded-full border border-white/5" aria-label="Instagram">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="hover:text-orange-500 text-gray-400 transition-colors p-2 bg-white/5 rounded-full border border-white/5" aria-label="LinkedIn">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-5 border-l-2 border-orange-500 pl-3">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-3 text-sm font-medium">
            <li><Link href="/events" className="hover:text-orange-500 transition-colors">Browse Events</Link></li>
            <li><Link href="/create-event" className="hover:text-orange-500 transition-colors">Host an Event</Link></li>
            <li><Link href="/pricing" className="hover:text-orange-500 transition-colors">Ticket Pricing</Link></li>
            <li><Link href="/sponsors" className="hover:text-orange-500 transition-colors">Our Sponsors</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-5 border-l-2 border-orange-500 pl-3">
            Contact Us
          </h4>
          <ul className="flex flex-col gap-4 text-sm font-light">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
              <span>Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-orange-500 shrink-0" />
              <span>+880 1234 567890</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-orange-500 shrink-0" />
              <span>support@eventhive.com</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-5 border-l-2 border-orange-500 pl-3">
            Newsletter
          </h4>
          <p className="text-sm font-light mb-4 text-gray-400">
            Subscribe to get updates on the biggest upcoming events and exclusive ticket discounts.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="w-full bg-[#0f172a] border border-white/10 rounded-full py-3 pl-5 pr-12 text-sm text-gray-300 placeholder-gray-500 focus:outline-hidden focus:border-orange-500/50 transition-all"
            />
            <button 
              type="submit" 
              className="absolute right-1.5 p-2 bg-orange-600 hover:bg-orange-500 text-white rounded-full transition-colors cursor-pointer flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* Bottom Section: Copyright & Legal */}
      <div className="border-t border-white/5 bg-[#070b14] py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-light tracking-wide">
          <p>© {currentYear} <span className="font-bold text-white">EventHive</span>. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-orange-500 transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}