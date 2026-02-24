"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Package,
  FolderPlus,
  FileText,
  Settings,
  LogOut,
  Home,
} from "lucide-react"
import { logout } from "@/app/admin/actions"
import { InventoryManager } from "./inventory-manager"
import { ProjectCreator } from "./project-creator"
import { BlogManager } from "./blog-manager"
import { SettingsManager } from "./settings-manager"

const tabs = [
  { id: "inventory", label: "Inventario", icon: Package },
  { id: "create", label: "Nuevo Proyecto", icon: FolderPlus },
  { id: "blog", label: "Blog / CMS", icon: FileText },
  { id: "settings", label: "Configuracion", icon: Settings },
] as const

type TabId = (typeof tabs)[number]["id"]

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("inventory")
  const router = useRouter()

  async function handleLogout() {
    await logout()
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <div>
              <h1 className="font-serif text-lg font-bold text-foreground">Admin CRM</h1>
              <p className="text-xs text-muted-foreground">Chivana Real Estate</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-transparent" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Sitio Web</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Tab navigation */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8 lg:py-8">
        {activeTab === "inventory" && <InventoryManager />}
        {activeTab === "create" && <ProjectCreator />}
        {activeTab === "blog" && <BlogManager />}
        {activeTab === "settings" && <SettingsManager />}
      </div>
    </div>
  )
}
