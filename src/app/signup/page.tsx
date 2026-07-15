"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, UserCheck, Link2, X, Loader2 } from "lucide-react";
// আপনার প্রজেক্টের সঠিক পাথ অনুযায়ী authClient ইমপোর্ট নিশ্চিত করুন
import { authClient } from "@/lib/auth-client"; 

export default function SignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); 
  const [googleLoading, setGoogleLoading] = useState(false); // Google Loading State
  const [error, setError] = useState<string | null>(null); 
  const [success, setSuccess] = useState<string | null>(null); 
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    imageUrl: "", 
    password: "",
    role: "user", // ডিফল্টভাবে "user" থাকবে
    agreeTerms: false,
  });

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData({ ...formData, imageUrl: url });
    setImagePreview(url || null); 
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, imageUrl: "" });
    setImagePreview(null);
  };

  // 📝 ইমেইল সাবমিট হ্যান্ডলার
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null); 

    // বেসিক ফিল্ড ভ্যালিডেশন
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill name, email, and password.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        image: formData.imageUrl || "https://encrypted-tbn0.gstatic.com/images", 
        role: formData.role, 
        plan: "free"
      } as any); 

      if (authError) {
        setError(authError.message || "Something went wrong.");
        setLoading(false);
        return;
      }

      setSuccess(`Account created successfully as ${formData.role}! 🎉`);
      
      setTimeout(() => {
        router.push("/signin"); 
      }, 1500);

    } catch (err) {
      setError("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🌐 গুগল সাইন-আপ হ্যান্ডলার
  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/", // সফল সাইন-আপ শেষে যেখানে রিডাইরেক্ট হবে
      });
    } catch (err: any) {
      setError(err.message || "Google Sign-Up failed. Please try again.");
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
          <h2 className="text-xl font-bold text-white tracking-tight">Create Account</h2>
          <p className="text-xs text-gray-400 mt-1 font-light">
            Join us today and discover amazing upcoming events
          </p>
        </div>

        {/* ❌ এরর মেসেজ */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-2xl text-center mb-5">
            {error}
          </div>
        )}

        {/* ⚡ সাকসেস মেসেজ */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs p-3.5 rounded-2xl text-center mb-5">
            {success}
          </div>
        )}

        {/* 🌐 Google Sign-Up Button */}
        <button
          type="button"
          disabled={loading || googleLoading}
          onClick={handleGoogleSignUp}
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
          <span>Sign Up with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-white/5"></div>
          <span className="px-4 text-xs text-gray-500 uppercase tracking-widest font-semibold">Or email</span>
          <div className="flex-1 border-t border-white/5"></div>
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
                disabled={loading || googleLoading}
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#0f172a] border border-white/5 focus:border-orange-500/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 outline-hidden transition-all duration-300 disabled:opacity-50"
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
                disabled={loading || googleLoading}
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#0f172a] border border-white/5 focus:border-orange-500/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 outline-hidden transition-all duration-300 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Profile Image URL Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Profile Image URL
              </label>
              {imagePreview && (
                <div className="relative w-7 h-7 rounded-full bg-[#0f172a] border border-white/10 overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "";
                      handleRemoveImage();
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  >
                    <X className="w-3 h-3 text-red-500" />
                  </button>
                </div>
              )}
            </div>
            <div className="relative flex items-center">
              <Link2 className="absolute left-4 w-4 h-4 text-gray-500" />
              <input
                type="url"
                disabled={loading || googleLoading}
                placeholder="https://example.com/your-photo.jpg"
                value={formData.imageUrl}
                onChange={handleUrlChange}
                className="w-full bg-[#0f172a] border border-white/5 focus:border-orange-500/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 outline-hidden transition-all duration-300 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Role Selection Field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                disabled={loading || googleLoading}
                onClick={() => setFormData({ ...formData, role: "user" })}
                className={`flex items-center justify-center gap-3 p-3 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer disabled:opacity-50 ${
                  formData.role === "user"
                    ? "bg-orange-600/10 border-orange-500 text-orange-500 shadow-md"
                    : "bg-[#0f172a] border-white/5 text-gray-400 hover:border-white/10"
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>User</span>
              </button>

              <button
                type="button"
                disabled={loading || googleLoading}
                onClick={() => setFormData({ ...formData, role: "admin" })}
                className={`flex items-center justify-center gap-3 p-3 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer disabled:opacity-50 ${
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
            disabled={loading || googleLoading}
            className="w-full inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-800 disabled:cursor-not-allowed text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-orange-950/20 transition-all duration-300 transform active:scale-95 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
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