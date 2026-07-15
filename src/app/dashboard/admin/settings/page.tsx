"use client";
import React, { useState, useEffect } from "react";
import { 
  Shield, 
  Settings, 
  Lock, 
  Save, 
  Loader2, 
  Mail, 
  Globe, 
  Database,
  AlertOctagon
} from "lucide-react";

interface AdminProfile {
  name: string;
  email: string;
  role: string;
}

interface SystemConfig {
  siteName: string;
  maintenanceMode: boolean;
  commissionRate: number;
  contactEmail: string;
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "system" | "security">("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // অ্যাডমিন প্রোফাইল স্টেট
  const [profile, setProfile] = useState<AdminProfile>({
    name: "",
    email: "",
    role: "Admin"
  });

  // গ্লোবাল সিস্টেম কনফিগারেশন স্টেট
  const [system, setSystem] = useState<SystemConfig>({
    siteName: "EventHive",
    maintenanceMode: false,
    commissionRate: 10,
    contactEmail: "admin@eventhive.com"
  });

  // পাসওয়ার্ড স্টেট
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8085";
  const loggedInAdminEmail = "admin@example.com"; // এখানে আপনার লগইন করা অ্যাডমিনের ডাইনামিক ইমেইল বসবে

  // ১. পেজ লোড হলে অ্যাডমিন প্রোফাইল ও সিস্টেম কনফিগারেশন ডাটা নিয়ে আসা
  useEffect(() => {
    const fetchAdminSettings = async () => {
      try {
        // প্রোফাইল ডাটা লোড
        const profileRes = await fetch(`${BACKEND_URL}/api/users/profile?email=${loggedInAdminEmail}`);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile({
            name: profileData.name || "Admin",
            email: profileData.email || loggedInAdminEmail,
            role: profileData.role || "admin"
          });
        }

        // সিস্টেম গ্লোবাল কনফিগ লোড (ডাটাবেজ থেকে)
        const configRes = await fetch(`${BACKEND_URL}/api/admin/system-config`);
        if (configRes.ok) {
          const configData = await configRes.json();
          setSystem({
            siteName: configData.siteName || "EventHive",
            maintenanceMode: configData.maintenanceMode ?? false,
            commissionRate: configData.commissionRate ?? 10,
            contactEmail: configData.contactEmail || "admin@eventhive.com"
          });
        }
      } catch (error) {
        console.error("Error loading admin settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminSettings();
  }, [BACKEND_URL]);

  // প্রোফাইল সেভ
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/profile/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profile.email, name: profile.name })
      });
      if (res.ok) alert("🎉 Admin Profile updated successfully!");
      else alert("❌ Failed to update profile.");
    } catch (error) {
      console.error(error);
      alert("❌ Error saving profile!");
    } finally {
      setSaving(false);
    }
  };

  // সিস্টেম সেটিংস সেভ (যেমন: সাইটের নাম, মেইনটেন্যান্স মোড)
  const handleSystemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/system-config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(system)
      });
      if (res.ok) alert("⚙️ System configurations saved globally!");
      else alert("❌ Failed to update system configuration.");
    } catch (error) {
      console.error(error);
      alert("❌ Error saving settings!");
    } finally {
      setSaving(false);
    }
  };

  // পাসওয়ার্ড সেভ
  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("🔒 Password changed successfully!");
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        alert(`❌ ${data.message || "Failed to change password."}`);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-white">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white pb-12">
      
      {/* 👑 হেডার */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <Shield className="text-orange-500 animate-pulse" size={32} /> Admin Control & Settings
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Configure site-wide parameters, edit your admin profile, and manage application status.
        </p>
      </div>

      {/* 📑 ৩টি এডমিন ট্যাব */}
      <div className="flex border-b border-white/5 gap-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "profile" ? "border-orange-500 text-orange-500" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <Shield size={16} /> Admin Profile
        </button>
        <button
          onClick={() => setActiveTab("system")}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "system" ? "border-orange-500 text-orange-500" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <Settings size={16} /> System Control
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "security" ? "border-orange-500 text-orange-500" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <Lock size={16} /> Security
        </button>
      </div>

      {/* 🧱 কন্টেন্ট বক্স */}
      <div className="bg-[#0b1120] border border-white/5 p-8 rounded-3xl shadow-2xl">
        
        {/* 👤 ১. অ্যাডমিন প্রোফাইল */}
        {activeTab === "profile" && (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-orange-400">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Admin Display Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                  className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Mail size={14} className="text-gray-500" /> Admin Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full bg-[#0f172a]/50 border border-white/5 rounded-2xl px-4 py-3.5 text-sm text-gray-500 cursor-not-allowed focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <span className="text-xs text-gray-500 block uppercase font-bold tracking-wider">Assigned Role</span>
              <span className="text-purple-400 font-bold text-sm bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-xl inline-block mt-2 uppercase tracking-wide">
                👑 {profile.role}
              </span>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-orange-500/10 cursor-pointer"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Save Profile Details
            </button>
          </form>
        )}

        {/* ⚙️ ২. সিস্টেম কন্ট্রোল (অ্যাডমিন স্পেশাল) */}
        {activeTab === "system" && (
          <form onSubmit={handleSystemSubmit} className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-orange-400">
              <Globe size={20} /> Website Parameters
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Website Name</label>
                <input
                  type="text"
                  value={system.siteName}
                  onChange={(e) => setSystem({ ...system, siteName: e.target.value })}
                  required
                  className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Default Ticket Tax/Commission (%)</label>
                <input
                  type="number"
                  value={system.commissionRate}
                  onChange={(e) => setSystem({ ...system, commissionRate: parseFloat(e.target.value) || 0 })}
                  required
                  className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            {/* মেইনটেন্যান্স মোড টগল */}
            <div className="p-5 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex items-center justify-between mt-4">
              <div className="flex items-start gap-3">
                <AlertOctagon className="text-yellow-500 mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-sm text-white">Maintenance Mode</h4>
                  <p className="text-xs text-gray-500">Enable this to prevent general users from purchasing tickets or creating events.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={system.maintenanceMode}
                  onChange={(e) => setSystem({ ...system, maintenanceMode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#0f172a] rounded-full peer peer-focus:ring-2 peer-focus:ring-orange-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500 peer-checked:after:bg-white"></div>
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-orange-500/10 cursor-pointer"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Apply System Changes
            </button>
          </form>
        )}

        {/* 🔒 ৩. সিকিউরিটি */}
        {activeTab === "security" && (
          <form onSubmit={handleSecuritySubmit} className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-orange-400">
              Update Admin Password
            </h2>
            <div className="space-y-6 max-w-md">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Current Password</label>
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">New Password</label>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Confirm New Password</label>
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-orange-500/10 cursor-pointer"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Save New Security Key
            </button>
          </form>
        )}

      </div>
    </div>
  );
}