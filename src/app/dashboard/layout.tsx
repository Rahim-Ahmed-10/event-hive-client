"use client";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import React, { useState } from "react";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-300 font-sans flex">
      
      {/* আলাদা করা সাইডবার */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* ডানপাশের মেইন কন্টেন্ট এরিয়া */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* আলাদা করা টপ নেভবার (Header) */}
        <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        {/* ডাইনামিক পেজ রেন্ডার এরিয়া */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>

      </div>
    </div>
  );
}