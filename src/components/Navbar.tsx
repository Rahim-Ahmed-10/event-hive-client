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
  LogOut,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { authClient } from "@/lib/auth-client"; 

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // 👈 মোডালের জন্য স্টেট
  const [isLoggingOut, setIsLoggingOut] = useState(false); // 👈 লোডিং স্টেট
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Better-Auth সেশন
  const { data: session, isPending } = authClient.useSession();
  const sessionUser = session?.user as any;

  // ডাইনামিক ইউজার ডাটা (লোকাল স্টেট)
  const [dbUser, setDbUser] = useState<any>(null);

  // ব্যাকএন্ড থেকে তাজা ইউজার নাম নিয়ে আসার ইফেক্ট
  useEffect(() => {
    const fetchLatestUserData = async () => {
      if (!sessionUser?.email) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8085"}/api/users/profile?email=${sessionUser.email}`
        );
        if (res.ok) {
          const data = await res.json();
          setDbUser(data);
        }
      } catch (err) {
        console.error("Error syncing navbar user:", err);
      }
    };

    if (sessionUser) {
      fetchLatestUserData();
    }
  }, [sessionUser]);

  // প্রোফাইল আপডেটের ইভেন্ট লিসেনার
  useEffect(() => {
    const handleProfileUpdate = (e: CustomEvent) => {
      if (e.detail?.name) {
        setDbUser((prev: any) => ({ ...prev, name: e.detail.name }));
      }
    };

    window.addEventListener("user-profile-updated" as any, handleProfileUpdate);
    return () => window.removeEventListener("user-profile-updated" as any, handleProfileUpdate);
  }, []);

  // নেভবারে দেখানোর ফাইনাল ইউজার অবজেক্ট
  const user = {
    ...sessionUser,
    name: dbUser?.name || sessionUser?.name,
    image: dbUser?.image || sessionUser?.image,
  };

  const getDashboardLink = () => {
    if (user?.role === "admin") return "/dashboard/admin";
    if (user?.role === "user") return "/dashboard/user";
    return "/dashboard";
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🚀 নিশ্চিত হওয়ার পর মূল লগআউট ফাংশন
  const confirmSignOut = async () => {
    setIsLoggingOut(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsLoggingOut(false);
          setShowLogoutModal(false);
          setIsProfileOpen(false);
          setIsOpen(false);
          router.push("/signin");
        },
      },
    });
  };

  return (
    <>
      <div className="bg-[#0f172a] border-b border-white/5 text-gray-300 sticky top-0 z-[100] shadow-xl font-sans">
        <nav className="flex justify-between items-center py-5 max-w-7xl mx-auto px-6 w-full relative">
          
          {/* Logo */}
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
            <li>
              <Link href="/pricing" className="text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1">
                Pricing <span className="text-[10px] bg-red-600 text-white px-1 rounded animate-pulse">HOT</span>
              </Link>
            </li>
            {sessionUser && (
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
            ) : sessionUser ? (
              
              <div className="relative" ref={dropdownRef}>
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

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-[#0f172a] text-gray-300 rounded-2xl p-4 shadow-2xl border border-white/10 flex flex-col normal-case tracking-normal z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right backdrop-blur-xl bg-opacity-95">
                    
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

                    <div className="flex flex-col gap-0.5 font-medium text-sm text-gray-400">
                      <Link 
                        href="/profile" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 hover:bg-white/5 hover:text-white p-2.5 rounded-lg transition-all duration-150 group"
                      >
                        <User className="w-4 h-4 text-gray-500 group-hover:text-orange-500 transition-colors" />
                        My Profile
                      </Link>
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

                    {/* 👈 মোডাল পপআপ ওপেন করার বাটন */}
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setShowLogoutModal(true);
                      }}
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
                
                {sessionUser && (
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
                {sessionUser && (
                  <li>
                    <Link href={getDashboardLink()} onClick={() => setIsOpen(false)} className="text-orange-500 block">Dashboard</Link>
                  </li>
                )}
                <li>
                  <Link href="/#pricing" onClick={() => setIsOpen(false)} className="text-orange-500 block">Pricing</Link>
                </li>
                
                <hr className="border-white/5 my-2" />

                <li className="flex flex-col gap-4">
                  {sessionUser ? (
                    <button 
                      onClick={() => {
                        setIsOpen(false);
                        setShowLogoutModal(true);
                      }}
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

      {/* 🔴 LOGOUT CONFIRMATION POPUP MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-200 px-4">
          <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200 relative overflow-hidden">
            
            {/* Warning Icon */}
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500">
              <AlertTriangle className="w-8 h-8" />
            </div>

            {/* Modal Text */}
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-white">Logging Out?</h3>
              <p className="text-xs text-gray-400 font-medium">
                Are you sure you want to log out of your account?
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-semibold text-xs py-3 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              
              <button
                onClick={confirmSignOut}
                disabled={isLoggingOut}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-red-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  "Yes, Logout"
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}