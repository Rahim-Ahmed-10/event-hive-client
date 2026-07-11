"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#0f172a] border-b border-white/5 text-gray-300 sticky top-0 z-[100] shadow-xl font-sans">
      <nav className="flex justify-between items-center py-5 max-w-7xl mx-auto px-6 w-full relative">
        
        {/* Logo - EventHive Branding */}
        <Link href="/" className="flex gap-2 items-center group">
          <h3 className="font-black text-2xl tracking-tighter text-white transition-all">
            Event<span className="text-orange-500 group-hover:text-orange-400">Hive</span>
          </h3>
        </Link>

        {/* Desktop Links (বড় স্ক্রিনের জন্য) */}
        <ul className="hidden md:flex items-center gap-8 text-[13px] font-semibold uppercase tracking-wider">
          <li>
            <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
          </li>
          <li>
            <Link href="/events" className="hover:text-orange-500 transition-colors">Events</Link>
          </li>
          <li>
            <Link href="/sale" className="text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1">
              Early Bird Pass <span className="text-[10px] bg-red-600 text-white px-1 rounded animate-pulse">HOT</span>
            </Link>
          </li>
           <li>
            <Link href="/dashboard" className="hover:text-orange-500 transition-colors">
              Dashboard
            </Link>
          </li>
        </ul>

        {/* Desktop Action Buttons (বড় স্ক্রিনের জন্য) */}
        <div className="hidden md:flex gap-6 items-center text-[13px] font-bold uppercase tracking-widest">
          <Link href="/signup" className="hover:text-white transition-colors">
            SignUp
          </Link>
          <Link 
            href="/signin" 
            className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2.5 rounded-full shadow-lg shadow-orange-900/20 transition-all duration-300"
          >
            SignIn
          </Link>
        </div>

        {/* Mobile Menu Icon (ছোট স্ক্রিনের জন্য বাটন) */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-2 text-white hover:text-orange-500 transition-colors cursor-pointer focus:outline-hidden"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown (মোবাইল স্ক্রিনের ড্রপডাউন মেনু) */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-[#0f172a] border-b border-white/10 shadow-2xl z-50 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <ul className="flex flex-col p-6 gap-5 text-sm font-semibold uppercase tracking-widest">
              <li>
                <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-orange-500 block">Home</Link>
              </li>
              <li>
                <Link href="/events" onClick={() => setIsOpen(false)} className="hover:text-orange-500 block">Events</Link>
              </li>
              <li>
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-orange-500 block">Dashboard</Link>
              </li>
              <li>
                <Link href="/sale" onClick={() => setIsOpen(false)} className="text-orange-500 block">Early Bird Pass</Link>
              </li>
              
              <hr className="border-white/5 my-2" />

              <li className="flex flex-col gap-4">
                <Link 
                  href="/signup" 
                  onClick={() => setIsOpen(false)} 
                  className="text-center py-2 hover:text-white transition-colors border border-white/10 rounded-xl"
                >
                  SignUp
                </Link>
                <Link 
                  href="/signin" 
                  onClick={() => setIsOpen(false)}
                  className="block bg-orange-600 text-white text-center py-3 rounded-xl font-bold shadow-lg"
                >
                  SignIn
                </Link>
              </li>
            </ul>
          </div>
        )}

      </nav>
    </div>
  );
}