"use client";
import React, { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, UserCheck } from "lucide-react";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // ডিফল্ট রোল 'user' রাখা হয়েছে
    agreeTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // পরবর্তীতে এখানে আপনার ব্যাকএন্ড এপিআই কানেক্ট করবেন
    console.log("Sign Up Data with Role:", formData);
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
          <h2 className="text-xl font-bold text-white tracking-tight">Create Account</h2>
          <p className="text-xs text-gray-400 mt-1 font-light">
            Join us today and discover amazing upcoming events
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Full Name Field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-4 w-4 h-4 text-gray-500" />
              <input
                type="text"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#0f172a] border border-white/5 focus:border-orange-500/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 outline-hidden transition-all duration-300"
              />
            </div>
          </div>

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

          {/* Role Selection Field (User / Admin) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* User Option */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "user" })}
                className={`flex items-center justify-center gap-3 p-3 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  formData.role === "user"
                    ? "bg-orange-600/10 border-orange-500 text-orange-500 shadow-md"
                    : "bg-[#0f172a] border-white/5 text-gray-400 hover:border-white/10"
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>User</span>
              </button>

              {/* Admin Option */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "admin" })}
                className={`flex items-center justify-center gap-3 p-3 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  formData.role === "admin"
                    ? "bg-orange-600/10 border-orange-500 text-orange-500 shadow-md"
                    : "bg-[#0f172a] border-white/5 text-gray-400 hover:border-white/10"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Password
            </label>
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

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              required
              checked={formData.agreeTerms}
              onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
              className="accent-orange-500 w-4 h-4 rounded-sm border-white/5 bg-[#0f172a] mt-0.5 shrink-0"
            />
            <label htmlFor="terms" className="text-xs text-gray-400 select-none cursor-pointer leading-normal">
              I agree to the{" "}
              <Link href="/terms" className="text-orange-500 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-orange-500 hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-orange-950/20 transition-all duration-300 cursor-pointer mt-2"
          >
            <span>Sign Up</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Bottom Link */}
        <div className="text-center mt-8 pt-6 border-t border-white/5 text-xs text-gray-400">
          Already have an account?{" "}
          <Link href="/signin" className="text-orange-500 hover:text-orange-400 font-bold transition-colors">
            Sign In Instead
          </Link>
        </div>

      </div>
    </div>
  );
}