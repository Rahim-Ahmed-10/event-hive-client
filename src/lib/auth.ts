import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins"; 
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

// 🛠️ Vercel বিল্ড টাইমে ক্র্যাশ রোধ করার সেফটি চেক
const mongoUri = process.env.MONGO_DB_URI;
if (!mongoUri) {
  console.warn("⚠️ Warning: MONGO_DB_URI is not defined in environment variables.");
}

const client = new MongoClient(mongoUri || "mongodb://localhost:27017/fallback_db");
const db = client.db(process.env.AUTH_DB_NAME || "event-hive_db");

export const auth = betterAuth({
  database: mongodbAdapter(db),

  // 🎯 Vercel Environment Variable থেকে অরিজিনাল URL রিড করবে
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  emailAndPassword: {
    enabled: true,
  },

  cookie: {
    secure: process.env.NODE_ENV === "production", // প্রোডাকশনে HTTPS কুকি এনাবল থাকবে
    sameSite: "lax",
  },

  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "user" },
      plan: { type: "string", required: false, defaultValue: "free" },
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 60 * 24 * 30, // ৩০ দিন
    },

    additionalFields: {
      role: { type: "string" },
      plan: { type: "string" },
    },
  },

  socialProviders: {
    google: { 
      clientId: process.env.GOOGLE_CLIENT_ID as string, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
    }, 
  },

  plugins: [
    jwt()
  ],
});