"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // পরবর্তীতে এখানে আপনার ব্যাকএন্ড অথেনটিকেশন (যেমন: NextAuth বা MongoDB Login API) কানেক্ট করবেন
    console.log("Sign In Data:", formData);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-300 flex items-center justify-center px-6 py-12 font-sans relative overflow-hidden">
      
      {/* Background Decorative Blur Element */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#0b1120] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10">
        
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-3">
            <h3 className="font-black text-3xl tracking-tighter text-white">
              Event<span className="text-orange-500">Hive</span>
            </h3>
          </Link>
          <h2 className="text-xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-xs text-gray-400 mt-1 font-light">
            Sign in to access your dashboard and tickets
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#0f172a] border border-white/5 focus:border-orange-500/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 outline-hidden transition-all duration-300"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Password
              </label>
              <Link 
                href="/forgot-password" 
                className="text-xs text-orange-500 hover:text-orange-400 transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-4 h-4 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[#0f172a] border border-white/5 focus:border-orange-500/50 rounded-2xl py-3.5 pl-12 pr-12 text-sm text-white placeholder-gray-600 outline-hidden transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Options */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="remember"
              className="accent-orange-500 w-4 h-4 rounded-sm border-white/5 bg-[#0f172a]"
            />
            <label htmlFor="remember" className="text-xs text-gray-400 select-none cursor-pointer">
              Remember me on this device
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-orange-950/20 transition-all duration-300 cursor-pointer mt-2"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Bottom Link */}
        <div className="text-center mt-8 pt-6 border-t border-white/5 text-xs text-gray-400">
          Don't have an account?{" "}
          <Link href="/signup" className="text-orange-500 hover:text-orange-400 font-bold transition-colors">
            Sign Up Now
          </Link>
        </div>

      </div>
    </div>
  );
}