"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaSearch } from 'react-icons/fa';
import { LayoutGrid, List, Sparkles, Loader2 } from 'lucide-react';
import { authClient } from "@/lib/auth-client"; // 🔑 তোমার প্রোজেক্টের গ্লোবাল auth-client ইম্পোর্ট করো

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
    // 🔑 Better-Auth এর রিয়্যাক্ট হুক ব্যবহার করে সেশন ও টোকেন রিট্রিভ করা হলো
    const { data: session, isPending: sessionLoading } = authClient.useSession();
    
    const [events, setEvents] = useState<EventItem[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<EventItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8085';

    // ১. প্রথম useEffect: শুধুমাত্র একবার ব্যাকএন্ড থেকে ইভেন্ট ডাটা ফেচ করবে
    useEffect(() => {
        async function loadEvents() {
            try {
                // সেশন থেকে টোকেন নেওয়া, না থাকলে লোকাল স্টোরেজ ব্যাকআপ
                const token = 
                    session?.session?.token || 
                    (session as any)?.token || 
                    localStorage.getItem("token") || 
                    "";

                // হেডারসহ সিকিউরড রিকোয়েস্ট
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

        // সেশন লোডিং শেষ হলেই কেবল ডাটা ফেচ শুরু হবে
        if (!sessionLoading) {
            loadEvents();
        }
    }, [backendUrl, session, sessionLoading]);

    // ২. দ্বিতীয় useEffect: সার্চ বা ক্যাটাগরি চেঞ্জ হলে ফিল্টারিং হ্যান্ডেল করবে (কোনো ইনফিনিট লুপ হবে না)
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

    // ⏳ লোডিং স্পিনার (সেশন এবং ডাটা উভয় লোড হওয়ার সময় দেখাবে)
    if (sessionLoading || loading) {
        return (
            <div className="bg-[#0b111e] min-h-screen text-white flex flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin text-orange-500" size={32} />
                <p className="text-sm font-medium text-slate-400">Loading amazing experiences...</p>
            </div>
        );
    }

    // ❌ এরর ইন্টারফেস
    if (error) {
        return (
            <div className="bg-[#0b111e] min-h-screen text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-red-500/10 border border-red-500/20 px-6 py-8 rounded-3xl max-w-md shadow-2xl">
                    <h2 className="text-xl font-bold text-red-500 mb-2">Oops! Something went wrong</h2>
                    <p className="text-sm text-slate-400 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0b111e] min-h-screen text-white pb-16 font-sans">
            
            {/* 🎯 ১. প্রিমিয়াম ডার্ক থিম হিরো ব্যানার */}
            <div className="relative bg-[#0f172a] border-b border-white/5 overflow-hidden py-16 md:py-24 px-6 mb-12 shadow-2xl">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute -top-10 -right-10 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-semibold text-orange-400 mb-4 tracking-wide backdrop-blur-sm">
                        <Sparkles size={12} /> Explore the Best Experiences
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4">
                        Discover Amazing <span className="text-orange-500 bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">Events</span>
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base font-medium leading-relaxed">
                        Find and book tickets for the most popular concerts, tech conferences, workshops, and exclusive festivals happening around you.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                
                {/* ২. সার্চ এবং ফিল্টার বার */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between bg-[#0f172a]/60 p-4 rounded-2xl border border-white/5 backdrop-blur-md shadow-lg">
                    <div className="relative w-full md:max-w-md">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                        <input 
                            type="text"
                            placeholder="Search by title or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0b111e] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-slate-500"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                                    selectedCategory === category
                                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-md shadow-orange-500/5'
                                        : 'bg-[#0b111e] text-slate-400 border-white/5 hover:text-white hover:border-white/10'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ৩. সেকশন হেডার ও লেআউট টগলার */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                        Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'}
                    </h3>
                    
                    <div className="flex items-center gap-1 bg-[#0f172a] border border-white/5 p-1 rounded-xl shadow-inner">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            title="Grid View"
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === 'list' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            title="List View"
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>
                
                {/* 🖼️ ডাইনামিক কার্ড লেআউট */}
                <div className={
                    viewMode === 'grid' 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                        : "flex flex-col gap-4"
                }>
                    {filteredEvents.map((event) => (
                        <div 
                            key={event._id} 
                            className={`bg-[#0f172a] rounded-2xl overflow-hidden border transition-all duration-300 hover:scale-[1.01] shadow-xl flex ${
                                event.isFeatured ? 'border-orange-600/50 shadow-orange-600/5' : 'border-white/5'
                            } ${
                                viewMode === 'list' ? 'flex-col sm:flex-row h-auto sm:h-48' : 'flex-col justify-between'
                            }`}
                        >
                            {/* ইমেজ সেকশন */}
                            <div className={`relative bg-slate-800 shrink-0 overflow-hidden ${
                                viewMode === 'list' ? 'w-full sm:w-64 h-48 sm:h-full' : 'h-48 w-full'
                            }`}>
                                {event.image ? (
                                    <img 
                                        src={event.image} 
                                        alt={event.title} 
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">No Image Available</div>
                                )}
                                <span className="absolute bottom-3 right-3 bg-[#0b111e]/90 text-orange-400 font-bold px-3 py-1 rounded-full text-xs border border-white/10 backdrop-blur-sm">
                                    {event.price && Number(event.price) > 0 ? `$${event.price}` : 'Free'}
                                </span>
                            </div>

                            {/* কন্টেন্ট সেকশন */}
                            <div className="p-5 flex-grow flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                        <FaTag className="text-orange-500 text-[10px]" />
                                        {event.category || 'Event'}
                                    </div>

                                    <Link href={`/events/${event._id}`}>
                                        <h4 className={`font-bold text-lg leading-snug mb-3 line-clamp-2 hover:text-orange-400 transition-colors cursor-pointer ${
                                            event.isFeatured ? 'text-orange-500' : 'text-white'
                                        }`}>
                                            {event.title}
                                        </h4>
                                    </Link>
                                </div>

                                {/* ডেট এবং লোকেশন */}
                                <div className={`flex text-sm text-slate-400 gap-x-6 gap-y-2 flex-wrap mb-4 ${
                                    viewMode === 'list' ? 'sm:mb-0' : ''
                                }`}>
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-orange-500 text-xs shrink-0" />
                                        <span>{event.date || 'TBD'} • {event.time || '07:00 PM'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-orange-500 text-xs shrink-0" />
                                        <span className="line-clamp-1">{event.location || 'Online / TBD'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* বাটন বা লিংক সেকশন */}
                            <div className={`p-5 pt-0 sm:pt-5 flex items-center justify-end shrink-0 ${
                                viewMode === 'list' ? 'w-full sm:w-48 border-t sm:border-t-0 sm:border-l border-white/5' : ''
                            }`}>
                                <Link 
                                    href={`/events/${event._id}`}
                                    className={`w-full font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 text-sm cursor-pointer ${
                                        event.isFeatured 
                                            ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/10' 
                                            : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
                                    }`}
                                >
                                    <span>Tickets</span> <span>→</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* নো ডাটা মেসেজ */}
                {filteredEvents.length === 0 && (
                    <div className="text-center text-slate-500 py-16 flex flex-col items-center justify-center gap-2">
                        <p className="text-sm">No events match your search criteria.</p>
                        <button 
                            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                            className="text-xs text-orange-500 hover:underline font-semibold cursor-pointer"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}