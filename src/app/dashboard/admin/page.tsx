"use client";
import React, { useEffect, useState } from "react";
import { 
  TrendingUp, 
  Users, 
  CalendarDays, 
  DollarSign, 
  Loader2, 
  ArrowRight,
  Ticket
} from "lucide-react";
import Link from "next/link";
// Recharts Components ইমপোর্ট
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  totalEvents: number;
  totalUsers: number;
}

interface Booking {
  _id: string;
  eventTitle: string;
  userName: string;
  userEmail: string;
  ticketCount: number;
  totalPrice: number;
  bookedAt: string;
}

interface EventItem {
  _id: string;
  category: string;
}

interface UserItem {
  _id: string;
}

// পাই-চার্টের জন্য কালার প্যালেট (অরেঞ্জ ও ডার্ক থিমের সাথে মানানসই)
const COLORS = ["#f97316", "#3b82f6", "#10b981", "#a855f7", "#ec4899"];

export default function AdminOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8085";
      console.log("Fetching from Backend URL:", BACKEND_URL);

      // 🔑 ১. কুকি থেকে Better-Auth এর সেশন টোকেনটি বের করা
      const getCookie = (name: string) => {
        if (typeof document === "undefined") return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
        return null;
      };

      // Better-Auth সাধারণত এই নামে কুকি সেভ করে
      const token = getCookie("better-auth.session_token");

      // 📝 ২. রিকোয়েস্টের জন্য হেডার অবজেক্ট তৈরি করা
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // 🚀 ৩. হেডারে টোকেন সহ সিকিউরড রিকোয়েস্ট পাঠানো
      const [eventsRes, bookingsRes, usersRes] = await Promise.all([
        fetch(`${BACKEND_URL}/events`), // পাবলিক হলে হেডার না দিলেও চলে, তবে দেওয়া নিরাপদ
        fetch(`${BACKEND_URL}/api/bookings/all`, { headers }), // 🔒 সিকিউরড
        fetch(`${BACKEND_URL}/api/users`, { headers }).catch(() => null) // 🔒 সিকিউরড
      ]);

      const eventsDataRaw = await eventsRes.json().catch(() => []);
      const bookingsDataRaw = await bookingsRes.json().catch(() => []);
      
      // 🔍 কনসোলে প্রিন্ট করে দেখা ব্যাকএন্ড কী দিচ্ছে
      console.log("Raw Bookings Data received:", bookingsDataRaw);
      console.log("Raw Events Data received:", eventsDataRaw);

      // ডাটা অ্যারে কিনা তা নিশ্চিত করা
      const eventsData = Array.isArray(eventsDataRaw) ? eventsDataRaw : [];
      const bookingsData = Array.isArray(bookingsDataRaw) ? bookingsDataRaw : [];

      let usersCount = 0;
      if (usersRes) {
        const usersDataRaw = await usersRes.json().catch(() => []);
        const usersData = Array.isArray(usersDataRaw) ? usersDataRaw : [];
        usersCount = usersData.length;
      }

      // স্ট্যাটস হিসাব
      const totalEvents = eventsData.length;
      const totalBookings = bookingsData.length;
      const totalRevenue = bookingsData.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

      setStats({
        totalRevenue,
        totalBookings,
        totalEvents,
        totalUsers: usersCount,
      });

      // শেষের ৫টি বুকিং
      setRecentBookings(bookingsData.slice(-5).reverse());

      // রেভিনিউ চার্ট ডাটা প্রসেসিং
      const dailyData: { [key: string]: { date: string; Revenue: number; Bookings: number } } = {};
      
      bookingsData.forEach((b) => {
        if (!b.bookedAt) return;
        const dateLabel = new Date(b.bookedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        if (!dailyData[dateLabel]) {
          dailyData[dateLabel] = { date: dateLabel, Revenue: 0, Bookings: 0 };
        }
        dailyData[dateLabel].Revenue += b.totalPrice || 0;
        dailyData[dateLabel].Bookings += b.ticketCount || 0;
      });

      const formattedTrendData = Object.values(dailyData).slice(-7);
      setChartData(formattedTrendData);

      // পাই চার্ট ক্যাটাগরি ডাটা প্রসেসিং
      const categories: { [key: string]: number } = {};
      eventsData.forEach((e) => {
        const cat = e.category || "Uncategorized";
        categories[cat] = (categories[cat] || 0) + 1;
      });

      const formattedPieData = Object.keys(categories).map((key) => ({
        name: key,
        value: categories[key],
      }));
      setPieData(formattedPieData);

    } catch (error) {
      console.error("Error fetching admin metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
}, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-white">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white">
      
      {/* 👑 ১. হেডার */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Welcome Back, <span className="text-orange-500">Admin</span>!
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time analytics directly connected with your MongoDB Atlas database.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#0f172a] border border-white/10 px-4 py-2.5 rounded-2xl text-xs font-semibold text-gray-400">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
          Database Sync: Active
        </div>
      </div>

      {/* 📊 ২. স্ট্যাটস কার্ড গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="relative overflow-hidden bg-[#0b1120] border border-white/5 p-6 rounded-3xl shadow-xl hover:border-orange-500/20 transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Total Revenue</p>
              <h3 className="text-3xl font-black text-white">${stats?.totalRevenue}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        {/* Tickets Sold */}
        <div className="relative overflow-hidden bg-[#0b1120] border border-white/5 p-6 rounded-3xl shadow-xl hover:border-orange-500/20 transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Tickets Sold</p>
              <h3 className="text-3xl font-black text-white">{stats?.totalBookings}</h3>
            </div>
            <div className="p-3 bg-orange-500/10 text-orange-400 rounded-2xl">
              <Ticket size={20} />
            </div>
          </div>
        </div>

        {/* Active Events */}
        <div className="relative overflow-hidden bg-[#0b1120] border border-white/5 p-6 rounded-3xl shadow-xl hover:border-orange-500/20 transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Active Events</p>
              <h3 className="text-3xl font-black text-white">{stats?.totalEvents}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
              <CalendarDays size={20} />
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="relative overflow-hidden bg-[#0b1120] border border-white/5 p-6 rounded-3xl shadow-xl hover:border-orange-500/20 transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Total Users</p>
              <h3 className="text-3xl font-black text-white">{stats?.totalUsers}</h3>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl">
              <Users size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* 📈 ৩. ডাবল চার্ট সেকশন (গ্লোয়িং ডার্ক লুক) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* বামপাশের বড় চার্ট: সেলস অ্যান্ড রেভিনিউ ট্রেন্ড */}
        <div className="lg:col-span-2 bg-[#0b1120] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-extrabold text-white">Sales & Revenue Trend</h3>
            <p className="text-xs text-gray-500">Visual representation of event booking transactions</p>
          </div>
          
          <div className="h-[300px] w-full">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                No booking data available to generate trend chart.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px" }}
                    labelStyle={{ color: "#9ca3af", fontWeight: "bold" }}
                  />
                  <Area type="monotone" dataKey="Revenue" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue ($)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ডানপাশের পাই চার্ট: ইভেন্ট ক্যাটাগরি ডিস্ট্রিবিউশন */}
        <div className="bg-[#0b1120] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-white">Event Categories</h3>
            <p className="text-xs text-gray-500">Distribution of live event categories</p>
          </div>

          <div className="h-[250px] w-full flex items-center justify-center relative">
            {pieData.length === 0 ? (
              <div className="text-gray-500 text-sm">No events found.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            
            {/* গোল চার্টের ভেতরের টেক্সট */}
            {pieData.length > 0 && (
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">{stats?.totalEvents}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Events</span>
              </div>
            )}
          </div>

          {/* লিজেন্ড ইন্ডিকেটর */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 📑 ৪. রিসেন্ট বুকিং টেবিল */}
      <div className="bg-[#0b1120] border border-white/5 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-6 border-b border-white/5">
          <div>
            <h2 className="text-lg font-extrabold text-white">Recent Ticket Bookings</h2>
            <p className="text-xs text-gray-500 mt-0.5">Real-time update from your bookings database.</p>
          </div>
          <Link 
            href="/dashboard/admin/manage-events" 
            className="text-xs font-bold uppercase tracking-wider text-orange-500 hover:text-orange-400 flex items-center gap-1.5 transition-colors"
          >
            Manage Events <ArrowRight size={14} />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">
            No bookings found yet. Keep marketing your events! 🚀
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-white/5">
                  <th className="py-4 px-4">Event Name</th>
                  <th className="py-4 px-4">Customer</th>
                  <th className="py-4 px-4">Tickets</th>
                  <th className="py-4 px-4">Amount Paid</th>
                  <th className="py-4 px-4 text-right">Booked Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300 font-medium">
                {recentBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 px-4 font-bold text-white max-w-[200px] truncate">
                      {booking.eventTitle}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-white font-semibold">{booking.userName}</span>
                        <span className="text-[10px] text-gray-500">{booking.userEmail}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-orange-400 font-bold">
                      {booking.ticketCount}
                    </td>
                    <td className="py-4 px-4 text-green-400 font-bold">
                      ${booking.totalPrice}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-500 text-xs">
                      {new Date(booking.bookedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
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