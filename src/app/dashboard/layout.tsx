"use client";
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
      
      {/* 🖥️ আলাদা করা সাইডবার (যা ডেস্কটপে fixed এবং মোবাইলে hidden/bottom বার হিসেবে কাজ করবে) */}
     <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* 🚀 ডানপাশের মেইন কন্টেন্ট এরিয়া (ডেস্কটপে md:ml-64 দিয়ে সাইডবারের ডানপাশ থেকে শুরু করা হয়েছে) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto md:ml-64 transition-all duration-300">

        {/* 💻 ডাইনামিক পেজ রেন্ডার এরিয়া (মোবাইলে নিচের দিকে pb-24 বা pb-28 দিয়ে স্পেসিং রাখা হয়েছে যাতে বটম বারের নিচে কন্টেন্ট না ঢেকে যায়) */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-28 md:pb-8">
          {children}
        </main>

      </div>
    </div>
  );
}