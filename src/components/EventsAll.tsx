"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // 👈 Next.js Link ইমপোর্ট করা হয়েছে
import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaSearch } from 'react-icons/fa';
import { LayoutGrid, List } from 'lucide-react';

interface EventItem {
    _id: string;
    title: string;
    category?: string;
    date?: string;
    time?: string;
    location?: string;
    image?: string;
    price?: string;
    isFeatured?: boolean;
}

export default function EventAllPage() {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<EventItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadEvents() {
            try {
                const res = await fetch('http://localhost:8085/events', {
                    cache: 'no-store'
                });
                if (!res.ok) throw new Error('Failed to fetch events');
                const data = await res.json();
                setEvents(data);
                setFilteredEvents(data);
            } catch (err: any) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        }
        loadEvents();
    }, []);

    useEffect(() => {
        let result = events;

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

    const categories = ['All', ...Array.from(new Set(events.map(e => e.category).filter(Boolean)))];

    if (loading) return <div className="bg-[#0b111e] min-h-screen text-white flex items-center justify-center">Loading events...</div>;
    if (error) return <div className="bg-[#0b111e] min-h-screen text-white flex items-center justify-center text-red-500">Error: {error}</div>;

    return (
        <div className="bg-[#0b111e] min-h-screen text-white p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                
                {/* হেডার সেকশন */}
                <div className="flex justify-between items-center mb-10">
                    <h3 className="text-3xl font-black tracking-tight text-white">
                        Discover <span className="text-orange-500">Events</span>
                    </h3>
                    
                    {/* গ্রিড / লিস্ট ভিউ টগলার বাটন */}
                    <div className="flex items-center gap-1 bg-[#0f172a] border border-slate-800 p-1 rounded-xl">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            title="Grid View"
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            title="List View"
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>
                
                {/* সার্চ এবং ফিল্টার বার */}
                <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-between bg-[#0f172a]/40 p-4 rounded-2xl border border-slate-800/60 backdrop-blur-sm">
                    <div className="relative w-full md:max-w-md">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                        <input 
                            type="text"
                            placeholder="Search by title or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-slate-500"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                                    selectedCategory === category
                                        ? 'bg-orange-500/10 text-orange-500 border-orange-500/40 shadow-sm'
                                        : 'bg-[#0f172a] text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ডায়নামিক কার্ড লেআউট */}
                <div className={
                    viewMode === 'grid' 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                        : "flex flex-col gap-4"
                }>
                    {filteredEvents.map((event) => (
                        <div 
                            key={event._id} 
                            className={`bg-[#0f172a] rounded-2xl overflow-hidden border transition-all duration-300 hover:scale-[1.01] shadow-xl ${
                                event.isFeatured ? 'border-orange-600' : 'border-slate-800'
                            } ${
                                viewMode === 'list' ? 'flex flex-col sm:flex-row h-auto sm:h-48' : 'flex flex-col justify-between'
                            }`}
                        >
                            {/* ১. ইমেজ সেকশন */}
                            <div className={`relative bg-slate-800 shrink-0 ${
                                viewMode === 'list' ? 'w-full sm:w-64 h-48 sm:h-full' : 'h-48 w-full'
                            }`}>
                                {event.image ? (
                                    <img 
                                        src={event.image} 
                                        alt={event.title} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-500">No Image</div>
                                )}
                                <span className="absolute bottom-3 right-3 bg-[#0b111e]/90 text-orange-500 font-bold px-3 py-1 rounded-full text-xs border border-orange-500/30 backdrop-blur-sm">
                                    {event.price || 'Free'}
                                </span>
                            </div>

                            {/* ২. কন্টেন্ট সেকশন */}
                            <div className="p-5 flex-grow flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                        <FaTag className="text-orange-500 text-[10px]" />
                                        {event.category || 'Event'}
                                    </div>

                                    {/* টাইটেলে ক্লিক করলেও ডিটেইলস পেজে যাবে */}
                                    <Link href={`/events/${event._id}`}>
                                        <h4 className={`font-bold text-lg leading-snug mb-3 line-clamp-2 hover:underline cursor-pointer ${
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
                                        <span>{event.date} • {event.time || '07:00 PM'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-orange-500 text-xs shrink-0" />
                                        <span className="line-clamp-1">{event.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 🎯 ৩. বাটন বা লিংক সেকশন (আপডেটেড) */}
                            <div className={`p-5 pt-0 sm:pt-5 flex items-center justify-end shrink-0 ${
                                viewMode === 'list' ? 'w-full sm:w-48 border-t sm:border-t-0 sm:border-l border-slate-800/60' : ''
                            }`}>
                                <Link 
                                    href={`/events/${event._id}`}
                                    className={`w-full font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 text-sm cursor-pointer ${
                                        event.isFeatured 
                                            ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/10' 
                                            : 'bg-[#1e293b]/60 hover:bg-[#1e293b] border border-slate-700 text-white'
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
                    <p className="text-center text-slate-500 mt-16 text-sm">No events match your search criteria.</p>
                )}
            </div>
        </div>
    );
}