"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  CalendarPlus, 
  CalendarDays, 
  CalendarCog, 
  Users, 
  Settings, 
  LogOut, 
  Ticket,
  User,    
} from "lucide-react";
// Better-Auth ক্লায়েন্ট ইম্পোর্ট
import { authClient } from "@/lib/auth-client";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

// 👑 ১. অ্যাডমিনদের জন্য মেনু আইটেম
const adminMenuItems = [
  { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
  { name: "Create", href: "/dashboard/admin/create-event", icon: CalendarPlus },
  { name: "Events", href: "/dashboard/admin/manage-events", icon: CalendarDays }, 
  { name: "Users", href: "/dashboard/admin/users", icon: Users }, 
  { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

// 👤 ২. সাধারণ ইউজারদের জন্য মেনু আইটেম
const userMenuItems = [
  { name: "Overview", href: "/dashboard/user", icon: LayoutDashboard },
  { name: "Bookings", href: "/dashboard/user/bookings", icon: Ticket },
  { name: "Profile", href: "/dashboard/user/profile", icon: User },  
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // লগইন করা ইউজারের সেশন ডাটা নিয়ে আসা
  const { data: session } = authClient.useSession();
  
  // 🛠️ TypeScript Error Fix: user অবজেক্টকে any হিসেবে কাস্ট করা হয়েছে
  const user = session?.user as any;

  // 🎯 ইউজার রোল অনুযায়ী সঠিক মেনুটি সিলেক্ট করা
  const menuItems = user?.role === "admin" ? adminMenuItems : userMenuItems;

  // 🚪 Better-Auth দিয়ে লগআউট
  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <>
      <aside 
        className="hidden md:flex fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#0b1120] to-[#070b14] border-r border-white/5 p-6 flex-col justify-between h-screen shrink-0"
      >
        <div className="flex flex-col h-[calc(100%-60px)] space-y-8">
          
          {/* ✨ লাক্সারি লোগো ডিজাইন */}
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <Link href="/" className="inline-block group">
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-orange-500/80 group-hover:text-orange-500 transition-colors">
                  EventHive
                </span>
                <h3 className="font-black text-2xl tracking-tight text-white mt-1">
                  {user?.role === "admin" ? (
                    <>Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600">Panel</span></>
                  ) : (
                    <>User <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600">Portal</span></>
                  )}
                </h3>
              </div>
            </Link>
          </div>

          {/* 🌟 গ্লোয়িং অ্যাক্টিভ ইফেক্টসহ নেভিগেশন লিংকসমূহ */}
          <nav className="flex-1 space-y-2 overflow-y-auto pr-1 scrollbar-none">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive 
                      ? "bg-gradient-to-r from-orange-600/20 to-orange-600/5 text-orange-400 border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.05)]" 
                      : "hover:bg-white/[0.03] text-gray-400 hover:text-white border border-transparent hover:translate-x-1"
                  }`}
                >
                  {/* অ্যাক্টিভ ইন্ডিকেটর বার */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-orange-500 rounded-r-full shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                  )}

                  <Icon size={18} className={`transition-colors duration-300 ${isActive ? "text-orange-500" : "text-gray-400 group-hover:text-white"}`} />
                  <span className="font-semibold tracking-widest">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 🚪 ডেস্কটপ লগআউট বাটন */}
        <div className="pt-4 border-t border-white/5">
          <Link href="/">
          <button
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-red-400/80 hover:text-white hover:bg-red-500/10 border border-transparent hover:border-red-500/10 transition-all cursor-pointer"
          >
            <LogOut size={18} />
            <span>Exit Dashboard</span>
          </button>
          </Link>
        </div>
      </aside>


      {/* =========================================================================
          📱 ২. আল্ট্রা-মডার্ন ফ্লোটিং মোবাইল বটম গ্লাসবার (md:hidden)
          ========================================================================= */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <nav className="bg-[#0b1120]/80 backdrop-blur-xl border border-white/10 px-4 py-3 flex justify-around items-center rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <div className="w-full max-w-md mx-auto flex justify-between items-center gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-2 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? "text-orange-500 scale-105" 
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {/* অ্যাক্টিভ আইকনের ব্যাকগ্রাউন্ড পিল এবং নিচে ডট */}
                  <div className={`p-2 rounded-2xl transition-all duration-300 ${
                    isActive ? "bg-orange-500/10 shadow-[inset_0_0_12px_rgba(249,115,22,0.15)]" : ""
                  }`}>
                    <Icon size={18} />
                  </div>
                  
                  {/* আইটেমের নাম */}
                  <span className="text-[9px] font-bold mt-1 tracking-widest uppercase">
                    {item.name}
                  </span>

                  {/* ছোট্ট গ্লোয়িং ডট নিচে */}
                  {isActive && (
                    <span className="absolute -bottom-1 w-1 h-1 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse" />
                  )}
                </Link>
              );
            })}

            {/* 🚪 মোবাইলের জন্য মিনিমাল এক্সিট বাটন */}
         <Link href="/">
            <button
              className="flex flex-col items-center justify-center flex-1 py-1.5 px-2 rounded-xl text-red-400/80 hover:text-red-500 transition-all cursor-pointer"
            >
              <div className="p-2">
                <LogOut size={18} />
              </div>
              <span className="text-[9px] font-bold mt-1 tracking-widest uppercase">Exit</span>
            </button>
         </Link>
          </div>
        </nav>
      </div>

      {/* ⚠️ সেফটি প্যাডিং (যাতে মেইন পেজের কন্টেন্ট নিচে ঢাকা না পড়ে) */}
      <div className="md:hidden h-24 pointer-events-none" />
    </>
  );
}