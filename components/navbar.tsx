"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { useOverAccentSection } from "@/hooks/use-over-accent-section";
import { formatPhoneHref, useSettings } from "@/lib/settings-context";
import { cn } from "@/lib/utils";
import { Mail, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Proyectos", href: "/projects" },
  { label: "Somos", href: "/somos" },
  { label: "Citas y Visitas", href: "/citas-visitas" },
  { label: "Contacto", href: "/#contacto" },
];

/** Scroll to #contacto when already on home; avoids no-op when URL is already /#contacto. Returns true if scroll was performed. */
function scrollToContact(
  e: React.MouseEvent<HTMLAnchorElement>,
  pathname: string,
): boolean {
  if (pathname !== "/") return false;
  e.preventDefault();
  const el = document.getElementById("contacto");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", "/#contacto");
    return true;
  }
  return false;
}

export function Navbar() {
  const settings = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isOverAccent = useOverAccentSection("top");

  const isActive = (href: string) => {
    const path = href.replace(/#.*$/, "") || "/";
    if (href === "/") return pathname === "/" && !pathname.includes("#");
    return pathname.startsWith(path) && path !== "/";
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="px-3 pt-3 sm:px-4 lg:px-6 lg:pt-4">
        <div className="mx-auto max-w-[1440px]">
          <div className="relative isolate overflow-hidden rounded-2xl border border-white/16 bg-navy/94 shadow-[0_18px_50px_rgba(15,23,42,0.28),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-xl supports-[backdrop-filter]:bg-navy/88">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_45%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(8,15,26,0.28),rgba(8,15,26,0.14)_35%,rgba(8,15,26,0.2))]" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-[radial-gradient(circle_at_left,rgba(230,149,0,0.14),transparent_70%)]" />
            <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
            <div className="relative flex items-center justify-between px-4 py-3 lg:px-6">
              <Link href="/" className="group flex flex-col">
                <span className="font-serif text-lg font-bold tracking-[0.08em] text-accent transition-transform duration-300 group-hover:translate-x-0.5 lg:text-xl">
                  CHIVANA
                </span>
                <span className="text-[10px] uppercase tracking-[0.32em] text-navy-foreground/78 lg:text-[11px]">
                  Real Estate
                </span>
              </Link>

              <nav className="hidden lg:flex items-center rounded-full border border-white/14 bg-white/10 px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) =>
                      link.href === "/#contacto" && scrollToContact(e, pathname)
                    }
                    className={cn(
                      "relative rounded-full px-4 py-2 text-sm font-medium tracking-[0.01em] transition-all duration-300",
                      isActive(link.href)
                        ? isOverAccent
                          ? "bg-white text-accent shadow-[0_8px_22px_rgba(15,23,42,0.12)]"
                          : "bg-white/14 text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                        : "text-white/88 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="hidden lg:flex items-center gap-3">
                {settings.phone && (
                  <Link
                    href={formatPhoneHref(settings.phone)}
                    className="group flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-3.5 py-2 text-sm text-white/90 transition-all duration-300 hover:border-white/18 hover:bg-white/12 hover:text-white"
                  >
                    <Phone className="h-4 w-4 text-accent transition-transform duration-300 group-hover:scale-105" />
                    <span>{settings.phone}</span>
                  </Link>
                )}
                <Button
                  size="sm"
                  className="h-10 rounded-full border border-accent/20 bg-accent px-4 text-[13px] font-semibold text-accent-foreground shadow-[0_10px_24px_rgba(230,149,0,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/95 hover:shadow-[0_16px_34px_rgba(230,149,0,0.34)]"
                  asChild
                >
                  <Link
                    href="/#contacto"
                    onClick={(e) => scrollToContact(e, pathname)}
                  >
                    Quiero Saber Mas
                  </Link>
                </Button>
              </div>

              <button
                onClick={() => setIsOpen(true)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/14 bg-white/10 text-white/92 transition-all duration-300 hover:bg-white/14 lg:hidden"
                aria-label="Abrir menu"
              >
                <Menu className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="right"
          hideClose
          className="flex w-[min(90vw,22rem)] max-w-none flex-col border-0 bg-[linear-gradient(180deg,#ffffff_0%,#fbfbfb_100%)] p-0 shadow-2xl dark:bg-card"
        >
          <div className="flex items-center justify-between border-b border-border/80 px-5 pb-4 pt-6">
            <Link
              href="/"
              className="flex flex-col"
              onClick={() => setIsOpen(false)}
            >
              <span className="font-serif text-lg font-bold tracking-[0.08em] text-accent">
                CHIVANA
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-foreground/70">
                Real Estate
              </span>
            </Link>
            <SheetClose
              className="-mr-1 rounded-full border border-border/70 p-2.5 text-foreground transition-colors hover:bg-muted focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Cerrar menu"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </SheetClose>
          </div>

          <nav className="flex flex-1 flex-col gap-1 px-3 py-6 overflow-y-auto">
            {navLinks.map((link) => (
              <SheetClose key={link.href} asChild>
                <Link
                  href={link.href}
                  onClick={(e) => {
                    if (link.href === "/#contacto") {
                      scrollToContact(e, pathname) && setIsOpen(false);
                    }
                  }}
                  className={cn(
                    "flex min-h-[48px] items-center rounded-2xl px-4 text-base font-medium transition-all duration-200",
                    isActive(link.href)
                      ? "bg-accent text-accent-foreground shadow-[0_10px_24px_rgba(230,149,0,0.2)]"
                      : "text-foreground hover:bg-muted/80",
                  )}
                >
                  {link.label}
                </Link>
              </SheetClose>
            ))}
          </nav>

          <div className="space-y-4 border-t border-border/80 px-5 pb-8 pt-4">
            {settings.phone && (
              <a
                href={formatPhoneHref(settings.phone)}
                className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm text-foreground transition-colors hover:text-accent"
              >
                <Phone className="h-4 w-4 shrink-0" strokeWidth={2} />
                <span>{settings.phone}</span>
              </a>
            )}
            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm text-foreground transition-colors hover:text-accent"
              >
                <Mail className="h-4 w-4 shrink-0" strokeWidth={2} />
                <span className="break-all">{settings.email}</span>
              </a>
            )}
            <SheetClose asChild>
              <Button
                className="h-12 w-full rounded-full font-medium shadow-[0_12px_26px_rgba(230,149,0,0.22)]"
                asChild
              >
                <Link
                  href="/#contacto"
                  onClick={(e) => {
                    scrollToContact(e, pathname);
                    setIsOpen(false);
                  }}
                >
                  Quiero Saber Mas
                </Link>
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
