import { createClient } from "@supabase/supabase-js"

/**
 * Server-only admin client using the service role key.
 * Bypasses RLS — use ONLY inside Server Actions and API routes.
 * Never import this file in client components.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl?.trim()) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is required. Set it in .env.local (see .env.example)."
    )
  }
  if (!serviceRoleKey?.trim()) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required. Set it in .env.local (see .env.example)."
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createClient<any>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
