"use client";
import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { bookTicket, checkBookingStatus } from "@/lib/action/payment";
import { Ticket, CheckCircle, X, Loader2, Calendar, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

interface EventCardProps {
  event: {
    _id: string;
    title: string;
    image?: string;
    category?: string;
    date?: string;
    time?: string;
    location?: string;
    price: string | number;
  };
}

export default function EventCard({ event }: EventCardProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

 


  // States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [loading, setLoading] = useState(false);

  // ১. ইউজার এই ইভেন্টের টিকিট অলরেডি কেটেছে কিনা তা পেজ লোড হওয়ার সময় চেক করবে
  useEffect(() => {
    if (user?.email && event._id) {
      checkBookingStatus(event._id, user.email).then((res) => {
        if (res && res.isBooked) {
          setIsBooked(true);
        }
      });
    }
  }, [user?.email, event._id]);

  // ২. বাটনে ক্লিক করলে অ্যাকশন (লগইন না থাকলে সাইন-ইন পেজে পাঠাবে)
  const handleTicketAction = () => {
    if (!user) {
      router.push("/signin");
      return;
    }
    if (isBooked) return;
    setIsModalOpen(true);
  };

  // ৩. ফর্ম সাবমিট করে টিকিট বুক করার ফাংশন
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !user?.email) return;
    
    setLoading(true);

    const priceNum = parseFloat(String(event.price)) || 0;

    const bookingData = {
      eventId: event._id,
      eventTitle: event.title,
      userId: user.id,
      userEmail: user.email,
      userName: user.name || "Anonymous User",
      ticketCount: ticketCount,
      totalPrice: priceNum * ticketCount,
    };

    const res = await bookTicket(bookingData);
    setLoading(false);

    if (res && res.success) {
      setIsBooked(true);
      setIsModalOpen(false);
      alert("🎉 Ticket Booked Successfully!");
    } else {
      alert(res?.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-6 relative flex flex-col justify-between transition-all duration-300 hover:border-white/10 hover:shadow-xl">
      
      {/* ইভেন্ট কন্টেন্ট সেকশন */}
      <div className="space-y-4">
        {/* ইমেজ ও প্রাইস ট্যাগ */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5">
          {event.image ? (
            <img src={event.image} alt={event.title} className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
          )}
          <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-orange-500 font-bold text-xs px-3 py-1.5 rounded-xl border border-white/10">
            {parseFloat(String(event.price)) === 0 || String(event.price).toLowerCase() === 'free' ? "FREE" : `$${event.price}`}
          </span>
        </div>

        {/* ক্যাটাগরি */}
        {event.category && (
          <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest bg-orange-500/10 px-2.5 py-1 rounded-md inline-block">
            {event.category}
          </span>
        )}

        {/* টাইটেল */}
        <h3 className="text-white font-bold text-lg tracking-tight line-clamp-1">{event.title}</h3>

        {/* ডেট ও লোকেশন */}
        <div className="space-y-2 text-xs text-gray-400 font-medium">
          {event.date && (
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-orange-500" />
              <span>{event.date} {event.time && `• ${event.time}`}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-orange-500" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* 🎯 ডাইনামিক টিকেট বাটন */}
      <button
        onClick={handleTicketAction}
        disabled={isBooked}
        className={`w-full mt-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
          isBooked
            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-not-allowed"
            : "bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-orange-500/50"
        }`}
      >
        {isBooked ? (
          <>
            <CheckCircle size={14} className="text-emerald-500" /> Tickets Booked ✓
          </>
        ) : (
          <>
            <Ticket size={14} /> Tickets &rarr;
          </>
        )}
      </button>

      {/* 🛑 পপআপ মডাল ফর্ম (Popup Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-[200] p-4">
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-md rounded-3xl p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* মডাল ক্লোজ বাটন */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-black text-white tracking-tighter mb-1">Book Your Ticket</h3>
            <p className="text-xs text-orange-500 font-medium mb-4 line-clamp-1">{event.title}</p>

            <form onSubmit={handleSubmitBooking} className="space-y-4 text-left">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Your Name</label>
                <input type="text" value={user?.name || ""} disabled className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-sm text-gray-400 cursor-not-allowed" />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Email Address</label>
                <input type="email" value={user?.email || ""} disabled className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-sm text-gray-400 cursor-not-allowed" />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Number of Tickets</label>
                <select 
                  value={ticketCount} 
                  onChange={(e) => setTicketCount(Number(e.target.value))}
                  className="w-full bg-[#0b1120] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num} className="bg-[#0f172a]">{num} Ticket{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              {/* লাইভ টোটাল প্রাইস হিসাব */}
              <div className="bg-white/5 border border-white/5 p-3 rounded-xl flex justify-between items-center text-sm font-bold">
                <span className="text-gray-400">Total Price:</span>
                <span className="text-white text-lg">
                  {parseFloat(String(event.price)) === 0 || String(event.price).toLowerCase() === 'free' 
                    ? "$0.00" 
                    : `$${(parseFloat(String(event.price || 0)) * ticketCount).toFixed(2)}`
                  }
                </span>
              </div>

              {/* কনফার্ম বাটন */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-800 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-orange-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Confirm & Book Now"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}