import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth"; // আপনার প্রোজেক্টের auth ফাইলের সঠিক পাথ দিন

// Next.js-কে বাধ্য করবে প্রতিবার ডাটাবেজ থেকে তাজা ডাটা রিড করতে (ক্যাশ এড়াবে)
export const dynamic = "force-dynamic"; 

export const { GET, POST } = toNextJsHandler(auth);