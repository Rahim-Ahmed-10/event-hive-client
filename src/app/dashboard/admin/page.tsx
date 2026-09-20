"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  CalendarDays, 
  DollarSign, 
  Loader2, 
  ArrowRight,
  Ticket,
  TrendingUp,
  Activity,
  Sparkles,
  Zap
} from "lucide-react";
import Link from "next/link";
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
  Cell
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
  category?: string;
}

interface TrendChartData {
  date: string;
  Revenue: number;
  Bookings: number;
}

interface CategoryPieData {
  name: string;
  value: number;
}

const COLORS = ["#f97316", "#06b6d4", "#10b981", "#8b5cf6", "#ec4899"];

export default function AdminOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [chartData, setChartData] = useState<TrendChartData[]>([]);
  const [pieData, setPieData] = useState<CategoryPieData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const BACKEND_URL = 
          process.env.NEXT_PUBLIC_SERVER_URL || 
          process.env.NEXT_PUBLIC_API_URL || 
          "http://localhost:8085";

        const getCookie = (name: string) => {
          if (typeof document === "undefined") return null;
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(";").shift();
          return null;
        };

        const token = getCookie("better-auth.session_token");

        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const [eventsRes, bookingsRes, usersRes] = await Promise.all([
          fetch(`${BACKEND_URL}/events`),
          fetch(`${BACKEND_URL}/api/bookings/all`, { headers }),
          fetch(`${BACKEND_URL}/api/users`, { headers }).catch(() => null)
        ]);

        const eventsDataRaw = await eventsRes.json().catch(() => []);
        const bookingsDataRaw = await bookingsRes.json().catch(() => []);

        const eventsData: EventItem[] = Array.isArray(eventsDataRaw) ? eventsDataRaw : [];
        const bookingsData: Booking[] = Array.isArray(bookingsDataRaw) ? bookingsDataRaw : [];

        let usersCount = 0;
        if (usersRes) {
          const usersDataRaw = await usersRes.json().catch(() => []);
          const usersData = Array.isArray(usersDataRaw) ? usersDataRaw : [];
          usersCount = usersData.length;
        }

        const totalEvents = eventsData.length;
        const totalBookings = bookingsData.length;
        const totalRevenue = bookingsData.reduce((sum: number, item: Booking) => sum + (item.totalPrice || 0), 0);

        setStats({
          totalRevenue,
          totalBookings,
          totalEvents,
          totalUsers: usersCount,
        });

        setRecentBookings(bookingsData.slice(-5).reverse());

        // Chart Data Process
        const dailyData: { [key: string]: TrendChartData } = {};
        
        bookingsData.forEach((b: Booking) => {
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

        // Pie Data Process
        const categories: { [key: string]: number } = {};
        eventsData.forEach((e: EventItem) => {
          const cat = e.category || "General";
          categories[cat] = (categories[cat] || 0) + 1;
        });

        const formattedPieData: CategoryPieData[] = Object.keys(categories).map((key) => ({
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
      <div className="flex h-[75vh] flex-col items-center justify-center gap-4 text-white">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          <Zap className="absolute text-orange-500 animate-pulse" size={24} />
        </div>
        <p className="text-xs font-semibold tracking-widest uppercase text-slate-400">Loading Dashboard Metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-slate-100 font-sans pb-10">
      
      {/* 👑 ১. প্রিমিয়াম হেডার ব্যানার */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] p-8 border border-slate-800/80 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
              <Sparkles size={14} /> Live Platform Overview
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              System <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Dashboard</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Track event analytics, revenue insights, and recent booking transactions in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 bg-slate-900/80 border border-slate-700/60 px-4 py-2.5 rounded-2xl text-xs font-semibold backdrop-blur-md shadow-inner">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300">Database Sync Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 ২. চারটা মডার্ন স্ট্যাটস কার্ড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Revenue */}
        <div className="relative group bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-orange-500/40 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
              <h3 className="text-3xl font-black text-white tracking-tight">${stats?.totalRevenue ?? 0}</h3>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                <TrendingUp size={14} />
                <span>Verified Stripe Income</span>
              </div>
            </div>
            <div className="p-3.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl shadow-inner">
              <DollarSign size={22} />
            </div>
          </div>
        </div>

        {/* Tickets Sold */}
        <div className="relative group bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-orange-500/40 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all" />
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tickets Sold</span>
              <h3 className="text-3xl font-black text-white tracking-tight">{stats?.totalBookings ?? 0}</h3>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-orange-400">
                <Activity size={14} />
                <span>Successful Orders</span>
              </div>
            </div>
            <div className="p-3.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-2xl shadow-inner">
              <Ticket size={22} />
            </div>
          </div>
        </div>

        {/* Active Events */}
        <div className="relative group bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-orange-500/40 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all" />
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Events</span>
              <h3 className="text-3xl font-black text-white tracking-tight">{stats?.totalEvents ?? 0}</h3>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400">
                <Zap size={14} />
                <span>Published On Platform</span>
              </div>
            </div>
            <div className="p-3.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-2xl shadow-inner">
              <CalendarDays size={22} />
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="relative group bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-orange-500/40 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Registered Users</span>
              <h3 className="text-3xl font-black text-white tracking-tight">{stats?.totalUsers ?? 0}</h3>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-purple-400">
                <Users size={14} />
                <span>Active Accounts</span>
              </div>
            </div>
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-2xl shadow-inner">
              <Users size={22} />
            </div>
          </div>
        </div>

      </div>

      {/* 📈 ৩. ইন্টারেক্টিভ চার্টস সেকশন */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales & Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-[#0f172a]/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="text-orange-500" size={20} />
                Revenue Analytics
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Booking transactions timeline breakdown</p>
            </div>
            <span className="text-[11px] font-semibold px-3 py-1 bg-slate-800 text-slate-300 rounded-xl border border-slate-700">
              Last 7 Days
            </span>
          </div>
          
          <div className="h-[280px] w-full">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                No recent transactions found.
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1e293b", borderColor: "#475569", borderRadius: "16px", color: "#fff" }}
                    labelStyle={{ color: "#f97316", fontWeight: "bold" }}
                  />
                  <Area type="monotone" dataKey="Revenue" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue ($)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Categories Donut Chart */}
        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="mb-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="text-cyan-400" size={20} />
              Category Share
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Distribution of live event categories</p>
          </div>

          <div className="h-[220px] w-full flex items-center justify-center relative">
            {pieData.length === 0 ? (
              <div className="text-slate-500 text-sm">No categories registered.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {pieData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1e293b", borderColor: "#475569", borderRadius: "12px", color: "#fff" }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            
            {pieData.length > 0 && (
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-white">{stats?.totalEvents ?? 0}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-slate-800/60">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 📑 ৪. প্রিমিয়াম রিসেন্ট বুকিং টেবিল */}
      <div className="bg-[#0f172a]/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-white">Recent Ticket Orders</h2>
            <p className="text-xs text-slate-400 mt-1">Latest event bookings synchronized from database</p>
          </div>
          <Link 
            href="/dashboard/admin/manage-events" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400 hover:text-orange-300 bg-orange-500/10 border border-orange-500/20 px-4 py-2.5 rounded-xl transition-all"
          >
            Manage All Events <ArrowRight size={14} />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm font-medium">
            No recent booking records found.
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="text-slate-400 font-semibold text-xs uppercase tracking-wider border-b border-slate-800">
                  <th className="py-4 px-4">Event Details</th>
                  <th className="py-4 px-4">Customer</th>
                  <th className="py-4 px-4">Quantity</th>
                  <th className="py-4 px-4">Total Paid</th>
                  <th className="py-4 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
                {recentBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4 font-semibold text-white max-w-[220px] truncate">
                      {booking.eventTitle}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-slate-200 font-semibold">{booking.userName || "Customer"}</span>
                        <span className="text-[11px] text-slate-400">{booking.userEmail}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-lg text-xs font-bold">
                        {booking.ticketCount} {booking.ticketCount > 1 ? "Tickets" : "Ticket"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-emerald-400 font-bold">
                      ${booking.totalPrice}
                    </td>
                    <td className="py-4 px-4 text-right text-slate-400 text-xs">
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