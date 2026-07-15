import React from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaClock } from 'react-icons/fa';
import BookingSection from '@/components/BookingSection'; // 👈 নতুন কম্পোনেন্টটি ইম্পোর্ট করুন

interface EventItem {
    _id: string;
    title: string;
    category?: string;
    date?: string;
    time?: string;
    location?: string;
    image?: string;
    price?: string;
    description?: string;
}

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}
const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL;


async function getSingleEvent(id: string): Promise<EventItem> {
    const res = await fetch(`${backendUrl}/events/${id}`, {
        cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error('Failed to fetch event details');
    }

    return res.json();
}

export default async function EventDetailsPage({ params }: PageProps) {
    const resolvedParams = await params;
    const event = await getSingleEvent(resolvedParams.id);

    const isFree = 
      !event.price ||
String(event.price).toLowerCase() === 'free' ||
Number(event.price) === 0 ||
event.price === '0';

    return (
        <div className="bg-[#0b1329] min-h-screen text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans selection:bg-orange-500 selection:text-white">
            <div className="max-w-4xl mx-auto bg-[#111a36]/70 backdrop-blur-md rounded-3xl overflow-hidden border border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                
                {/* 📸 প্রিমিয়াম ব্যানার সেকশন */}
                <div className="relative h-64 sm:h-80 md:h-[400px] w-full group overflow-hidden bg-slate-900">
                    {event.image ? (
                        <img 
                            src={event.image} 
                            alt={event.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                            <span className="text-sm tracking-widest uppercase">Image Unavailable</span>
                        </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111a36] via-transparent to-black/40" />

                    {/* ক্যাটাগরি ব্যাজ */}
                    <div className="absolute top-6 left-6 backdrop-blur-md bg-black/40 border border-white/10 text-orange-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                        <span className="flex items-center gap-1.5">
                            <FaTag className="animate-pulse" />
                            {event.category || 'General'}
                        </span>
                    </div>

                    {/* প্রাইস ট্যাগ */}
                    <div className="absolute bottom-6 right-6 shadow-2xl">
                        <span className={`inline-block font-black px-6 py-2.5 rounded-2xl text-sm tracking-wide ${
                            isFree 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-orange-600 text-white border border-orange-500'
                        }`}>
                            {isFree ? 'FREE ACCESS' : `🎟️ BDT ${event.price}`}
                        </span>
                    </div>
                </div>

                {/* 📝 কন্টেন্ট ইনফরমেশন কার্ড */}
                <div className="p-6 sm:p-10 space-y-8">
                    
                    {/* মেইন টাইটেল */}
                    <div className="space-y-3">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                            {event.title}
                        </h1>
                    </div>

                    {/* 🕒 কী-ইনফরমেশন গ্রিড */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-4 bg-[#0b1329]/60 p-4 rounded-2xl border border-slate-800/60 transition-all hover:border-slate-700">
                            <div className="p-3 bg-orange-600/10 rounded-xl border border-orange-500/20 text-orange-500">
                                <FaCalendarAlt size={18} />
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Date</p>
                                <p className="text-sm font-semibold text-white mt-0.5">{event.date || 'TBD'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-[#0b1329]/60 p-4 rounded-2xl border border-slate-800/60 transition-all hover:border-slate-700">
                            <div className="p-3 bg-orange-600/10 rounded-xl border border-orange-500/20 text-orange-500">
                                <FaClock size={18} />
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Schedule Time</p>
                                <p className="text-sm font-semibold text-white mt-0.5">{event.time || '07:00 PM'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-[#0b1329]/60 p-4 rounded-2xl border border-slate-800/60 transition-all hover:border-slate-700 md:col-span-1">
                            <div className="p-3 bg-orange-600/10 rounded-xl border border-orange-500/20 text-orange-500">
                                <FaMapMarkerAlt size={18} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Venue</p>
                                <p className="text-sm font-semibold text-white mt-0.5 truncate" title={event.location}>
                                    {event.location || 'Online / TBA'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-800/60" />

                    {/* 📖 ডেসক্রিপশন */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                            <span className="h-4 w-1 bg-orange-500 rounded-full inline-block"></span>
                            Event Description
                        </h3>
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal bg-[#0b1329]/30 p-5 rounded-2xl border border-slate-800/40">
                            {event.description || "Welcome! Get ready for an exceptional event packed with exciting moments..."}
                        </p>
                    </div>

                    <BookingSection event={event} />

                </div>
            </div>
        </div>
    );
}