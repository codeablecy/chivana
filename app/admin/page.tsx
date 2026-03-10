import { createSupabaseServerClient } from "@/lib/supabase/server"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const dynamic = "force-dynamic"

/**
 * Middleware protects /admin — unauthenticated users are redirected to /auth/sign-in.
 * This page only renders for authenticated users.
 */
export default async function AdminPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <AdminDashboard user={user ? {
    email: user.email ?? "",
    name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    avatarUrl: user.user_metadata?.avatar_url ?? null,
  } : null} />
}
