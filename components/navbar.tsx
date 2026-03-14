"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { formatPhoneHref, useSettings } from "@/lib/settings-context";
import { cn } from "@/lib/utils";
import { Mail, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Proyectos", href: "/projects" },
  { label: "Citas y Visitas", href: "/citas-visitas" },
  { label: "Contacto", href: "/#contacto" },
];

/** Scroll to #contacto when already on home; avoids no-op when URL is already /#contacto */
function scrollToContact(e: React.MouseEvent<HTMLAnchorElement>, pathname: string) {
  if (pathname !== "/") return
  e.preventDefault()
  const el = document.getElementById("contacto")
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" })
    window.history.replaceState(null, "", "/#contacto")
  }
}

export function Navbar() {
  const settings = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    const path = href.replace(/#.*$/, "") || "/";
    if (href === "/") return pathname === "/" && !pathname.includes("#");
    return pathname.startsWith(path) && path !== "/";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy border-b border-navy-foreground/15 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex flex-col">
          <span className="font-serif text-lg font-bold text-accent tracking-wide lg:text-xl">
            CHIVANA
          </span>
          <span className="text-[10px] tracking-[0.2em] text-navy-foreground/70 uppercase lg:text-xs">
            Real Estate
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => link.href === "/#contacto" && scrollToContact(e, pathname)}
              className={cn(
                "text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "text-accent"
                  : "text-navy-foreground/80 hover:text-accent",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          {settings.phone && (
            <Link
              href={formatPhoneHref(settings.phone)}
              className="flex items-center gap-2 text-sm text-navy-foreground/80 hover:text-accent transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>{settings.phone}</span>
            </Link>
          )}
          <Button size="sm" asChild>
            <Link href="/#contacto" onClick={(e) => scrollToContact(e, pathname)}>
              Quiero Saber Mas
            </Link>
          </Button>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden p-2.5 -mr-1 min-h-[44px] min-w-[44px] flex items-center justify-center text-navy-foreground rounded-lg hover:bg-navy-foreground/10 transition-colors"
          aria-label="Abrir menu"
        >
          <Menu className="h-6 w-6" aria-hidden />
        </button>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="right"
          hideClose
          className="flex flex-col w-[min(90vw,22rem)] max-w-none border-0 bg-white shadow-2xl p-0 dark:bg-card"
        >
          <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-border">
            <Link
              href="/"
              className="flex flex-col"
              onClick={() => setIsOpen(false)}
            >
              <span className="font-serif text-lg font-bold text-accent tracking-wide">
                CHIVANA
              </span>
              <span className="text-[10px] tracking-[0.2em] text-foreground/70 uppercase font-medium">
                Real Estate
              </span>
            </Link>
            <SheetClose
              className="rounded-full p-2.5 text-foreground hover:bg-muted transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 -mr-1"
              aria-label="Cerrar menu"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </SheetClose>
          </div>

          <nav className="flex flex-col px-3 py-6 gap-0.5 flex-1 overflow-y-auto">
            {navLinks.map((link) => (
              <SheetClose key={link.href} asChild>
                <Link
                  href={link.href}
                  onClick={(e) => link.href === "/#contacto" && scrollToContact(e, pathname)}
                  className={cn(
                    "flex items-center min-h-[48px] px-4 rounded-xl text-base font-medium transition-all duration-200",
                    isActive(link.href)
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  {link.label}
                </Link>
              </SheetClose>
            ))}
          </nav>

          <div className="px-5 pb-8 pt-4 border-t border-border space-y-4">
            {settings.phone && (
              <a
                href={formatPhoneHref(settings.phone)}
                className="flex items-center gap-3 text-sm text-foreground hover:text-accent transition-colors py-2.5"
              >
                <Phone className="h-4 w-4 shrink-0" strokeWidth={2} />
                <span>{settings.phone}</span>
              </a>
            )}
            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-3 text-sm text-foreground hover:text-accent transition-colors py-2.5"
              >
                <Mail className="h-4 w-4 shrink-0" strokeWidth={2} />
                <span className="break-all">{settings.email}</span>
              </a>
            )}
            <SheetClose asChild>
              <Button className="w-full h-12 font-medium" asChild>
                <Link href="/#contacto" onClick={(e) => scrollToContact(e, pathname)}>
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
