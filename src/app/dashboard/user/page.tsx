"use client";
import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { 
  Ticket, 
  Calendar, 
  DollarSign, 
  ArrowRight,
  Loader2
} from "lucide-react";
import Link from "next/link";

// ডাটাবেজের ডাটা ফরম্যাট অনুযায়ী ইন্টারফেস ডিফাইন করা হলো
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

export default function UserOverview() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  // ডাটাবেজ থেকে ইউজারের বুকিং ডাটা ফেচ করা
  useEffect(() => {
    if (!user?.id) return;

    const fetchBookings = async () => {
      try {
        // আপনার এপিআই রুট অনুযায়ী ইউআরএল পরিবর্তন করে নিবেন (যেমন: `/api/user/bookings?userId=${user.id}`)
        const response = await fetch(`${backendUrl}/api/bookings?userId=${user.id}`);
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
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  // 📊 ডাটাবেজের তথ্য থেকে ডাইনামিক স্ট্যাটস হিসেব করা
  const totalBookings = bookings.length;
  const totalTickets = bookings.reduce((sum, b) => sum + (b.ticketCount || 0), 0);
  const totalSpent = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const stats = [
    { name: "Total Booked Events", value: totalBookings, icon: Calendar, color: "text-blue-500 bg-blue-500/10" },
    { name: "Total Tickets Purchased", value: totalTickets, icon: Ticket, color: "text-orange-500 bg-orange-500/10" },
    { name: "Total Spent", value: `$${totalSpent}`, icon: DollarSign, color: "text-green-500 bg-green-500/10" },
  ];

  return (
    <div className="space-y-8 p-6 text-white min-h-screen bg-[#0b1329]">
      
      {/* ১. হেডার সেকশন */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight">
          Welcome back, <span className="text-orange-500">{user?.name || "User"}</span>! 👋
        </h1>
        <p className="text-sm text-gray-400">
          Here is what's happening with your booked events and tickets.
        </p>
      </div>

      {/* ২. রিয়েল ডাটার ডাইনামিক স্ট্যাটস কার্ডস */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              className="p-6 bg-[#0f172a] border border-white/5 rounded-2xl flex items-center justify-between shadow-lg"
            >
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{stat.name}</p>
                <h3 className="text-3xl font-black text-white">{stat.value}</h3>
              </div>
              <div className={`p-4 rounded-xl ${stat.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ৩. সাম্প্রতিক বুকিং টেবিল সেকশন */}
      <div className="p-6 bg-[#0f172a] border border-white/5 rounded-2xl space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Recent Bookings</h3>
          <Link 
            href="/dashboard/user/bookings" 
            className="text-xs font-bold text-orange-500 hover:text-orange-400 flex items-center gap-1 transition-all"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/5 rounded-xl text-gray-500">
            <Ticket className="mx-auto mb-3 opacity-50" size={32} />
            <p className="text-sm">No booked events found. Start booking now!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="pb-4">Event Title</th>
                  <th className="pb-4">Booked Date</th>
                  <th className="pb-4 text-center">Tickets</th>
                  <th className="pb-4 text-right">Total Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 font-semibold text-white">{booking.eventTitle}</td>
                    <td className="py-4 text-gray-400">
                      {new Date(booking.bookedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}
                    </td>
                    <td className="py-4 text-center font-semibold text-orange-400">{booking.ticketCount}</td>
                    <td className="py-4 text-right font-bold text-green-400">
                      {booking.totalPrice === 0 ? "Free" : `$${booking.totalPrice}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}