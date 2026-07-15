"use client";
import React, { useEffect, useState } from "react";
import { 
  Trash2, 
  Edit, 
  Search, 
  Plus, 
  Loader2, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Filter 
} from "lucide-react";
import Link from "next/link";

interface EventItem {
  _id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  price: number;
  image: string;
  badge?: string;
}

export default function ManageEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8085";

  // ডাটাবেজ থেকে সব ইভেন্ট লোড করা
  const fetchEvents = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/events`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setEvents(data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ইভেন্ট ডিলিট করার ফাংশন
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone! 😮")) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`${BACKEND_URL}/events/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("🗑️ Event deleted successfully!");
        // ডিলিট হওয়া ইভেন্টটি স্টেট থেকে রিমুভ করা
        setEvents((prev) => prev.filter((event) => event._id !== id));
      } else {
        alert("❌ Failed to delete event.");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("❌ Something went wrong!");
    } finally {
      setDeletingId(null);
    }
  };

  // সার্চ এবং ক্যাটাগরি ফিল্টারিং লজিক
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // ইউনিক ক্যাটাগরি বের করা ফিল্টার ড্রপডাউনের জন্য
  const categories = ["All", ...Array.from(new Set(events.map((e) => e.category).filter(Boolean)))];

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Manage Events</h1>
          <p className="text-sm text-gray-400 mt-1">
            Total {events.length} events published on EventHive.
          </p>
        </div>
        <Link
          href="/dashboard/admin/create-event"
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-5 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all text-white w-fit cursor-pointer"
        >
          <Plus size={18} />
          Create Event
        </Link>
      </div>

      {/* 🔍 ২. সার্চ এবং ফিল্টার বার */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* সার্চ ইনপুট */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-3.5 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by event title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0b1120] border border-white/5 focus:border-orange-500 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none transition-colors"
          />
        </div>

        {/* ক্যাটাগরি ড্রপডাউন */}
        <div className="relative">
          <Filter className="absolute left-4 top-3.5 text-orange-500" size={18} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#0b1120] border border-white/5 focus:border-orange-500 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none cursor-pointer appearance-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 📊 ৩. ইভেন্ট টেবিল কার্ড */}
      <div className="bg-[#0b1120] border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
        {filteredEvents.length === 0 ? (
          <div className="py-20 text-center text-gray-500 text-sm">
            No events match your criteria. Try creating a new one! 🚀
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-white/5 bg-[#080d1a]">
                  <th className="py-4 px-6">Event Info</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Date & Time</th>
                  <th className="py-4 px-6">Ticket Price</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300 font-medium">
                {filteredEvents.map((event) => (
                  <tr key={event._id} className="hover:bg-white/[0.01] transition-colors">
                    {/* ইভেন্ট টাইটেল ও থাম্বনেইল */}
                    <td className="py-4 px-6 max-w-[320px]">
                      <div className="flex items-center gap-4">
                        <img 
                          src={event.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4"} 
                          alt={event.title} 
                          className="w-14 h-14 object-cover rounded-xl border border-white/10"
                        />
                        <div className="truncate">
                          <span className="text-white font-bold block text-base hover:text-orange-500 transition-colors cursor-pointer truncate">
                            {event.title}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1 mt-1 truncate">
                            <MapPin size={12} className="text-orange-500" /> {event.location}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* ক্যাটাগরি */}
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 text-orange-400 font-bold text-xs rounded-full">
                        {event.category}
                      </span>
                    </td>

                    {/* ডেট অ্যান্ড টাইম */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                          <Calendar size={12} className="text-orange-500" /> 
                          {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <span className="text-[11px] text-gray-500 block pl-[18px]">
                          {event.time}
                        </span>
                      </div>
                    </td>

                    {/* টিকিট প্রাইস */}
                    <td className="py-4 px-6 font-bold text-green-400 text-base">
                      ${event.price}
                    </td>

                    {/* অ্যাকশন বাটনসমূহ (Edit & Delete) */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* এডিট বাটন */}
                        <Link
                          href={`/dashboard/admin/update-event?id=${event._id}`}
                          className="p-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all border border-blue-500/10"
                          title="Edit Event"
                        >
                          <Edit size={16} />
                        </Link>

                        {/* ডিলিট বাটন */}
                        <button
                          onClick={() => handleDelete(event._id)}
                          disabled={deletingId === event._id}
                          className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-all border border-rose-500/10 disabled:opacity-50 cursor-pointer"
                          title="Delete Event"
                        >
                          {deletingId === event._id ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}