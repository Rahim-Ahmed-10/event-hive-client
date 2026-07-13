import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: "http://localhost:3000"
});

export const { signIn, signUp, useSession } = createAuthClient()
// TypeScript কে 'role' প্রোপার্টির কথা জানিয়ে দেওয়া
declare module "better-auth/react" {
    interface User {
        role?: "admin" | "doctor" | "user"; 
    }
}