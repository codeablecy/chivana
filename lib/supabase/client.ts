import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Browser / Server-Component client using the anon key.
 * Used for public reads (projects, blog posts, settings).
 * Safe to use in both client and server components.
 *
 * `cache: 'no-store'` prevents Next.js from caching Supabase
 * responses in its data cache, ensuring fresh reads after writes.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = createClient<any>(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (input: RequestInfo | URL, init?: RequestInit) =>
      fetch(input, { ...init, cache: "no-store" }),
  },
})
