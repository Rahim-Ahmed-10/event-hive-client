"use client";
import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { 
  Ticket, 
  Calendar, 
  DollarSign, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  Clock,
  Download
} from "lucide-react";
import Link from "next/link";

interface Booking {
  _id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  userEmail: string;
  userName: string;
  ticketCount: number;
  totalPrice: number;
  bookedAt: string;
}

export default function BookingsPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchBookings = async () => {
      try {
        // এক্সপ্রেস ব্যাকএন্ডের ডাইনামিক পোর্ট ৮MDg৫ থেকে ডাটা আনা হচ্ছে
        const response = await fetch(`http://localhost:8085/api/bookings?userId=${user.id}`);
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.id]);

  if (sessionLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b1329] text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-orange-500" size={40} />
          <p className="text-sm text-gray-400 font-medium">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 text-white min-h-screen bg-[#0b1329] space-y-8">
      
      {/* 🚀 হেডার সেকশন */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            My <span className="text-orange-500">Bookings</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your tickets and view details of your booked events.
          </p>
        </div>
        <div className="bg-[#1e293b]/40 border border-white/5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-300">
          Total Bookings: <span className="text-orange-500">{bookings.length}</span>
        </div>
      </div>

      {/* 🛑 এম্পটি স্টেট (যদি কোনো বুকিং না থাকে) */}
      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#0f172a] border border-dashed border-white/10 rounded-2xl text-center p-6">
          <div className="p-4 bg-orange-500/10 text-orange-500 rounded-full mb-4 animate-bounce">
            <Ticket size={40} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Bookings Found</h3>
          <p className="text-gray-400 text-sm max-w-sm mb-6">
            You haven't booked any event tickets yet. Explore upcoming events to get your first ticket!
          </p>
          <Link 
            href="/events" 
            className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-xs font-bold uppercase tracking-widest rounded-xl text-white transition-all shadow-lg shadow-orange-950/40 flex items-center gap-2"
          >
            Explore Events <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        /* 🗂️ বুকিং কার্ড গ্রিড */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div 
              key={booking._id} 
              className="group relative bg-[#0f172a] border border-white/5 p-6 rounded-2xl flex flex-col justify-between gap-6 shadow-xl hover:border-orange-500/30 transition-all duration-300 overflow-hidden"
            >
              {/* ব্যাকগ্রাউন্ডে হালকা নিয়ন গ্লো ইফেক্ট */}
              <div className="absolute -right-16 -top-16 w-32 h-32 bg-orange-600/5 rounded-full blur-3xl group-hover:bg-orange-600/10 transition-all duration-300 pointer-events-none" />

              <div className="space-y-4">
                {/* ১. টপ বার: টিকিট আইকন এবং বুকিংয়ের সময় */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-2.5 bg-orange-600/10 text-orange-500 rounded-xl">
                      <Ticket size={18} />
                    </div>
                    <span className="text-[10px] md:text-xs font-semibold text-gray-400 tracking-wider">
                      ID: #{booking._id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                  
                  {/* পেমেন্ট/বুকিং স্ট্যাটাস ব্যাজ */}
                  <span className="px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 bg-green-500/10 text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Active
                  </span>
                </div>

                {/* ২. ইভেন্ট টাইটেল */}
                <h3 className="text-lg md:text-xl font-black text-white group-hover:text-orange-500 transition-colors line-clamp-2">
                  {booking.eventTitle}
                </h3>

                {/* ৩. বুকিংয়ের বিস্তারিত তথ্য */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5 text-sm">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Booked Date</p>
                    <div className="flex items-center gap-1.5 text-gray-300 font-semibold">
                      <Calendar size={14} className="text-orange-500" />
                      <span>
                        {new Date(booking.bookedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Tickets</p>
                    <div className="flex items-center gap-1.5 text-gray-300 font-semibold">
                      <Ticket size={14} className="text-orange-500" />
                      <span>{booking.ticketCount} {booking.ticketCount > 1 ? "Tickets" : "Ticket"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ৪. বটম বার: মোট টাকা এবং অ্যাকশন বাটন */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Total Price</p>
                  <span className="text-lg md:text-xl font-black text-green-400">
                    {booking.totalPrice === 0 ? "Free" : `$${booking.totalPrice}`}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl text-gray-400 hover:text-white transition-all" title="Download Ticket">
                    <Download size={16} />
                  </button>
                  <button className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-orange-950/20">
                    View Details
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}