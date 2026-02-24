"use client"

import React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, X, Eye, EyeOff, FileText } from "lucide-react"
import { fetchPosts, addPost, editPost, removePost } from "@/app/admin/actions"
import type { BlogPost } from "@/lib/types"
import { PostsSkeleton } from "./admin-skeleton"

export function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "/images/exterior.jpg",
  })
  const [saving, setSaving] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [loading, setLoading] = useState(false)

  const loadPosts = useCallback(async () => {
    const data = await fetchPosts()
    setPosts(data)
    setInitialLoading(false)
  }, [])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  function resetForm() {
    setFormData({ title: "", excerpt: "", content: "", image: "/images/exterior.jpg" })
    setShowForm(false)
    setEditingId(null)
  }

  function startEdit(post: BlogPost) {
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
    })
    setEditingId(post.id)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    if (editingId) {
      await editPost(editingId, formData)
    } else {
      await addPost(formData)
    }

    resetForm()
    await loadPosts()
    setSaving(false)
  }

  async function handleDelete(id: string) {
    await removePost(id)
    await loadPosts()
  }

  async function handleTogglePublish(post: BlogPost) {
    await editPost(post.id, { published: !post.published })
    await loadPosts()
  }

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold text-foreground lg:text-2xl">
            Blog / CMS
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona los articulos del blog.
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Articulo
          </Button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-xl border border-border p-6 lg:p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-bold text-foreground">
              {editingId ? "Editar Articulo" : "Nuevo Articulo"}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <Label htmlFor="post-title">Titulo</Label>
                <Input
                  id="post-title"
                  value={formData.title}
                  onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Titulo del articulo"
                  required
                  className="mt-1.5"
                />
              </div>
              <div className="sm:w-64">
                <Label htmlFor="post-image">Imagen (ruta)</Label>
                <Input
                  id="post-image"
                  value={formData.image}
                  onChange={(e) => setFormData((f) => ({ ...f, image: e.target.value }))}
                  placeholder="/images/photo.jpg"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="post-excerpt">Extracto</Label>
              <Textarea
                id="post-excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData((f) => ({ ...f, excerpt: e.target.value }))}
                placeholder="Breve resumen del articulo..."
                rows={2}
                required
                className="mt-1.5 resize-none"
              />
            </div>

            <div>
              <Label htmlFor="post-content">Contenido</Label>
              <Textarea
                id="post-content"
                value={formData.content}
                onChange={(e) => setFormData((f) => ({ ...f, content: e.target.value }))}
                placeholder="Escribe el contenido completo del articulo..."
                rows={6}
                required
                className="mt-1.5 resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {saving
                  ? "Guardando..."
                  : editingId
                    ? "Guardar Cambios"
                    : "Publicar Articulo"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm} className="bg-transparent">
                Cancelar
              </Button>
            </div>
          </div>
        </form>
      )}

      {initialLoading ? (
        <PostsSkeleton />
      ) : posts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-card rounded-xl border border-border p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-foreground text-sm truncate">{post.title}</h3>
                  <Badge
                    className={
                      post.published
                        ? "bg-primary text-primary-foreground flex-shrink-0"
                        : "bg-muted text-muted-foreground flex-shrink-0"
                    }
                  >
                    {post.published ? "Publicado" : "Borrador"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{post.excerpt}</p>
                <p className="text-xs text-muted-foreground mt-1">{post.date}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTogglePublish(post)}
                  className="h-8 bg-transparent"
                >
                  {post.published ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5 mr-1" />
                      Ocultar
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Publicar
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startEdit(post)}
                  className="h-8 bg-transparent"
                >
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(post.id)}
                  className="h-8 text-destructive hover:text-destructive bg-transparent"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <FileText className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="font-serif text-lg font-bold text-foreground mb-1">Sin articulos</h3>
          <p className="text-muted-foreground text-sm">
            Crea tu primer articulo pulsando el boton de arriba.
          </p>
        </div>
      )}
    </div>
  )
}
