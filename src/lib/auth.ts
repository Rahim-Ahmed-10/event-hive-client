import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGO_DB_URI!);
const db = client.db(process.env.AUTH_DB_NAME || "event-hive_db");

export const auth = betterAuth({
  // ১. ডাটাবেজ লেভেলে কাস্টম ফিল্ড অ্যাড করা
  database: mongodbAdapter(db, {
    client,
    schema: {
      user: {
        fields: {
          role: {
            type: "string",
            defaultValue: "user",
          },
          plan: {
            type: "string",
            defaultValue: "free",
          },
        },
      },
    },
  }),

  emailAndPassword: {
    enabled: true,
  },

  // ২. ক্লায়েন্ট লেভেলে ইনপুট রিসিভ করার জন্য অতিরিক্ত ফিল্ড ডিফাইন করা
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

  // ৩. সেশন বা টোকেনের মাধ্যমে ফ্রন্টএন্ডে ডেটা পাস করার জন্য কনফিগারেশন
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