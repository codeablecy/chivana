"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock } from "lucide-react"
import { login } from "@/app/admin/actions"

export function AdminLogin() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const result = await login(password)
    if (result.success) {
      router.refresh()
    } else {
      setError("Contrasena incorrecta")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mx-auto mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground text-sm mt-1">Chivana Real Estate</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-xl border border-border p-6 flex flex-col gap-4"
        >
          <div>
            <label htmlFor="password" className="text-sm font-medium text-foreground mb-1.5 block">
              Contrasena
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Introduce la contrasena"
              required
              autoFocus
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? "Verificando..." : "Acceder"}
          </Button>
        </form>
      </div>
    </div>
  )
}
