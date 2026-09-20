"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 👈 useRouter Import করা হয়েছে
import { authClient } from "@/lib/auth-client";
import { User, Mail, Shield, Save, Loader2, CheckCircle2 } from "lucide-react";

interface UserProfile {
  _id?: string;
  name: string;
  email: string;
  role?: string;
  plan?: string;
  image?: string;
}

export default function ProfilePage() {
  const router = useRouter(); // 👈 Router Declare করা হয়েছে
  const { data: session, isPending: authLoading } = authClient.useSession();
  const currentUser = session?.user;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ১. ডাইনামিক প্রোফাইল ডাটা ফেচিং
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser?.email) return;

      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8085"}/api/users/profile?email=${currentUser.email}`
        );
        
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setName(data.name || currentUser.name || "");
        } else {
          setName(currentUser.name || "");
          setProfile({
            name: currentUser.name || "",
            email: currentUser.email || "",
            image: currentUser.image || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUserProfile();
    }
  }, [currentUser]);

  // ২. প্রোফাইল নাম আপডেট হ্যান্ডলার
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.email) return;

    setUpdating(true);
    setMessage(null);

    try {
      // এক্সপ্রেস ডাটাবেজে নাম আপডেট
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8085"}/api/users/profile/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: currentUser.email,
            name: name,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        // Better-Auth সেশন আপডেট
        await authClient.updateUser({
          name: name,
        });

        // নেভবারকে সাথে সাথে নতুন নাম জানানোর ইভেন্ট ট্রিগার
        window.dispatchEvent(new CustomEvent("user-profile-updated", { detail: { name } }));

        setMessage({ type: "success", text: "Profile updated successfully!" });
        setProfile((prev) => (prev ? { ...prev, name } : null));

        // Router Refresh
        router.refresh();
      } else {
        throw new Error(data.message || "Failed to update profile");
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Something went wrong" });
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 py-12 px-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Subtitle */}
        <div>
          <p className="text-slate-400 text-sm font-normal">
            Manage your personal profile information and settings.
          </p>
        </div>

        {/* Success / Error Message Alert */}
        {message && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              message.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            {message.type === "success" && <CheckCircle2 size={16} />}
            {message.text}
          </div>
        )}

        {/* Main Content Layout */}
        <div className="grid md:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Profile Card */}
          <div className="md:col-span-5 bg-[#1e293b]/70 border border-slate-700/60 rounded-3xl p-8 flex flex-col items-center text-center space-y-6 shadow-xl">
            
            {/* User Avatar */}
            <div className="relative">
              <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#0f172a] flex items-center justify-center">
                  {profile?.image || currentUser?.image ? (
                    <img
                      src={profile?.image || currentUser?.image}
                      alt={profile?.name || "User Avatar"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-white">
                      {(profile?.name || currentUser?.name || "U")[0].toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Name & Email */}
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white tracking-wide">
                {profile?.name || currentUser?.name}
              </h2>
              <p className="text-slate-400 text-xs font-medium">
                {profile?.email || currentUser?.email}
              </p>
            </div>

            <hr className="w-full border-slate-700/50" />

            {/* Plan Badge */}
            <div className="w-full flex items-center justify-between text-xs font-medium px-2">
              <div className="flex items-center gap-2 text-slate-400">
                <Shield size={16} />
                <span>Plan</span>
              </div>
              <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">
                {profile?.plan || "PRO"}
              </span>
            </div>
          </div>

          {/* Right Side: Edit Form */}
          <div className="md:col-span-7 bg-[#1e293b]/70 border border-slate-700/60 rounded-3xl p-8 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Edit Profile Details
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              
              {/* Full Name Field */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0f172a] border border-slate-700/80 focus:border-orange-500 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none transition-all font-medium"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>

              {/* Email Field (Disabled) */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400">
                  Email Address (Cannot be changed)
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="email"
                    value={profile?.email || currentUser?.email || ""}
                    disabled
                    className="w-full bg-[#0f172a]/60 border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-slate-500 cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={updating}
                  className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-600/20 disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      SAVE CHANGES
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
}