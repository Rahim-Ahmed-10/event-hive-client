import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGO_DB_URI!);
const db = client.db(process.env.AUTH_DB_NAME || "event-hive_db");

export const auth = betterAuth({
  // 🛠️ TypeScript Error Fix: mongodbAdapter থেকে অগোছালো schema বাদ দেওয়া হয়েছে
  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
  },

  // 👤 ১. ক্লায়েন্ট ও ডাটাবেজ লেভেলে কাস্টম ফিল্ড যুক্ত করার স্ট্যান্ডার্ড নিয়ম
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
      },
      plan: {
        type: "string",
        required: false,
        defaultValue: "free",
      },
    },
  },

  // 🔑 ২. সেশন ও JWT টোকেনের মাধ্যমে ফ্রন্টএন্ডে রোল ও প্ল্যান ডেটা পাস করার কনফিগারেশন
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 60 * 24 * 30,
    },
    additionalFields: {
      role: { type: "string" },
      plan: { type: "string" },
    },
  },
});