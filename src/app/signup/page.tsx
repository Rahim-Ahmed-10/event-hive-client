"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, UserCheck, Link2, X, Loader2 } from "lucide-react";
// আপনার প্রজেক্টের সঠিক পাথ অনুযায়ী authClient ইমপোর্ট নিশ্চিত করুন
import { authClient } from "@/lib/auth-client"; 

export default function SignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); 
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

  // 📝 সাবমিট হ্যান্ডলার
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
      // 🎯 Better-Auth ক্লায়েন্ট ব্যবহার করে সাইন আপ
      const { data, error: authError } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        image: formData.imageUrl || "https://encrypted-tbn0.gstatic.com/images", 
        
        // ✨ ফিক্স: কাস্টম ফিল্ডগুলো সরাসরি রুট অবজেক্টের প্রোপার্টি হিসেবে পাস করা হলো
        role: formData.role, // বাটন থেকে সিলেক্ট করা "user" বা "admin" ডাইরেক্ট যাবে
        plan: "free"
      });

      if (authError) {
        setError(authError.message || "Something went wrong.");
        setLoading(false);
        return;
      }

      // সফল হলে সাকসেস মেসেজ দেখাবে
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
          
          {/* ❌ এরর মেসেজ */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-2xl text-center">
              {error}
            </div>
          )}

          {/* ⚡ সাকসেস মেসেজ */}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs p-3.5 rounded-2xl text-center">
              {success}
            </div>
          )}

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

          {/* Profile Image URL Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Profile Image URL
              </label>
              {imagePreview && (
                <div className="relative w-7 h-7 rounded-full bg-[#0f172a] border border-white/10 overflow-hidden group">
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
                placeholder="https://example.com/your-photo.jpg"
                value={formData.imageUrl}
                onChange={handleUrlChange}
                className="w-full bg-[#0f172a] border border-white/5 focus:border-orange-500/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 outline-hidden transition-all duration-300"
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
            disabled={loading}
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