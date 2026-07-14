"use server"

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

/**
 * ১. স্ট্রাইপ সাবস্ক্রিপশন ডাটা ব্যাকএন্ডে পাঠানোর এক্সিস্টিং অ্যাকশন
 */
export const subscription = async (data: any) => {
  try {
    const res = await fetch(`${baseUrl}/subscription`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    });
    
    const resData = await res.json();
    return resData;
  } catch (error: any) {
    console.error("Subscription Action Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * ২. টিকিট বুকিং ডাটা মঙ্গোডিবি ব্যাকএন্ডে পাঠানোর নতুন অ্যাকশন
 */
export const bookTicket = async (data: {
  eventId: string;
  eventTitle: string;
  userId: string;
  userEmail: string;
  userName: string;
  ticketCount: number;
  totalPrice: number;
}) => {
  try {
    // আপনার এক্সপ্রেস ব্যাকএন্ডের রাউট অনুযায়ী /api/bookings অথবা /bookings ব্যবহার করুন
    const res = await fetch(`${baseUrl}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to book ticket");
    }

    const resData = await res.json();
    return resData;
  } catch (error: any) {
    console.error("Error booking ticket:", error);
    return { success: false, error: error.message };
  }
};

/**
 * ৩. ইউজার অলরেডি টিকিট কেটেছে কিনা তা চেক করার নতুন অ্যাকশন
 */
export const checkBookingStatus = async (eventId: string, userEmail: string) => {
  try {
    const res = await fetch(
      `${baseUrl}/api/bookings/check?eventId=${eventId}&userEmail=${userEmail}`
    );
    
    if (!res.ok) {
      throw new Error("Failed to check booking status");
    }

    const resData = await res.json();
    return resData; // এটি ব্যাকএন্ড থেকে { isBooked: true/false } রিটার্ন করবে
  } catch (error) {
    console.error("Error checking booking status:", error);
    return { isBooked: false };
  }
};