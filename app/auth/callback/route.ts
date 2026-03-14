import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

/**
 * Handles OAuth callbacks and email confirmation links from Supabase Auth.
 * Redirect base must match Supabase Dashboard → Auth → URL Configuration (Redirect URLs).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/admin"
  const baseUrl = SITE_URL

  if (code) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${baseUrl}${next}`)
    }
  }

  return NextResponse.redirect(`${baseUrl}/auth/sign-in?error=callback_error`)
}
