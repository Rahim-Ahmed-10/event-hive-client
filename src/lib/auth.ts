import { betterAuth } from "better-auth";
// 💡 সঠিক সাব-পাথ থেকে jwt প্লাগইনটি ইমপোর্ট করা হলো
import { jwt } from "better-auth/plugins"; 
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

// 🛠️ বিল্ড টাইমে ক্র্যাশ হওয়া রোধ করার জন্য সেফ চেক
const mongoUri = process.env.MONGO_DB_URI;
if (!mongoUri) {
  console.warn("⚠️ Warning: MONGO_DB_URI is not defined in environment variables.");
}

const client = new MongoClient(mongoUri || "mongodb://localhost:27017/fallback_db");
const db = client.db(process.env.AUTH_DB_NAME || "event-hive_db");

export const auth = betterAuth({
  database: mongodbAdapter(db),

  // 🛠️ সার্ভার সাইড এবং ক্লায়েন্ট সাইড উভয়ের জন্য নিরাপদ baseURL হ্যান্ডলিং
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
trustedOrigins: [
      "http://localhost:3000",
      "https://event-hive-client-self.vercel.app"
    ],

  emailAndPassword: {
    enabled: true,
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
      maxAge: 60 * 24 * 30,
    },

    additionalFields: {
      role: { type: "string" },
      plan: { type: "string" },
    },
  },

  // 🛡️ ডোমেইন অরিজিন সিকিউরিটি ফিক্স (যাতে Vercel-এ সেশন ব্লক না হয়)
 

  // 💡 প্লাগইনস অবজেক্টটি session-এর বাইরে (রুট লেভেলে) রাখতে হয়
  plugins: [
    jwt()
  ],
});