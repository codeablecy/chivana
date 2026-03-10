"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export type AuthResult = { error: string } | { success: true }

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export async function signInAction(formData: FormData): Promise<AuthResult> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email?.trim() || !password) {
    return { error: "Introduce tu email y contraseña." }
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  redirect("/admin")
}

export async function signUpAction(formData: FormData): Promise<AuthResult> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = (formData.get("name") as string)?.trim()

  if (!email?.trim() || !password) {
    return { error: "Introduce tu email y contraseña." }
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name || undefined },
      emailRedirectTo: `${SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function signOutAction(): Promise<never> {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/auth/sign-in")
}
