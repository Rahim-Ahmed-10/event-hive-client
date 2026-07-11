"use client";
import React from "react";
import { Menu, Bell } from "lucide-react";

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function Header({ isSidebarOpen, setIsSidebarOpen }: HeaderProps) {
  return (
    <header className="bg-[#0b1120]/50 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Hamburger for mobile */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white cursor-pointer rounded-xl bg-white/5"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-sm font-bold uppercase tracking-widest text-white hidden sm:block">
          Console Panel
        </h1>
      </div>

      {/* Right Top Header Actions */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-xl transition-colors cursor-pointer relative">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
        </button>
        
        <hr className="w-px h-6 border-none bg-white/10" />

        {/* Profile Avatar Trigger */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center font-bold text-xs text-white uppercase ring-2 ring-white/10">
            A
          </div>
          <span className="text-xs font-medium text-gray-400 hidden md:block">Admin Mode</span>
        </div>
      </div>
    </header>
  );
}