import Link from "next/link"
import { FooterMap } from "./footer-map"

export function Footer() {
  return (
    <footer className="bg-navy px-4 py-10 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="lg:max-w-xs">
            <Link href="/" className="inline-block">
              <span className="font-serif text-lg font-bold text-accent tracking-wide">
                CHIVANA
              </span>
              <p className="text-[10px] tracking-[0.2em] text-navy-foreground/70 uppercase">Real Estate</p>
            </Link>
            <p className="text-navy-foreground/70 text-sm mt-4 leading-relaxed">
              La mejor opcion para vivir en El Viso de San Juan. A un paso de Madrid y Toledo,
              disfruta de tranquilidad, naturaleza y calidad de vida.
            </p>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:gap-16">
            <div>
              <h4 className="text-navy-foreground font-semibold text-sm mb-3">Navegacion</h4>
              <nav className="flex flex-col gap-2">
                <Link href="/" className="text-navy-foreground/70 text-sm hover:text-accent transition-colors">
                  Inicio
                </Link>
                <Link
                  href="/projects"
                  className="text-navy-foreground/70 text-sm hover:text-accent transition-colors"
                >
                  Proyectos
                </Link>
                <Link
                  href="/projects/viso-1"
                  className="text-navy-foreground/70 text-sm hover:text-accent transition-colors"
                >
                  El Mirador - Viso 1
                </Link>
                <Link
                  href="/projects/viso-2"
                  className="text-navy-foreground/70 text-sm hover:text-accent transition-colors"
                >
                  El Mirador - Fase II
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
            <div>
              <h4 className="text-navy-foreground font-semibold text-sm mb-3">Contacto</h4>
              <div className="flex flex-col gap-2 text-sm text-navy-foreground/70">
                <a href="tel:+34655754978" className="hover:text-accent transition-colors">
                  +34 655 754 978
                </a>
                <a
                  href="mailto:info@chivana-realestate.com"
                  className="hover:text-accent transition-colors"
                >
                  info@chivana-realestate.com
                </a>
                <p>Urb. Apr 19, 1P</p>
                <p>45215 El Viso de San Juan, Toledo, Spain</p>
              </div>
            </div>
          </div>
        </div>

        <FooterMap />

        <div className="border-t border-navy-foreground/10 mt-8 pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-navy-foreground/60 text-xs">
            Chivana Real Estate. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-navy-foreground/60 text-xs hover:text-accent transition-colors">
              Politica de Privacidad
            </a>
            <a href="#" className="text-navy-foreground/60 text-xs hover:text-accent transition-colors">
              Aviso Legal
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
