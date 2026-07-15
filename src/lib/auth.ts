import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins"; 
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

// 🛠️ Vercel-এ বিল্ড টাইমে ক্র্যাশ হওয়া রোধ করার জন্য সেফ চেক
const mongoUri = process.env.MONGO_DB_URI;
if (!mongoUri) {
  console.warn("⚠️ Warning: MONGO_DB_URI is not defined in environment variables.");
}

const client = new MongoClient(mongoUri || "mongodb://localhost:27017/fallback_db");
const db = client.db(process.env.AUTH_DB_NAME || "event-hive_db");

export const auth = betterAuth({
  database: mongodbAdapter(db),

  // 🛠️ লোকাল এবং প্রোডাকশন (Vercel) উভয়ের জন্যই সঠিক ও অটোমেটিক baseURL সেটআপ
  baseURL: process.env.BETTER_AUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),

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

  // 🛡️ ট্রাস্টেড অরিজিনস (রুট লেভেলে রাখা হয়েছে টাইপ এরর দূর করতে)
  trustedOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000", // অনেক সময় লোকালহোস্ট আইপি দিয়ে রান হয়
    "https://event-hive-client-self.vercel.app"
  ],

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