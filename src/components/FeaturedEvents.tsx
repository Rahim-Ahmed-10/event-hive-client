"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Tag } from "lucide-react";

// ডামি ইভেন্ট ডাটা
const dummyEvents = [
  {
    id: 1,
    title: "Echoes of Rock Concert 2026",
    category: "Music",
    date: "July 28, 2026",
    time: "07:00 PM",
    location: "International Convention City, Dhaka",
    price: "$25",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=600",
    badge: "Selling Fast"
  },
  {
    id: 2,
    title: "NextGen Tech Conference & Expo",
    category: "Tech",
    date: "August 05, 2026",
    time: "10:00 AM",
    location: "Bangabandhu International Conference Center",
    price: "Free",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600",
    badge: "Trending"
  },
  {
    id: 3,
    title: "National Football Championship Final",
    category: "Sports",
    date: "August 12, 2026",
    time: "04:00 PM",
    location: "Army Stadium, Dhaka",
    price: "$10",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600",
    badge: "Popular"
  }
];

export default function FeaturedEvents() {
  const [activeTab, setActiveTab] = useState("All");
  const categories = ["All", "Music", "Tech", "Sports"];

  const filteredEvents = activeTab === "All" 
    ? dummyEvents 
    : dummyEvents.filter(event => event.category === activeTab);

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

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 bg-[#0b1120] p-1.5 rounded-xl border border-white/5">
            {categories.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-orange-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div 
              key={event.id}
              className="group bg-[#0b1120] border border-white/5 rounded-3xl overflow-hidden shadow-xl hover:border-orange-500/30 transition-all duration-300 flex flex-col h-full"
            >
              {/* Image Box */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-800">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Floating Badge */}
                <span className="absolute top-4 left-4 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md">
                  {event.badge}
                </span>
                {/* Floating Price */}
                <span className="absolute bottom-4 right-4 bg-[#0f172a]/90 backdrop-blur-md border border-white/10 text-orange-400 text-xs font-black px-3 py-1.5 rounded-xl">
                  {event.price}
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
                  href={`/events/${event.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 text-xs font-bold text-white bg-white/5 group-hover:bg-orange-600 rounded-2xl border border-white/10 group-hover:border-transparent transition-all duration-300 cursor-pointer"
                >
                  <span>Get Tickets</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>

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