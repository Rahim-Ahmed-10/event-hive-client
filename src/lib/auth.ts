import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

// 🛠️ Vercel-এ বিল্ড টাইমে ক্র্যাশ হওয়া রোধ করার জন্য সেফ চেক ও ক্লায়েন্ট কানেকশন
const mongoUri = process.env.MONGO_DB_URI;
if (!mongoUri) {
  console.warn("⚠️ Warning: MONGO_DB_URI is not defined in environment variables.");
}

const client = new MongoClient(mongoUri || "mongodb://localhost:27017/fallback_db");
const db = client.db(process.env.AUTH_DB_NAME || "event-hive_db"); // তোমার প্রজেক্টের ডাটাবেজ নাম

export const auth = betterAuth({
  database: mongodbAdapter(db),

  // 🛠️ লোকাল এবং প্রোডাকশন (Vercel) উভয়ের জন্যই সঠিক ও অটোমেটিক baseURL সেটআপ
  baseURL: process.env.BETTER_AUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),

  emailAndPassword: {
    enabled: true,
  },

  // 🎯 ফিক্সড ১: ইউজার মডেলে কাস্টম ফিল্ড এবং ডিফল্ট ভ্যালু সেটআপ
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "user" },
      status: { type: "string", required: false },
      plan: { type: "string", required: false, defaultValue: "free" },
    },
  },

  // 🎯 ফিক্সড ২: সেশন অবজেক্টের ভেতরেও এই কাস্টম ফিল্ডগুলো ম্যাপ করা হয়েছে (কুকি ক্যাশ সহ)
  session: {
    cookieCache: {
      enabled: true,
      strategy: 'jwt',
      maxAge: 60 * 24 * 30, // ৩০ দিন
    },
    // সেশনে কাস্টম ইউজার ফিল্ড রিড করার জন্য সঠিক ম্যাপিং
    additionalFields: {
      role: { type: "string" },
      status: { type: "string" },
      plan: { type: "string" },
    }
  },

  // 🛡️ কুকি সেটিংস: Vercel-এর SSL/Dangerous ওয়ার্নিংজনিত কুকি ব্লকিং এড়ানোর জন্য 'secure: false' রাখা হয়েছে লোকাল বা টেম্পোরারি প্রোডাকশনে
  cookie: {
    secure: false, // ব্রাউজারে কুকি সেভ না হওয়ার সমস্যা দূর করতে এটি false রাখা হলো
    sameSite: "lax",
  },

  plugins: [
    jwt()
  ],

  // 🌐 সোশ্যাল প্রোভাইডার কনফিগারেশন
  socialProviders: {
    google: { 
      clientId: process.env.GOOGLE_CLIENT_ID as string, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
    }, 
    // github: { 
    //   clientId: process.env.GITHUB_CLIENT_ID as string, 
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
    // },
  },
});