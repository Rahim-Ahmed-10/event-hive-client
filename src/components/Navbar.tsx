"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Menu, 
  X, 
  ChevronDown, 
  ChevronUp, 
  User, 
  LayoutDashboard, 
  LogOut 
} from "lucide-react";
// Better-Auth ক্লায়েন্ট ইম্পোর্ট (আপনার সঠিক পাথ নিশ্চিত করুন)
import { authClient } from "@/lib/auth-client"; 

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // মোবাইলের মেনু টগল
  const [isProfileOpen, setIsProfileOpen] = useState(false); // প্রোফাইল ড্রপডাউন টগল
  const dropdownRef = useRef<HTMLDivElement>(null);

  // লগইন করা ইউজারের সেশন ডাটা নিয়ে আসা
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // 🎯 ইউজারের রোল অনুযায়ী ডাইনামিক ড্যাশবোর্ড লিঙ্ক তৈরি করার ফাংশন
  const getDashboardLink = () => {
    if (user?.role === "admin") return "/dashboard/admin";
    if (user?.role === "user") return "/dashboard/user";
    return "/dashboard"; // বাই-ডিফল্ট যদি অন্য কোনো রোল থাকে
  };

  // বাইরে ক্লিক করলে যেন প্রোফাইল ড্রপডাউন বন্ধ হয়ে যায়
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // সাইন আউট হ্যান্ডলার
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsProfileOpen(false);
          setIsOpen(false);
          router.push("/signin");
        },
      },
    });
  };

  return (
    <div className="bg-[#0f172a] border-b border-white/5 text-gray-300 sticky top-0 z-[100] shadow-xl font-sans">
      <nav className="flex justify-between items-center py-5 max-w-7xl mx-auto px-6 w-full relative">
        
        {/* Logo - EventHive Branding */}
        <Link href="/" className="flex gap-2 items-center group">
          <h3 className="font-black text-2xl tracking-tighter text-white transition-all">
            Event<span className="text-orange-500 group-hover:text-orange-400">Hive</span>
          </h3>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8 text-[13px] font-semibold uppercase tracking-wider">
          <li>
            <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
          </li>
          <li>
            <Link href="/events" className="hover:text-orange-500 transition-colors">Events</Link>
          </li>
          {/* 🎯 এখানে Early Bird Pass পরিবর্তন করে Pricing করা হয়েছে */}
          <li>
            <Link href="/pricing" className="text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1">
              Pricing <span className="text-[10px] bg-red-600 text-white px-1 rounded animate-pulse">HOT</span>
            </Link>
          </li>
          {/* 🔒 ইউজার লগইন থাকলে রোল অনুযায়ী ডাইনামিক ড্যাশবোর্ড লিঙ্ক */}
          {user && (
            <li>
              <Link href={getDashboardLink()} className="hover:text-orange-500 transition-colors">
                Dashboard
              </Link>
            </li>
          )}
        </ul>

        {/* Desktop Action Buttons / User Menu */}
        <div className="hidden md:flex gap-6 items-center text-[13px] font-bold uppercase tracking-widest">
          {isPending ? (
            <span className="text-xs text-gray-500 animate-pulse">Loading...</span>
          ) : user ? (
            
            /* 🖼️ নিখুঁত ডার্ক থিম প্রোফাইল সেকশন */
            <div className="relative" ref={dropdownRef}>
              {/* প্রোফাইল ট্রিগার বাটন */}
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full cursor-pointer transition-all duration-200 normal-case tracking-normal backdrop-blur-md"
              >
                <img
                  src={user.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8Kyzm8o1K6U_J109C-t-R9_Aomqf7w8U_vQ&s"}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-orange-500/30"
                />
                <span className="text-white font-medium text-sm">{user.name}</span>
                {isProfileOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {/* 🛑 সম্পূর্ণ ডার্ক থিম ড্রপডাউন বক্স */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-[#0f172a] text-gray-300 rounded-2xl p-4 shadow-2xl border border-white/10 flex flex-col normal-case tracking-normal z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right backdrop-blur-xl bg-opacity-95">
                  
                  {/* ইউজার ইনফো ও রোল কার্ড */}
                  <div className="flex items-center gap-3 p-2.5 bg-white/5 border border-white/5 rounded-xl mb-3">
                    <img
                      src={user.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8Kyzm8o1K6U_J109C-t-R9_Aomqf7w8U_vQ&s"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-white/10"
                    />
                    <div className="flex flex-col min-w-0">
                      <h4 className="font-bold text-white text-sm truncate leading-tight">{user.name}</h4>
                      <p className="text-xs text-gray-400 font-medium truncate mt-0.5">{user.email}</p>
                      <div>
                        <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                          user.role === "admin" 
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                            : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                        }`}>
                          {user.role || "USER"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* মেনু লিঙ্কসমূহ */}
                  <div className="flex flex-col gap-0.5 font-medium text-sm text-gray-400">
                    <Link 
                      href="/profile" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 hover:bg-white/5 hover:text-white p-2.5 rounded-lg transition-all duration-150 group"
                    >
                      <User className="w-4 h-4 text-gray-500 group-hover:text-orange-500 transition-colors" />
                      My Profile
                    </Link>
                    {/* 🌟 রোল অনুযায়ী ড্রপডাউনের ড্যাশবোর্ড লিঙ্ক */}
                    <Link 
                      href={getDashboardLink()} 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 hover:bg-white/5 hover:text-white p-2.5 rounded-lg transition-all duration-150 group"
                    >
                      <LayoutDashboard className="w-4 h-4 text-gray-500 group-hover:text-orange-500 transition-colors" />
                      Dashboard
                    </Link>
                  </div>

                  <hr className="border-white/5 my-2" />

                  {/* লগআউট বাটন */}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full text-left font-semibold text-sm text-red-400 hover:bg-red-500/10 p-2.5 rounded-lg transition-all duration-150 cursor-pointer group"
                  >
                    <LogOut className="w-4 h-4 text-red-500/70 group-hover:text-red-400 transition-colors" />
                    Logout
                  </button>
                </div>
              )}
            </div>

          ) : (
            <>
              <Link href="/signup" className="hover:text-white transition-colors">
                SignUp
              </Link>
              <Link 
                href="/signin" 
                className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2.5 rounded-full shadow-lg shadow-orange-900/20 transition-all duration-300"
              >
                SignIn
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-2 text-white hover:text-orange-500 transition-colors cursor-pointer focus:outline-hidden"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-[#0f172a] border-b border-white/10 shadow-2xl z-50 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <ul className="flex flex-col p-6 gap-5 text-sm font-semibold uppercase tracking-widest">
              
              {/* মোবাইল ইউজার কার্ড */}
              {user && (
                <li className="bg-white/5 border border-white/10 p-4 rounded-2xl normal-case tracking-normal flex items-center gap-3">
                  <img
                    src={user.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8Kyzm8o1K6U_J109C-t-R9_Aomqf7w8U_vQ&s"}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <span className="text-white text-sm font-bold block">{user.name}</span>
                    <span className={`inline-block mt-1 px-1.5 py-0.5 rounded-md text-[9px] uppercase font-black tracking-wider ${
                      user.role === "admin" ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"
                    }`}>
                      {user.role || "USER"}
                    </span>
                  </div>
                </li>
              )}

              <li>
                <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-orange-500 block">Home</Link>
              </li>
              <li>
                <Link href="/events" onClick={() => setIsOpen(false)} className="hover:text-orange-500 block">Events</Link>
              </li>
              {/* 🔒 রোল অনুযায়ী মোবাইলের ড্যাশবোর্ড লিঙ্ক */}
              {user && (
                <li>
                  <Link href={getDashboardLink()} onClick={() => setIsOpen(false)} className="text-orange-500 block">Dashboard</Link>
                </li>
              )}
              {/* 🎯 মোবাইল মেনুতেও Pricing করা হয়েছে */}
              <li>
                <Link href="/#pricing" onClick={() => setIsOpen(false)} className="text-orange-500 block">Pricing</Link>
              </li>
              
              <hr className="border-white/5 my-2" />

              <li className="flex flex-col gap-4">
                {user ? (
                  <button 
                    onClick={handleSignOut}
                    className="w-full bg-red-900/20 border border-red-500/30 text-red-400 text-center py-3 rounded-xl font-bold tracking-wider cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} /> LOGOUT
                  </button>
                ) : (
                  <>
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
                  </>
                )}
              </li>
            </ul>
          </div>
        )}

      </nav>
    </div>
  );
}