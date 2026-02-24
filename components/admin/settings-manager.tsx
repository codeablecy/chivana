"use client"

import React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Settings } from "lucide-react"
import { fetchSettings, saveSettings } from "@/app/admin/actions"
import type { SiteSettings } from "@/lib/types"
import { FormSkeleton } from "./admin-skeleton"

export function SettingsManager() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const loadSettings = useCallback(async () => {
    setLoading(true)
    const data = await fetchSettings()
    setSettings(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  function updateField(field: keyof SiteSettings, value: string | number) {
    setSettings((prev) => (prev ? { ...prev, [field]: value } : prev))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
    setSaved(false)
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (!settings) return false

    if (!settings.companyName.trim()) newErrors.companyName = "Nombre requerido"
    if (!settings.phone.trim()) newErrors.phone = "Telefono requerido"
    if (!settings.email.trim()) {
      newErrors.email = "Email requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
      newErrors.email = "Email no valido"
    }
    if (!settings.metaTitle.trim()) newErrors.metaTitle = "Titulo SEO requerido"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!settings || !validate()) return

    setSaving(true)
    await saveSettings(settings)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading || !settings) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="font-serif text-xl font-bold text-foreground lg:text-2xl">
            Configuracion Global
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Cargando configuracion...
          </p>
        </div>
        <FormSkeleton fields={8} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h2 className="font-serif text-xl font-bold text-foreground lg:text-2xl">
            Configuracion Global
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Datos de contacto, SEO y redes sociales del sitio.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-card rounded-xl border border-border p-6 lg:p-8 max-w-2xl">
        <div className="flex flex-col gap-5">
          {/* Company Info */}
          <fieldset className="flex flex-col gap-4">
            <legend className="font-semibold text-foreground text-sm mb-1 flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              Datos de Empresa
            </legend>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <Label htmlFor="companyName">Nombre</Label>
                <Input
                  id="companyName"
                  value={settings.companyName}
                  onChange={(e) => updateField("companyName", e.target.value)}
                  className="mt-1.5"
                  required
                />
                {errors.companyName && (
                  <p className="text-destructive text-xs mt-1">{errors.companyName}</p>
                )}
              </div>
              <div className="sm:w-48">
                <Label htmlFor="phone">Telefono</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="mt-1.5"
                  required
                />
                {errors.phone && (
                  <p className="text-destructive text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="mt-1.5"
                required
              />
              {errors.email && (
                <p className="text-destructive text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </fieldset>

          {/* Address */}
          <fieldset className="flex flex-col gap-4 border-t border-border pt-5">
            <legend className="font-semibold text-foreground text-sm mb-1">Direccion</legend>
            <div>
              <Label htmlFor="address">Calle</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) => updateField("address", e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  value={settings.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div className="sm:w-36">
                <Label htmlFor="province">Provincia</Label>
                <Input
                  id="province"
                  value={settings.province}
                  onChange={(e) => updateField("province", e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div className="sm:w-28">
                <Label htmlFor="postalCode">CP</Label>
                <Input
                  id="postalCode"
                  value={settings.postalCode}
                  onChange={(e) => updateField("postalCode", e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="officeHours">Horario de Oficina</Label>
              <Textarea
                id="officeHours"
                value={settings.officeHours}
                onChange={(e) => updateField("officeHours", e.target.value)}
                rows={2}
                className="mt-1.5 resize-none"
              />
            </div>
          </fieldset>

          {/* SEO */}
          <fieldset className="flex flex-col gap-4 border-t border-border pt-5">
            <legend className="font-semibold text-foreground text-sm mb-1">SEO</legend>
            <div>
              <Label htmlFor="metaTitle">Meta Titulo</Label>
              <Input
                id="metaTitle"
                value={settings.metaTitle}
                onChange={(e) => updateField("metaTitle", e.target.value)}
                className="mt-1.5"
                required
              />
              {errors.metaTitle && (
                <p className="text-destructive text-xs mt-1">{errors.metaTitle}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {settings.metaTitle.length}/60 caracteres
              </p>
            </div>
            <div>
              <Label htmlFor="metaDescription">Meta Descripcion</Label>
              <Textarea
                id="metaDescription"
                value={settings.metaDescription}
                onChange={(e) => updateField("metaDescription", e.target.value)}
                rows={2}
                className="mt-1.5 resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {settings.metaDescription.length}/160 caracteres
              </p>
            </div>
          </fieldset>

          {/* Social */}
          <fieldset className="flex flex-col gap-4 border-t border-border pt-5">
            <legend className="font-semibold text-foreground text-sm mb-1">Redes Sociales</legend>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <Label htmlFor="socialInstagram">Instagram</Label>
                <Input
                  id="socialInstagram"
                  value={settings.socialInstagram}
                  onChange={(e) => updateField("socialInstagram", e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="mt-1.5"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="socialFacebook">Facebook</Label>
                <Input
                  id="socialFacebook"
                  value={settings.socialFacebook}
                  onChange={(e) => updateField("socialFacebook", e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="mt-1.5"
                />
              </div>
            </div>
          </fieldset>

          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <Button
              type="submit"
              disabled={saving}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {saving ? "Guardando..." : "Guardar Configuracion"}
            </Button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-primary">
                <CheckCircle2 className="h-4 w-4" />
                Guardado
              </span>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
