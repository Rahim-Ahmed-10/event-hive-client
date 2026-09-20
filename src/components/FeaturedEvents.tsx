import React from "react";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Tag, Sparkles, Clock, Ticket } from "lucide-react";

interface EventItem {
  _id: string;
  id?: string | number;
  title: string;
  category: string;
  date: string;
  time?: string;
  location: string;
  price: string | number;
  image: string;
  badge?: string;
}

const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8085";

async function getFeaturedEvents(): Promise<EventItem[]> {
  try {
    const res = await fetch(`${backendUrl}/events`, {
      cache: "no-store",
    });

    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch featured events:", error);
    return [];
  }
}

export default async function FeaturedEvents() {
  const allEvents = await getFeaturedEvents();
  const featuredEvents = allEvents.slice(0, 3);

  return (
    <section className="bg-[#070b14] text-slate-200 py-24 border-t border-slate-800/60 relative overflow-hidden select-none">
      {/* Background Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-purple-600/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span className="tracking-widest uppercase text-[11px]">Handpicked Collections</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Featured <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">Events</span> Near You
            </h2>
          </div>

          <Link
            href="/events"
            className="hidden sm:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-orange-400 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 px-5 py-3 rounded-xl transition-all duration-300 backdrop-blur-md"
          >
            <span>Explore All Events</span>
            <ArrowRight className="w-4 h-4 text-orange-500" />
          </Link>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredEvents.map((event, idx) => {
            const isFirst = idx === 0;

            return (
              <div
                key={event._id || event.id}
                className="group relative bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-orange-500/40 rounded-3xl overflow-hidden shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 flex flex-col h-full hover:-translate-y-2"
              >
                {/* Image Container */}
                <div className="relative w-full h-56 overflow-hidden bg-slate-950">
                  <img
                    src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Category Pill */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="bg-slate-950/80 backdrop-blur-md border border-white/10 text-slate-200 text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-lg tracking-wider shadow-lg flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-orange-400" />
                      {event.category || "General"}
                    </span>

                    {/* Featured / Most Popular Tag */}
                    {(event.badge || isFirst) && (
                      <span className="bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[10px] font-black uppercase px-2.5 py-1.5 rounded-lg tracking-wider shadow-md">
                        {event.badge || "Most Popular"}
                      </span>
                    )}
                  </div>

                  {/* Price Badge */}
                  <div className="absolute bottom-4 right-4 bg-slate-950/90 backdrop-blur-md border border-orange-500/30 text-orange-400 text-xs font-black px-3.5 py-1.5 rounded-xl shadow-xl flex items-center gap-1">
                    <Ticket className="w-3.5 h-3.5" />
                    <span>
                      {typeof event.price === "number"
                        ? `$${event.price}`
                        : event.price || "Free"}
                    </span>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-6 flex flex-col justify-between flex-1 gap-6 bg-slate-900/40">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors duration-300 line-clamp-2 leading-snug">
                      {event.title}
                    </h3>
                  </div>

                  {/* Meta Details Box */}
                  <div className="bg-slate-950/50 rounded-2xl p-3.5 border border-slate-800/60 space-y-2.5 text-xs text-slate-400">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-orange-400 shrink-0" />
                      <span className="font-medium text-slate-300">
                        {event.date} {event.time ? `• ${event.time}` : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                      <span className="line-clamp-1 font-medium text-slate-300">
                        {event.location}
                      </span>
                    </div>
                  </div>

                  {/* Action Link Button */}
                  <Link
                    href={`/events/${event._id || event.id}`}
                    className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white bg-slate-800/80 group-hover:bg-orange-600 rounded-2xl border border-slate-700/80 group-hover:border-transparent transition-all duration-300 shadow-lg active:scale-[0.98]"
                  >
                    <span>Get Tickets Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {featuredEvents.length === 0 && (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
            <p className="text-slate-400 text-sm">No featured events available right now.</p>
          </div>
        )}

        {/* Mobile View All Link */}
        <div className="text-center mt-12 sm:hidden">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 px-6 py-3.5 rounded-xl"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}