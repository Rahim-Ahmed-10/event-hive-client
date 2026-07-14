"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CalendarPlus, 
  CalendarDays, 
  CalendarCog, // 📅 ইভেন্ট আপডেট বা এডিট করার আইকন
  Users, 
  Settings, 
  LogOut, 
  X,
  Ticket,
  User,    
  UserCog  
} from "lucide-react";
// Better-Auth ক্লায়েন্ট ইমপোর্ট
import { authClient } from "@/lib/auth-client";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

// 👑 ১. অ্যাডমিনদের জন্য মেনু আইটেম (এখানে "Update Event" যুক্ত করা হয়েছে)
const adminMenuItems = [
  { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
  { name: "Create Event", href: "/dashboard/admin/create-event", icon: CalendarPlus },
  { name: "Manage Events", href: "/dashboard/admin/manage-events", icon: CalendarDays },
  { name: "Update Event", href: "/dashboard/admin/update-event", icon: CalendarCog }, // নতুন অপশন
  { name: "All Users", href: "/dashboard/admin/users", icon: Users }, 
  { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

// 👤 ২. সাধারণ ইউজারদের জন্য মেনু আইটেম
const userMenuItems = [
  { name: "Overview", href: "/dashboard/user", icon: LayoutDashboard },
  { name: "My Bookings", href: "/dashboard/user/bookings", icon: Ticket },
  { name: "Profile", href: "/dashboard/user/profile", icon: User },  
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  // লগইন করা ইউজারের সেশন ডাটা নিয়ে আসা
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // 🎯 ইউজার রোল অনুযায়ী সঠিক মেনুটি সিলেক্ট করা
  const menuItems = user?.role === "admin" ? adminMenuItems : userMenuItems;

  return (
    <>
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0b1120] border-r border-white/5 p-6 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 md:static md:h-screen shrink-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-8">
          {/* ✨ লোগো সেকশন: রোল অনুযায়ী dynamic টেক্সট */}
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-block">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  EventHive
                </span>
                <h3 className="font-black text-xl tracking-tight text-white mt-0.5">
                  {user?.role === "admin" ? (
                    <>Admin <span className="text-orange-500">Panel</span></>
                  ) : (
                    <>User <span className="text-orange-500">Dashboard</span></>
                  )}
                </h3>
              </div>
            </Link>
            {/* Mobile Close Button */}
            <button 
              onClick={() => setIsOpen(false)} 
              className="md:hidden p-1 text-gray-400 hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* 🌟 ডাইনামিক নেভিগেশন লিংকসমূহ */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive 
                      ? "bg-orange-600 text-white shadow-lg shadow-orange-950/30" 
                      : "hover:bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions / Logout */}
        <div className="pt-6 border-t border-white/5">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} />
            <span>Exit Dashboard</span>
          </Link>
        </div>
      </aside>

      {/* Backdrop for Mobile Sidebar */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-xs"
        />
      )}
    </>
  );
}