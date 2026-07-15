import { betterAuth } from "better-auth";
// 💡 সঠিক সাব-পাথ থেকে jwt প্লাগইনটি ইমপোর্ট করা হলো
import { jwt } from "better-auth/plugins"; 
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGO_DB_URI!);
const db = client.db(process.env.AUTH_DB_NAME || "event-hive_db");

export const auth = betterAuth({
  database: mongodbAdapter(db),

  // 🛠️ লোকালহোস্ট এরর দূর করার জন্য ডাইনামিক এবং সেফ ইউআরএল চেকিং:
  baseURL: typeof window === "undefined" 
    ? (process.env.BETTER_AUTH_URL || "https://event-hive-client-self.vercel.app") 
    : window.location.origin,

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

  // 💡 প্লাগইনস অবজেক্টটি session-এর বাইরে (রুট লেভেলে) রাখতে হয়
  plugins: [
    jwt()
  ],
});