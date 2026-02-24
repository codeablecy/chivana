"use client"

import * as React from "react"
import { Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectEditorSheet } from "./project-editor-sheet"
import { isAuthenticated } from "@/app/admin/actions"
import type { Project } from "@/lib/types"

export interface ManagementOverlayProps {
  project: Project
}

/**
 * Admin-only overlay on project pages. Shows "Edit Project Details" button
 * that opens the full editor sheet.
 */
export function ManagementOverlay({ project }: ManagementOverlayProps) {
  const [authenticated, setAuthenticated] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    isAuthenticated().then(setAuthenticated)
  }, [])

  if (!authenticated) return null

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-2">
        <Button
          onClick={() => setOpen(true)}
          size="lg"
          className="shadow-lg rounded-full h-14 px-6 gap-2"
        >
          <Settings2 className="h-5 w-5" />
          Editar proyecto
        </Button>
      </div>
      <ProjectEditorSheet
        project={project}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
