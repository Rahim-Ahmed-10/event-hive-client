"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Tag, 
  Image as ImageIcon, 
  PlusCircle, 
  Loader2, 
  ArrowLeft 
} from "lucide-react";
import Link from "next/link";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Music", // ডিফল্ট সিলেক্টেড
    date: "",
    time: "",
    location: "",
    price: "",
    image: "",
    badge: "Selling Fast" // ডিফল্ট ব্যাজ
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8085";

      // ডাটা টাইপ কনভার্ট করা
      const eventPayload = {
        ...formData,
        price: parseFloat(formData.price) || 0,
      };

      // এখানে আপনার ব্যাকএন্ডের ইভেন্ট ক্রিয়েট করার API কল হচ্ছে
      const response = await fetch(`${BACKEND_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventPayload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("🎉 Event Created Successfully!");
        router.push("/dashboard/admin/manage-events"); // সাকসেস হলে ম্যানেজ ইভেন্ট পেজে নিয়ে যাবে
      } else {
        alert(`❌ Error: ${data.message || "Failed to create event"}`);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("❌ Something went wrong! Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-white pb-12">
      {/* 🔙 ব্যাক বাটন ও হেডার */}
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/admin" 
          className="p-2 bg-[#0b1120] border border-white/5 hover:border-orange-500/30 rounded-xl transition-all"
        >
          <ArrowLeft size={18} className="text-gray-400 hover:text-orange-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-black">Create New Event</h1>
          <p className="text-xs text-gray-400">Add a brand new event to the EventHive platform</p>
        </div>
      </div>

      {/* 📝 ক্রিয়েট ইভেন্ট ফর্ম */}
      <form onSubmit={handleSubmit} className="bg-[#0b1120] border border-white/5 p-8 rounded-3xl shadow-2xl space-y-6">
        
        {/* ১. ইভেন্ট টাইটেল */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Event Title</label>
          <input
            type="text"
            name="title"
            required
            placeholder="e.g., Echoes of Rock Concert 2026"
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {/* ২. ক্যাটাগরি ও ব্যাজ (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Category</label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer"
              >
                <option value="Music">Music</option>
                <option value="Tech">Tech</option>
                <option value="Sports">Sports</option>
                <option value="Business">Business</option>
                <option value="Arts">Arts</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Badge Status</label>
            <select
              name="badge"
              value={formData.badge}
              onChange={handleChange}
              className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="Selling Fast">Selling Fast</option>
              <option value="New">New</option>
              <option value="Featured">Featured</option>
              <option value="Sold Out">Sold Out</option>
            </select>
          </div>
        </div>

        {/* ৩. তারিখ ও সময় (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Calendar size={14} className="text-orange-500" /> Event Date
            </label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Clock size={14} className="text-orange-500" /> Event Time
            </label>
            <input
              type="text"
              name="time"
              required
              placeholder="e.g., 07:00 PM"
              value={formData.time}
              onChange={handleChange}
              className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        {/* ৪. লোকেশন ও টিকিট প্রাইস (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <MapPin size={14} className="text-orange-500" /> Location
            </label>
            <input
              type="text"
              name="location"
              required
              placeholder="e.g., International Convention City, Dhaka"
              value={formData.location}
              onChange={handleChange}
              className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <DollarSign size={14} className="text-orange-500" /> Ticket Price ($)
            </label>
            <input
              type="number"
              name="price"
              required
              placeholder="e.g., 25"
              value={formData.price}
              onChange={handleChange}
              className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        {/* ৫. ইমেজ URL */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <ImageIcon size={14} className="text-orange-500" /> Event Image URL
          </label>
          <input
            type="url"
            name="image"
            required
            placeholder="e.g., https://images.unsplash.com/photo-..."
            value={formData.image}
            onChange={handleChange}
            className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {/* 🚀 সাবমিট বাটন */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-extrabold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-orange-500/10 flex items-center justify-center gap-2 mt-4 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Creating Event...
            </>
          ) : (
            <>
              <PlusCircle size={20} />
              Publish Event
            </>
          )}
        </button>

      </form>
    </div>
  );
}

