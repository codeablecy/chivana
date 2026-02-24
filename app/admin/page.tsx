import { isAuthenticated } from "./actions"
import { AdminLogin } from "@/components/admin/admin-login"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const authed = await isAuthenticated()

  if (!authed) {
    return <AdminLogin />
  }

  return <AdminDashboard />
}
