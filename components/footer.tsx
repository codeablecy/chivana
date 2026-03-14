"use client"

import Link from "next/link";
import { FooterMap } from "./footer-map";
import { formatPhoneHref, useSettings } from "@/lib/settings-context";

/** Shape passed from layout (getFooterProjects). Sync component — safe in Client and Server trees. */
export type FooterProject = {
  slug: string;
  name: string;
  status: string;
  tags: string[];
};

const STATUS_LABEL: Record<string, string> = {
  active: "En Venta",
  "coming-soon": "Próximamente",
  "sold-out": "Agotado",
};

const STATUS_DOT: Record<string, string> = {
  active: "bg-emerald-400",
  "coming-soon": "bg-amber-400",
  "sold-out": "bg-slate-400",
};

interface FooterProps {
  /** Projects to show in "Proyectos" column. Fetched in root layout; empty if store unavailable. */
  projects?: FooterProject[];
}

export function Footer({ projects = [] }: FooterProps) {
  const settings = useSettings()
  const sorted =
    projects.length === 0
      ? []
      : [
          ...projects.filter((p) => p.tags?.includes("Destacado")),
          ...projects.filter((p) => !p.tags?.includes("Destacado")),
        ];

  return (
    <footer className="bg-navy px-4 py-10 lg:px-8 pb-24 sm:pb-28">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          {/* Brand */}
          <div className="lg:max-w-xs">
            <Link href="/" className="inline-block">
              <span className="font-serif text-lg font-bold text-accent tracking-wide">
                CHIVANA
              </span>
              <p className="text-[10px] tracking-[0.2em] text-navy-foreground/70 uppercase">
                Real Estate
              </p>
            </Link>
            <p className="text-navy-foreground/70 text-sm mt-4 leading-relaxed">
              La mejor opcion para vivir en El Viso de San Juan. A un paso de
              Madrid y Toledo, disfruta de tranquilidad, naturaleza y calidad de
              vida.
            </p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-14">
            {/* Navigation */}
            <div>
              <h4 className="text-navy-foreground font-semibold text-sm mb-3">
                Navegación
              </h4>
              <nav className="flex flex-col gap-2">
                <Link
                  href="/"
                  className="text-navy-foreground/70 text-sm hover:text-accent transition-colors"
                >
                  Inicio
                </Link>
                <Link
                  href="/projects"
                  className="text-navy-foreground/70 text-sm hover:text-accent transition-colors"
                >
                  Proyectos
                </Link>
                <Link
                  href="/citas-visitas"
                  className="text-navy-foreground/70 text-sm hover:text-accent transition-colors"
                >
                  Citas y Visitas
                </Link>
                <Link
                  href="/#contacto"
                  className="text-navy-foreground/70 text-sm hover:text-accent transition-colors"
                >
                  Contacto
                </Link>
              </nav>
            </div>

            {/* Dynamic projects */}
            {sorted.length > 0 && (
              <div>
                <h4 className="text-navy-foreground font-semibold text-sm mb-3">
                  Proyectos
                </h4>
                <nav className="flex flex-col gap-2.5">
                  {sorted.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/projects/${p.slug}`}
                      className="group flex items-center gap-2 text-navy-foreground/70 text-sm hover:text-accent transition-colors"
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full shrink-0 transition-opacity ${STATUS_DOT[p.status] ?? "bg-slate-400"} opacity-70 group-hover:opacity-100`}
                        title={STATUS_LABEL[p.status]}
                      />
                      {p.name}
                    </Link>
                  ))}
                </nav>
              </div>
            )}

            {/* Contact */}
            <div>
              <h4 className="text-navy-foreground font-semibold text-sm mb-3">
                Contacto
              </h4>
              <div className="flex flex-col gap-2 text-sm text-navy-foreground/70">
                {settings.phone && (
                  <Link
                    href={formatPhoneHref(settings.phone)}
                    className="hover:text-accent transition-colors"
                  >
                    {settings.phone}
                  </Link>
                )}
                {settings.email && (
                  <Link
                    href={`mailto:${settings.email}`}
                    className="hover:text-accent transition-colors"
                  >
                    {settings.email}
                  </Link>
                )}
                {settings.address && <p>{settings.address}</p>}
                {(settings.postalCode || settings.city) && (
                  <p>
                    {[settings.postalCode, settings.city, settings.province]
                      .filter(Boolean)
                      .join(", ")}
                    {(settings.city || settings.province) && ", Spain"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <FooterMap />

        <div className="border-t border-navy-foreground/10 mt-8 pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-navy-foreground/60 text-xs">
            {settings.companyName}. Todos los derechos reservados. ©{" "}
            {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy-policy"
              className="text-navy-foreground/60 text-xs hover:text-accent transition-colors"
            >
              Política de Privacidad
            </Link>
          </div>
        </div>
        {/* Credit by Codeable — subtle cyberpunk neon */}
        <div className="mt-6 pt-4 border-t border-navy-foreground/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-navy-foreground/40">
            Built & maintained by{" "}
            <Link
              href="https://www.codeable.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="credit-neon font-medium tracking-normal normal-case text-navy-foreground/70 transition-all duration-300"
              aria-label="Codeable — design and development"
            >
              Codeable
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
