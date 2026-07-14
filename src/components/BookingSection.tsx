"use client";
import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { bookTicket, checkBookingStatus } from "@/lib/action/payment";
import { FaTicketAlt, FaCheckCircle, FaTimes, FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface BookingSectionProps {
  event: {
    _id: string;
    title: string;
    price?: string | number;
  };
}

export default function BookingSection({ event }: BookingSectionProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [loading, setLoading] = useState(false);

  // ১. ইউজার আগে টিকিট কেটেছে কিনা তা ব্যাকএন্ড থেকে চেক করা
  useEffect(() => {
    if (user?.email && event._id) {
      checkBookingStatus(event._id, user.email).then((res) => {
        if (res && res.isBooked) {
          setIsBooked(true);
        }
      });
    }
  }, [user?.email, event._id]);

  const handleBookingClick = () => {
    if (!user) {
      router.push("/signin");
      return;
    }
    if (isBooked) return;
    setIsModalOpen(true);
  };

  // ২. মঙ্গোডিবি ব্যাকএন্ডে টিকিট বুকিং রিকোয়েস্ট পাঠানো
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
      alert(res?.error || "Booking failed. Please try again.");
    }
  };

  return (
    <>
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b1329]/40 p-5 rounded-2xl border border-slate-800/50 w-full">
        <div>
          <p className="text-xs text-slate-400">Need a spot?</p>
          <p className="text-sm font-medium text-slate-200 mt-0.5">
            {isBooked ? "Your seat is secured for this event." : "Click below to start booking process instantly."}
          </p>
        </div>

        <button
          onClick={handleBookingClick}
          disabled={isBooked}
          className={`w-full sm:w-auto font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 transform active:scale-95 text-sm cursor-pointer ${
            isBooked
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-not-allowed shadow-none"
              : "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white border border-orange-500 shadow-[0_4px_20px_rgba(234,88,12,0.3)] hover:shadow-[0_4px_25px_rgba(234,88,12,0.5)]"
          }`}
        >
          {isBooked ? (
            <>
              <FaCheckCircle className="text-base" />
              <span>Tickets Booked ✓</span>
            </>
          ) : (
            <>
              <FaTicketAlt className="text-base" />
              <span>Book & Secure Seat</span>
            </>
          )}
        </button>
      </div>

      {/* 🛑 পপআপ মডাল ফর্ম (Popup Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-[200] p-4">
          <div className="bg-[#111a36] border border-slate-800 w-full max-w-md rounded-3xl p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              <FaTimes size={20} />
            </button>

            <h3 className="text-xl font-black text-white tracking-tighter mb-1">Book Your Ticket</h3>
            <p className="text-xs text-orange-400 font-medium mb-4 line-clamp-1">{event.title}</p>

            <form onSubmit={handleSubmitBooking} className="space-y-4 text-left">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Name</label>
                <input type="text" value={user?.name || ""} disabled className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-sm text-slate-400 cursor-not-allowed" />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Email</label>
                <input type="email" value={user?.email || ""} disabled className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-sm text-slate-400 cursor-not-allowed" />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Quantity</label>
                <select
                  value={ticketCount}
                  onChange={(e) => setTicketCount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num} className="bg-[#111a36]">{num} Ticket{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-xl flex justify-between items-center text-sm font-bold">
                <span className="text-slate-400">Total Cost:</span>
                <span className="text-white text-lg">
                  {parseFloat(String(event.price)) === 0 || String(event.price).toLowerCase() === 'free'
                    ? "FREE"
                    : `BDT ${(parseFloat(String(event.price || 0)) * ticketCount).toFixed(2)}`
                  }
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <FaSpinner className="animate-spin text-base" /> : "Confirm Reservation"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}