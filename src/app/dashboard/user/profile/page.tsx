"use client";
import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { 
  User, 
  Mail, 
  Image as ImageIcon, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Edit2, 
  X, 
  Shield, 
  Zap 
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, isPending: sessionLoading, refetch } = authClient.useSession();
  const currentUser = session?.user;

  // হাইড্রেশন এরর এড়ানোর জন্য মাউন্ট স্টেট
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ইনপুট ফিল্ডের স্টেট
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
      setImageUrl(currentUser.image || "");
    }
  }, [currentUser]);

  if (!mounted || sessionLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b1329] text-white">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }
const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage(null);

    try {
      // 🚀 এখান থেকে email সরিয়ে ফেলা হলো, শুধু name এবং image আপডেট হবে
      const { data, error } = await authClient.updateUser({
        name: name,
        image: imageUrl,
      });

      if (error) {
        throw new Error(error.message || "Failed to update profile");
      }

      // সেশন ডাটা রিফ্রেশ করা
      await refetch();

      setMessage({ type: "success", text: "Profile updated successfully! 🎉" });
      setIsEditing(false);

      // ৩ সেকেন্ড পর সাকসেস মেসেজটি হাওয়া হয়ে যাবে
      setTimeout(() => {
        setMessage(null);
      }, 3000);

    } catch (err: any) {
      console.error("Update Error:", err);
      setMessage({ type: "error", text: err.message || "Something went wrong." });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6 md:p-8 text-white min-h-screen bg-[#0b1329] flex flex-col justify-center max-w-2xl mx-auto space-y-6">
      
      {/* হেডার সেকশন */}
      <div className="flex items-center justify-between border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            My <span className="text-orange-500">Profile</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            View and manage your account settings and profile details.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-orange-600/10 hover:bg-orange-600 text-orange-400 hover:text-white border border-orange-500/20 hover:border-orange-500 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
          >
            <Edit2 size={14} /> Edit Profile
          </button>
        )}
      </div>

      {/* সাকসেস বা এরর মেসেজ */}
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-semibold border ${
          message.type === "success" 
            ? "bg-green-500/10 border-green-500/20 text-green-400" 
            : "bg-red-500/10 border-red-500/20 text-red-400"
        }`}>
          {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* প্রোফাইল কার্ড / এডিট ফর্ম */}
      {!isEditing ? (
        /* ভিউ মোড */
        <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-8 space-y-8 shadow-xl relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-32 h-32 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/5">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-orange-500/30 bg-[#1e293b] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={imageUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"} 
                alt="Profile Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center sm:text-left space-y-1.5">
              <h2 className="text-2xl font-extrabold text-white">{name || "User Name"}</h2>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <span className="px-3 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/10 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                  <Zap size={10} /> {currentUser?.plan || "free"}
                </span>
                <span className="px-3 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/10 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                  <Shield size={10} /> {currentUser?.role || "user"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Full Name</p>
              <div className="flex items-center gap-2.5 text-gray-200 font-medium">
                <User size={16} className="text-orange-500" />
                <span>{name}</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email Address</p>
              <div className="flex items-center gap-2.5 text-gray-200 font-medium">
                <Mail size={16} className="text-orange-500" />
                <span className="break-all">{email}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* এডিট মোড */
        <form onSubmit={handleUpdate} className="space-y-6 bg-[#0f172a] p-6 rounded-3xl border border-white/10 shadow-2xl">
          
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="text-sm font-bold uppercase tracking-widest text-orange-500">Editing Profile Details</span>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setName(currentUser?.name || "");
                setEmail(currentUser?.email || "");
                setImageUrl(currentUser?.image || "");
              }}
              className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* লাইভ প্রিভিউ */}
          <div className="flex items-center gap-4 bg-[#0b1329]/50 p-4 rounded-2xl border border-white/5">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-500/50 bg-[#1e293b] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={imageUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"} 
                alt="Live Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde";
                }}
              />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{name || "Your Name"}</h4>
              <p className="text-[10px] text-gray-500">Avatar Live Preview</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <User size={14} className="text-orange-500" /> Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-[#0b1329] border border-white/10 rounded-xl text-sm text-white focus:border-orange-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <ImageIcon size={14} className="text-orange-500" /> Profile Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste image address/URL"
              className="w-full px-4 py-3 bg-[#0b1329] border border-white/10 rounded-xl text-sm text-white focus:border-orange-500 focus:outline-none transition-colors placeholder:text-gray-600"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setName(currentUser?.name || "");
                setEmail(currentUser?.email || "");
                setImageUrl(currentUser?.image || "");
              }}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest rounded-xl text-gray-300 transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-600/50 text-xs font-bold uppercase tracking-widest rounded-xl text-white transition-all shadow-lg shadow-orange-950/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {updating ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}