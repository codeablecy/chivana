"use client";

import { isAuthenticated } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/types";
import { Settings2 } from "lucide-react";
import * as React from "react";
import { ProjectEditorSheet } from "./project-editor-sheet";
import { useOverAccentSection } from "@/hooks/use-over-accent-section";

export interface ManagementOverlayProps {
  project: Project;
}

/** Sheet close animation duration (from components/ui/sheet) — wait before showing button. */
const SHEET_CLOSE_MS = 350;

/**
 * Admin-only overlay on project pages. Shows "Edit Project Details" button
 * that opens the full editor sheet. Button appears only after the sheet
 * is fully closed (post-close animation) for a cleaner UX.
 */
export function ManagementOverlay({ project }: ManagementOverlayProps) {
  const [authenticated, setAuthenticated] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [showButton, setShowButton] = React.useState(true);
  const isOverAccent = useOverAccentSection();

  React.useEffect(() => {
    isAuthenticated().then(setAuthenticated);
  }, []);

  React.useEffect(() => {
    if (open) {
      setShowButton(false);
    } else {
      const id = window.setTimeout(() => setShowButton(true), SHEET_CLOSE_MS);
      return () => clearTimeout(id);
    }
  }, [open]);

  if (!authenticated) return null;

  return (
    <>
      {showButton && (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-2">
          <Button
            onClick={() => setOpen(true)}
            size="lg"
            className={
              isOverAccent
                ? "shadow-lg rounded-full h-14 px-6 gap-2 bg-white text-accent border-2 border-accent/40 hover:bg-white hover:border-accent/70 hover:shadow-lg"
                : "shadow-lg rounded-full h-14 px-6 gap-2 bg-accent text-accent-foreground border-2 border-accent/30 hover:bg-accent/90 hover:border-accent/50"
            }
          >
            <Settings2 className="h-5 w-5" />
            <span className="flex flex-col items-start leading-tight">
              <span>Editar proyecto</span>
              <span
                className={
                  isOverAccent
                    ? "text-xs text-accent/70"
                    : "text-xs text-muted-foreground"
                }
              >
                Edit project
              </span>
            </span>
          </Button>
        </div>
      )}
      <ProjectEditorSheet
        project={project}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
