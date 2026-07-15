"use client";
import React, { useEffect, useState } from "react";
import { 
  Trash2, 
  Search, 
  Loader2, 
  User, 
  Mail, 
  Shield, 
  Sparkles,
  Filter
} from "lucide-react";

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role?: string;  // e.g., 'admin' | 'user'
  plan?: string;  // e.g., 'pro' | 'free'
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8085";

  // ডাটাবেজ থেকে সব ইউজার লোড করা
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ইউজার ডিলিট করার ফাংশন
  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? 😲 This will remove their account permanently!")) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("🗑️ User removed successfully!");
        setUsers((prev) => prev.filter((u) => u._id !== id));
      } else {
        alert("❌ Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("❌ Something went wrong!");
    } finally {
      setDeletingId(null);
    }
  };

  // সার্চ এবং প্ল্যান ফিল্টারিং লজিক
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const userPlan = u.plan || "free";
    const matchesPlan = selectedPlan === "All" || userPlan.toLowerCase() === selectedPlan.toLowerCase();
    
    return matchesSearch && matchesPlan;
  });

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-white">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white pb-12">
      
      {/* 👑 ১. হেডার সেকশন */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-black tracking-tight">Registered Users</h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage and monitor all active accounts on EventHive. Total users: {users.length}
        </p>
      </div>

      {/* 🔍 ২. সার্চ এবং ফিল্টার বার */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* সার্চ ইনপুট */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-3.5 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0b1120] border border-white/5 focus:border-orange-500 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none transition-colors"
          />
        </div>

        {/* প্ল্যান ড্রপডাউন ফিল্টার */}
        <div className="relative">
          <Filter className="absolute left-4 top-3.5 text-orange-500" size={18} />
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="w-full bg-[#0b1120] border border-white/5 focus:border-orange-500 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none cursor-pointer appearance-none"
          >
            <option value="All">All Plans</option>
            <option value="pro">Pro Members</option>
            <option value="free">Free Members</option>
          </select>
        </div>
      </div>

      {/* 📊 ৩. ইউজার টেবিল কার্ড */}
      <div className="bg-[#0b1120] border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="py-20 text-center text-gray-500 text-sm">
            No users match your criteria. 👥
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-white/5 bg-[#080d1a]">
                  <th className="py-4 px-6">User Info</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">System Role</th>
                  <th className="py-4 px-6">Membership Plan</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300 font-medium">
                {filteredUsers.map((u) => {
                  const isPro = u.plan?.toLowerCase() === "pro";
                  const isAdmin = u.role?.toLowerCase() === "admin";

                  return (
                    <tr key={u._id} className="hover:bg-white/[0.01] transition-colors">
                      {/* ইউজার নেম ও অবতার */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                            {u.name ? u.name.charAt(0).toUpperCase() : <User size={16} />}
                          </div>
                          <div>
                            <span className="text-white font-bold block text-sm">
                              {u.name || "Anonymous User"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* ইমেইল */}
                      <td className="py-4 px-6">
                        <span className="text-gray-400 flex items-center gap-1.5 text-xs">
                          <Mail size={12} className="text-gray-500" /> {u.email}
                        </span>
                      </td>

                      {/* সিস্টেম রোল */}
                      <td className="py-4 px-6">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            <Shield size={12} /> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <User size={12} /> Member
                          </span>
                        )}
                      </td>

                      {/* মেম্বারশিপ প্ল্যান */}
                      <td className="py-4 px-6">
                        {isPro ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border border-orange-500/30 animate-pulse">
                            <Sparkles size={12} /> PRO
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/5 text-gray-400 border border-white/10">
                            Free
                          </span>
                        )}
                      </td>

                      {/* ডিলিট বাটন */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          disabled={deletingId === u._id}
                          className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-all border border-rose-500/10 disabled:opacity-50 cursor-pointer"
                          title="Delete User"
                        >
                          {deletingId === u._id ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}