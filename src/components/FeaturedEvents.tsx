import React from "react";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Tag } from "lucide-react";

// ১. ডাটার জন্য টাইপস্ক্রিপ্ট ইন্টারফেস ডিক্লেয়ারেশন
interface EventItem {
  _id: string; // ডাটাবেজের আইডি সাধারণত _id হয়
  id?: string | number;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  price: string | number;
  image: string;
  badge?: string;
}

// ২. সার্ভার থেকে ডাটা ফেচ করার ফাংশন
async function getFeaturedEvents(): Promise<EventItem[]> {
  // আপনার এক্সপ্রেস ব্যাকএন্ডের সঠিক URL দিন
  const res = await fetch("http://localhost:8085/events", {
    cache: "no-store", // প্রতিবার লাইভ ডাটা পাওয়ার জন্য
  });

  if (!res.ok) {
    throw new Error("Failed to fetch featured events");
  }

  return res.json();
}

// ৩. মেইন কম্পোনেন্ট (Async Server Component)
export default async function FeaturedEvents() {
  // সার্ভার থেকে ডাটা নিয়ে আসা
  const allEvents = await getFeaturedEvents();

  // 🎯 শুধুমাত্র প্রথম ৩টি কার্ড বা ইভেন্ট সিলেক্ট করা হলো
  const featuredEvents = allEvents.slice(0, 3);

  return (
    <div className="bg-[#0f172a] text-gray-300 py-20 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-6 w-full">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest block mb-2">
              💥 Don't Miss Out
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Featured <span className="text-orange-500">Events</span> Near You
            </h2>
          </div>
        </div>

        {/* Events Grid Layout (সর্বোচ্চ ৩টি দেখাবে) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredEvents.map((event) => (
            <div 
              key={event._id || event.id}
              className="group bg-[#0b1120] border border-white/5 rounded-3xl overflow-hidden shadow-xl hover:border-orange-500/30 transition-all duration-300 flex flex-col h-full"
            >
              {/* Image Box */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-800">
                <img 
                  src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Floating Badge (যদি ডাটাবেজে থাকে) */}
                {event.badge && (
                  <span className="absolute top-4 left-4 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md">
                    {event.badge}
                  </span>
                )}
                {/* Floating Price */}
                <span className="absolute bottom-4 right-4 bg-[#0f172a]/90 backdrop-blur-md border border-white/10 text-orange-400 text-xs font-black px-3 py-1.5 rounded-xl">
                  {typeof event.price === "number" ? `$${event.price}` : event.price}
                </span>
              </div>

              {/* Content Box */}
              <div className="p-6 flex flex-col justify-between flex-1 gap-6">
                <div>
                  {/* Category Indicator */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    <Tag className="w-3.5 h-3.5 text-orange-500/70" />
                    <span>{event.category}</span>
                  </div>
                  
                  {/* Event Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-500 transition-colors line-clamp-2 leading-snug">
                    {event.title}
                  </h3>
                </div>

                {/* Event Meta Details */}
                <div className="space-y-3 border-t border-white/5 pt-4 text-xs text-gray-400">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>{event.date} • {event.time}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Link 
                  href={`/events/${event._id || event.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 text-xs font-bold text-white bg-white/5 group-hover:bg-orange-600 rounded-2xl border border-white/10 group-hover:border-transparent transition-all duration-300 cursor-pointer"
                >
                  <span>Get Tickets</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>

        {/* যদি কোনো ডাটা না থাকে */}
        {featuredEvents.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No featured events found.</p>
        )}

        {/* Bottom Call to Action */}
        <div className="text-center mt-16">
          <Link 
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-bold text-orange-500 hover:text-orange-400 transition-colors group"
          >
            <span>View All Upcoming Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}