"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaSearch } from 'react-icons/fa';
import { LayoutGrid, List, Sparkles, Loader2, ArrowRight, Ticket } from 'lucide-react';
import { authClient } from "@/lib/auth-client";

interface EventItem {
    _id: string;
    title: string;
    category?: string;
    date?: string;
    time?: string;
    location?: string;
    image?: string;
    price?: string | number;
    isFeatured?: boolean;
}

export default function EventAllPage() {
    const { data: session, isPending: sessionLoading } = authClient.useSession();
    
    const [events, setEvents] = useState<EventItem[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<EventItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8085';

    useEffect(() => {
        async function loadEvents() {
            try {
                const token = 
                    session?.session?.token || 
                    (session as any)?.token || 
                    localStorage.getItem("token") || 
                    "";

                const res = await fetch(`${backendUrl}/events`, {
                    cache: 'no-store',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                });
                
                if (!res.ok) throw new Error('Failed to fetch events');
                const data = await res.json();
                
                if (Array.isArray(data)) {
                    setEvents(data);
                    setFilteredEvents(data);
                } else {
                    setEvents([]);
                    setFilteredEvents([]);
                }
            } catch (err: any) {
                console.error("Fetch error:", err);
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        }

        if (!sessionLoading) {
            loadEvents();
        }
    }, [backendUrl, session, sessionLoading]);

    useEffect(() => {
        let result = [...events];

        if (searchTerm.trim() !== '') {
            result = result.filter(event => 
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (selectedCategory !== 'All') {
            result = result.filter(event => event.category === selectedCategory);
        }

        setFilteredEvents(result);
    }, [searchTerm, selectedCategory, events]);

    const categories = ['All', ...Array.from(new Set(events.map(e => e.category).filter(Boolean)))] as string[];

    if (sessionLoading || loading) {
        return (
            <div className="bg-[#070b14] min-h-screen text-white flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-orange-500" size={36} />
                <p className="text-xs tracking-widest uppercase font-semibold text-slate-400 animate-pulse">Loading Premium Experiences...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[#070b14] min-h-screen text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-slate-900/80 border border-red-500/20 p-8 rounded-3xl max-w-md shadow-2xl backdrop-blur-xl">
                    <h2 className="text-xl font-black text-red-400 mb-2">Failed to Load Events</h2>
                    <p className="text-xs text-slate-400 mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-orange-600 hover:bg-orange-500 px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-orange-600/20"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#070b14] min-h-screen text-slate-200 pb-24 font-sans relative overflow-hidden select-none">
            
            {/* Background Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-purple-600/10 blur-[150px] pointer-events-none rounded-full" />

            {/* 🎯 ১. প্রিমিয়াম ডার্ক থিম হিরো ব্যানার */}
            <div className="relative border-b border-slate-800/60 py-20 md:py-28 px-6 mb-12 backdrop-blur-3xl">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-6 backdrop-blur-md">
                        <Sparkles size={14} className="animate-pulse" />
                        <span className="tracking-widest uppercase text-[11px]">Explore All Experiences</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-5 leading-tight">
                        Discover & Book <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">Events</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-xs sm:text-sm md:text-base font-medium leading-relaxed">
                        Explore handpicked concerts, tech conferences, workshops, and exclusive festivals happening around you.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                
                {/* ২. সার্চ এবং ফিল্টার বার */}
                <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between bg-slate-900/60 p-4 rounded-3xl border border-slate-800/80 backdrop-blur-xl shadow-2xl">
                    <div className="relative w-full md:max-w-md">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                        <input 
                            type="text"
                            placeholder="Search by title or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-orange-500/60 transition-all placeholder:text-slate-500"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all duration-300 cursor-pointer uppercase tracking-wider ${
                                    selectedCategory === category
                                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-transparent shadow-lg shadow-orange-600/20'
                                        : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:text-white hover:border-slate-700'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ৩. সেকশন হেডার ও লেআউট টগলার */}
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                        Showing <span className="text-white">{filteredEvents.length}</span> {filteredEvents.length === 1 ? 'Event' : 'Events'}
                    </h3>
                    
                    <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800/80 p-1.5 rounded-2xl shadow-inner backdrop-blur-md">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${viewMode === 'grid' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                            title="Grid View"
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${viewMode === 'list' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                            title="List View"
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>
                
                {/* 🖼️ ডাইনামিক কার্ড লেআউট */}
                <div className={
                    viewMode === 'grid' 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
                        : "flex flex-col gap-5"
                }>
                    {filteredEvents.map((event) => (
                        <div 
                            key={event._id} 
                            className={`group relative bg-slate-900/60 backdrop-blur-xl border rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-orange-500/10 flex ${
                                event.isFeatured ? 'border-orange-500/50 shadow-orange-500/10' : 'border-slate-800/80 hover:border-orange-500/40'
                            } ${
                                viewMode === 'list' ? 'flex-col sm:flex-row h-auto sm:h-52' : 'flex-col justify-between h-full'
                            }`}
                        >
                            {/* ইমেজ সেকশন */}
                            <div className={`relative bg-slate-950 shrink-0 overflow-hidden ${
                                viewMode === 'list' ? 'w-full sm:w-72 h-52 sm:h-full' : 'h-56 w-full'
                            }`}>
                                <img 
                                    src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop"} 
                                    alt={event.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                                {/* Category Tag */}
                                <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-white/10 text-slate-200 text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-lg tracking-wider shadow-lg flex items-center gap-1.5">
                                    <FaTag className="text-orange-400 text-[10px]" />
                                    {event.category || 'General'}
                                </span>

                                {/* Price Badge */}
                                <div className="absolute bottom-4 right-4 bg-slate-950/90 backdrop-blur-md border border-orange-500/30 text-orange-400 text-xs font-black px-3.5 py-1.5 rounded-xl shadow-xl flex items-center gap-1">
                                    <Ticket className="w-3.5 h-3.5" />
                                    <span>{event.price && Number(event.price) > 0 ? `$${event.price}` : 'Free'}</span>
                                </div>
                            </div>

                            {/* কন্টেন্ট সেকশন */}
                            <div className="p-6 flex-grow flex flex-col justify-between gap-6 bg-slate-900/40">
                                <div>
                                    <Link href={`/events/${event._id}`}>
                                        <h4 className="font-bold text-lg text-white group-hover:text-orange-400 transition-colors duration-300 line-clamp-2 leading-snug">
                                            {event.title}
                                        </h4>
                                    </Link>
                                </div>

                                {/* ডেট এবং লোকেশন মেটা বক্স */}
                                <div className="bg-slate-950/50 rounded-2xl p-3.5 border border-slate-800/60 space-y-2 text-xs text-slate-400">
                                    <div className="flex items-center gap-2.5">
                                        <FaCalendarAlt className="text-orange-400 text-xs shrink-0" />
                                        <span className="font-medium text-slate-300">{event.date || 'TBD'} • {event.time || '07:00 PM'}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <FaMapMarkerAlt className="text-orange-400 text-xs shrink-0" />
                                        <span className="line-clamp-1 font-medium text-slate-300">{event.location || 'Online / Venue TBD'}</span>
                                    </div>
                                </div>

                                {/* বাটন বা লিংক সেকশন */}
                                <div className={viewMode === 'list' ? 'sm:w-44 shrink-0' : 'w-full'}>
                                    <Link 
                                        href={`/events/${event._id}`}
                                        className={`w-full inline-flex items-center justify-center gap-2 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white rounded-2xl transition-all duration-300 shadow-lg cursor-pointer ${
                                            event.isFeatured 
                                                ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:opacity-90 shadow-orange-600/20' 
                                                : 'bg-slate-800/80 group-hover:bg-orange-600 border border-slate-700/80 group-hover:border-transparent'
                                        }`}
                                    >
                                        <span>Get Tickets</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* নো ডাটা স্টেট */}
                {filteredEvents.length === 0 && (
                    <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800/80 flex flex-col items-center justify-center gap-3 backdrop-blur-xl">
                        <p className="text-slate-400 text-sm font-medium">No events match your current filters.</p>
                        <button 
                            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                            className="text-xs text-orange-400 hover:text-orange-300 uppercase tracking-wider font-extrabold cursor-pointer border-b border-orange-500/40 pb-0.5"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}