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
  Filter,
  Sparkles,
  CalendarDays,
  Tag,
  X,
  CheckCircle2
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

  // ✏️ Edit Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [updating, setUpdating] = useState(false);

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
    } finally { // 👈 ekhane 'fontally' chhilo, seta 'finally' hobe
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

  // 📝 Modal ওপেন করা ও বর্তমান ডাটা লোড
  const handleOpenEditModal = (event: EventItem) => {
    setEditingEvent({ ...event });
    setIsModalOpen(true);
  };

  // 💾 ইভেন্ট আপডেট করার ফাংশন (PUT Request)
  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    setUpdating(true);
    try {
      const res = await fetch(`${BACKEND_URL}/events/${editingEvent._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingEvent),
      });

      if (res.ok) {
        alert("🎉 Event updated successfully!");
        // UI স্টেট আপডেট
        setEvents((prev) =>
          prev.map((item) => (item._id === editingEvent._id ? editingEvent : item))
        );
        setIsModalOpen(false);
      } else {
        alert("❌ Failed to update event.");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      alert("❌ Something went wrong!");
    } finally {
      setUpdating(false);
    }
  };

  // সার্চ এবং ক্যাটাগরি ফিল্টারিং
  const filteredEvents = events.filter((event) => {
    const matchesSearch = 
      (event.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.location || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...Array.from(new Set(events.map((e) => e.category).filter(Boolean)))];

  if (loading) {
    return (
      <div className="flex h-[75vh] flex-col items-center justify-center gap-4 text-white">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          <CalendarDays className="absolute text-orange-500 animate-pulse" size={24} />
        </div>
        <p className="text-xs font-semibold tracking-widest uppercase text-slate-400">Loading All Events...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-slate-100 font-sans pb-12 relative">
      
      {/* 👑 ১. মডার্ন হেডার ব্যানার */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] p-8 border border-slate-800/80 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
              <Sparkles size={14} /> Event Control Panel
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Events</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Organize, edit, and update all live events published on EventHive. Total active events: <span className="text-white font-bold">{events.length}</span>
            </p>
          </div>

          <Link
            href="/dashboard/admin/create-event"
            className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-6 py-3.5 rounded-2xl text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-300 w-fit shrink-0 active:scale-95"
          >
            <Plus size={18} />
            <span>Create New Event</span>
          </Link>
        </div>
      </div>

      {/* 🔍 ২. সার্চ এবং ফিল্টার বার */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by event title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0f172a]/80 backdrop-blur-md border border-slate-800 focus:border-orange-500 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-4 top-3.5 text-orange-400 pointer-events-none" size={18} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#0f172a]/80 backdrop-blur-md border border-slate-800 focus:border-orange-500 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-white focus:outline-none cursor-pointer appearance-none shadow-inner"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-[#0f172a] text-white">
                {cat === "All" ? "All Categories" : cat}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-4 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* 📊 ৩. ইভেন্ট টেবিল কার্ড */}
      <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {filteredEvents.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
              <Search size={24} />
            </div>
            <p className="text-slate-400 text-sm font-medium">No events match your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-slate-800 bg-slate-900/50">
                  <th className="py-4 px-6">Event Details</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Schedule</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
                {filteredEvents.map((event) => (
                  <tr key={event._id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-4 px-6 max-w-[320px]">
                      <div className="flex items-center gap-4">
                        <img 
                          src={event.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4"} 
                          alt={event.title} 
                          className="w-14 h-14 object-cover rounded-2xl border border-slate-700/80 group-hover:border-orange-500/40 transition-all shadow-md shrink-0"
                        />
                        <div className="truncate space-y-0.5">
                          <span className="text-white font-bold block text-base group-hover:text-orange-400 transition-colors truncate">
                            {event.title}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1 truncate">
                            <MapPin size={13} className="text-orange-500 shrink-0" /> 
                            <span>{event.location || "N/A"}</span>
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold text-xs rounded-xl">
                        <Tag size={12} />
                        {event.category || "General"}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <span className="text-slate-200 text-xs font-semibold flex items-center gap-1.5">
                          <Calendar size={13} className="text-amber-400" /> 
                          {event.date ? new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                        </span>
                        <span className="text-[11px] text-slate-400 block pl-[18px]">
                          {event.time || "TBA"}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-emerald-400 font-black text-base">
                        ${event.price}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* ✏️ Edit Button -> Popup Modal Triggers */}
                        <button
                          onClick={() => handleOpenEditModal(event)}
                          className="p-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all border border-blue-500/20 hover:scale-105 active:scale-95 cursor-pointer"
                          title="Edit Event"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(event._id)}
                          disabled={deletingId === event._id}
                          className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-all border border-rose-500/20 hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
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

      {/* 🚀 ৪. EDIT EVENT POPUP MODAL */}
      {isModalOpen && editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-orange-500/10 rounded-xl text-orange-400 border border-orange-500/20">
                  <Edit size={18} />
                </div>
                <h2 className="text-xl font-bold text-white">Edit Event Details</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleUpdateEvent} className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
              
              {/* Event Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Event Title</label>
                <input
                  type="text"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  required
                  className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                  <input
                    type="text"
                    value={editingEvent.category}
                    onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                    required
                    className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={editingEvent.price}
                    onChange={(e) => setEditingEvent({ ...editingEvent, price: Number(e.target.value) })}
                    required
                    className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={editingEvent.date ? editingEvent.date.split("T")[0] : ""}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    required
                    className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Time</label>
                  <input
                    type="text"
                    value={editingEvent.time}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    placeholder="e.g. 10:00 AM"
                    required
                    className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Location</label>
                <input
                  type="text"
                  value={editingEvent.location}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  required
                  className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingEvent.image}
                  onChange={(e) => setEditingEvent({ ...editingEvent, image: e.target.value })}
                  required
                  className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-lg shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}