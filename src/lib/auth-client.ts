import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.BETTER_AUTH_URL  || process.env.BETTER_AUTH_URL,

    plugins:[jwtClient()]
});

export const { signIn, signUp, useSession } = createAuthClient()
// TypeScript কে 'role' প্রোপার্টির কথা জানিয়ে দেওয়া
declare module "better-auth/react" {
    interface User {
        role?: "admin" | "doctor" | "user"; 
    }
}