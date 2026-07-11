"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CalendarPlus, 
  CalendarDays, 
  Users, 
  Settings, 
  LogOut, 
  X 
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Create Event", href: "/dashboard/create-event", icon: CalendarPlus },
    { name: "Manage Events", href: "/dashboard/manage-events", icon: CalendarDays },
    { name: "All Users", href: "/dashboard/users", icon: Users },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <>
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0b1120] border-r border-white/5 p-6 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 md:static md:h-screen shrink-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-8">
          {/* Logo / Brand */}
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-block">
              <h3 className="font-black text-2xl tracking-tighter text-white">
                Event<span className="text-orange-500">Hive</span>
              </h3>
            </Link>
            {/* Mobile Close Button */}
            <button 
              onClick={() => setIsOpen(false)} 
              className="md:hidden p-1 text-gray-400 hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
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