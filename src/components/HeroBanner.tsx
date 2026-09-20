"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Sparkles,
  ShieldCheck,
  Ticket,
  Users,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Tag,
  Loader2,
} from "lucide-react";

// ইভেন্ট ডাটা টাইপ
interface EventItem {
  _id: string;
  title: string;
  category: string;
  date: string;
  time?: string;
  location: string;
  price: string | number;
  image: string;
}

export default function HeroBanner() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // ব্যাকএন্ড API থেকে ডাইনামিক ডাটা ফেচ করা
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:8085/events");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setEvents(data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // অটো-স্লাইডার ইফেক্ট
  useEffect(() => {
    if (isHovered || events.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % events.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered, events.length]);

  const handlePrev = () => {
    if (events.length === 0) return;
    setActiveIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (events.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % events.length);
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#0a0f1d] text-slate-200 font-sans relative overflow-hidden flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      {/* Background Ambient Glow */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-orange-500/15 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[140px] pointer-events-none" />

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12 relative z-10">
        
        {/* Left Column */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
            <span className="tracking-wider uppercase text-[11px]">
              Discover Unforgettable Experiences
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
            Don't Just Exist. <br />
            Experience with{" "}
            <span className="bg-gradient-to-r from-orange-400 via-amber-500 to-orange-600 bg-clip-text text-transparent">
              EventHive
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-xl mb-8 leading-relaxed font-normal">
            Find and book tickets to the best concerts, tech conferences,
            sports tournaments, and local meetups. Your gateway to the most
            happening events around you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-xl transition-all duration-300 shadow-lg shadow-orange-600/30 active:scale-[0.98]"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

            <Link
              href="/create-event"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 hover:text-white rounded-xl border border-slate-800 transition-all duration-300 active:scale-[0.98] backdrop-blur-md"
            >
              <Calendar className="w-4 h-4 text-orange-400" />
              <span>Host an Event</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Dynamic 3D Carousel */}
        <div
          className="lg:col-span-6 w-full flex flex-col items-center justify-center relative select-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative w-full h-[380px] flex items-center justify-center [perspective:1200px]">
            {loading ? (
              <div className="flex flex-col items-center gap-3 text-orange-400">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-sm font-medium text-slate-400">Loading Events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-slate-400 text-sm">No events found in database.</div>
            ) : (
              events.map((event, index) => {
                const offset = (index - activeIndex + events.length) % events.length;
                let adjustedOffset = offset;
                if (offset > events.length / 2) {
                  adjustedOffset = offset - events.length;
                }

                const isActive = adjustedOffset === 0;

                return (
                  <motion.div
                    key={event._id}
                    onClick={() => setActiveIndex(index)}
                    initial={false}
                    animate={{
                      x: adjustedOffset * 110,
                      scale: isActive ? 1 : 1 - Math.abs(adjustedOffset) * 0.18,
                      rotateY: adjustedOffset * -25,
                      zIndex: 20 - Math.abs(adjustedOffset),
                      opacity: Math.abs(adjustedOffset) > 1 ? 0 : isActive ? 1 : 0.45,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 25,
                    }}
                    className={`absolute w-[280px] h-[350px] rounded-3xl overflow-hidden cursor-pointer border bg-slate-900/90 shadow-2xl backdrop-blur-xl flex flex-col justify-between group ${
                      isActive
                        ? "border-orange-500/60 ring-4 ring-orange-500/20 shadow-orange-500/10"
                        : "border-slate-800 hover:border-slate-700"
                    }`}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Event Image Header */}
                    <div className="relative w-full h-[58%] overflow-hidden bg-slate-950">
                      <img
                        src={event.image || "https://via.placeholder.com/600x400?text=Event"}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

                      <div className="absolute top-3 left-3">
                        <span className="bg-orange-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-lg tracking-wider shadow-md">
                          {event.category || "General"}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-orange-400 text-xs font-bold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {typeof event.price === "number" ? `$${event.price}` : event.price || "Free"}
                      </div>
                    </div>

                    {/* Event Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between bg-slate-900/95">
                      <div>
                        <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-orange-400 transition-colors">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1.5">
                          <Clock className="w-3.5 h-3.5 text-orange-400" />
                          <span>
                            {event.date} {event.time ? `• ${event.time}` : ""}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-semibold border-t border-slate-800/80 pt-3 mt-2">
                        <span className="text-slate-400 flex items-center gap-1 line-clamp-1">
                          <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                          {event.location}
                        </span>
                        <Link
                          href={`/events/${event._id}`}
                          className="text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-all shrink-0"
                        >
                          Book <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Slider Controls */}
          {!loading && events.length > 0 && (
            <div className="flex items-center gap-6 mt-2 z-30">
              <button
                onClick={handlePrev}
                className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-orange-600 hover:border-orange-600 text-slate-300 hover:text-white transition-all active:scale-95 shadow-md"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                {events.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeIndex === idx
                        ? "w-6 bg-orange-500"
                        : "w-2 bg-slate-800 hover:bg-slate-700"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-orange-600 hover:border-orange-600 text-slate-300 hover:text-white transition-all active:scale-95 shadow-md"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Feature Footer */}
      <div className="border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3.5 justify-center sm:justify-start">
            <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                Instant Ticketing
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Get your QR pass immediately via email
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 justify-center sm:justify-start border-y sm:border-y-0 sm:border-x border-slate-800/80 py-4 sm:py-0 sm:px-6">
            <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                Verified Hosts
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                100% authentic and trusted event organizers
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 justify-center sm:justify-start">
            <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                Secure Payments
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Fully encrypted safe checkout gateway
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}