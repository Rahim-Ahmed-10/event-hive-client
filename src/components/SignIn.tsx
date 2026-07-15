"use client";
import React, { useState } from "react";

import { useRouter } from "next/navigation"; 
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
// 🎯 Better-Auth ক্লায়েন্ট ইমপোর্ট
import { authClient } from "@/lib/auth-client"; 
import Link from "next/link";

export default function SignIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [googleLoading, setGoogleLoading] = useState(false); // Google Loading State
  const [error, setError] = useState<string | null>(null); 
  const [success, setSuccess] = useState<string | null>(null); 
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // 📝 ইমেইল সাবমিট হ্যান্ডলার
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        setError(authError.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      setSuccess("Successfully signed in! Redirecting... 🎉");
      
      setTimeout(() => {
        router.push("/"); 
      }, 1200);

    } catch (err) {
      setError("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🌐 গুগল সাইন-ইন হ্যান্ডলার
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/", // সফল লগইন শেষে যেখানে রিডাইরেক্ট হবে
      });
    } catch (err: any) {
      setError(err.message || "Google Sign-In failed. Please try again.");
      setGoogleLoading(false);
    }
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

        {/* ❌ এরর মেসেজ ড্যাশবোর্ড */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-2xl text-center mb-5">
            {error}
          </div>
        )}

        {/* ⚡ সাকসেস মেসেজ ড্যাশবোর্ড */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs p-3.5 rounded-2xl text-center mb-5">
            {success}
          </div>
        )}

        {/* 🌐 Google Sign-In Button */}
        <button
          type="button"
          disabled={loading || googleLoading}
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3.5 rounded-2xl text-sm transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-gray-950" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-white/5"></div>
          <span className="px-4 text-xs text-gray-500 uppercase tracking-widest font-semibold">Or email</span>
          <div className="flex-1 border-t border-white/5"></div>
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
                disabled={loading || googleLoading}
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#0f172a] border border-white/5 focus:border-orange-500/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 outline-hidden transition-all duration-300 disabled:opacity-50"
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
                disabled={loading || googleLoading}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[#0f172a] border border-white/5 focus:border-orange-500/50 rounded-2xl py-3.5 pl-12 pr-12 text-sm text-white placeholder-gray-600 outline-hidden transition-all duration-300 disabled:opacity-50"
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
            disabled={loading || googleLoading}
            className="w-full inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-800 disabled:cursor-not-allowed text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-orange-950/20 transition-all duration-300 transform active:scale-95 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          
          {/* Demo account helper block */}
          <div className="mt-8 p-6 bg-[#1e293b] border border-gray-700 rounded-2xl max-w-sm mx-auto text-center shadow-xl">
            <div className="space-y-3">
              <div className="space-y-1 text-sm text-gray-300">
                <p>
                  <span className="text-gray-500">Admin Email:</span> 
                  <span className="ml-2 font-mono bg-[#0f172a] px-2 py-0.5 rounded">rahima@gmail.com</span>
                </p>
                <p>
                  <span className="text-gray-500">Admin Password:</span> 
                  <span className="ml-2 font-mono bg-[#0f172a] px-2 py-0.5 rounded">Rahima!123</span>
                </p>
              </div>
              <div className="space-y-1 text-sm text-gray-300">
                <p>
                  <span className="text-gray-500"> User Email:</span> 
                  <span className="ml-2 font-mono bg-[#0f172a] px-2 py-0.5 rounded">rahim@gmail.com</span>
                </p>
                <p>
                  <span className="text-gray-500">User Password:</span> 
                  <span className="ml-2 font-mono bg-[#0f172a] px-2 py-0.5 rounded">Rahim!123</span>
                </p>
              </div>
            </div>
          </div>
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