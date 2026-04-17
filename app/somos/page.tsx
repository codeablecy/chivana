import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { seo } from "@/lib/seo"

export const metadata: Metadata = {
  title: { absolute: `Somos | ${seo.siteName}` },
  description:
    "Chivana Real Estate: empresa internacional de construcción, promoción y desarrollo inmobiliario con más de tres décadas de experiencia.",
  alternates: { canonical: "/somos" },
  openGraph: {
    type: "website",
    locale: seo.locale,
    url: "/somos",
    siteName: seo.siteName,
    title: `Somos | ${seo.siteName}`,
    description:
      "Conoce quiénes somos, nuestra visión y propósito, y el ámbito de actuación de Chivana Real Estate.",
  },
}

const differentiators = [
  "Calidad y atención al detalle: cada proyecto refleja excelencia en ejecución y acabados.",
  "Enfoque innovador: aplicamos tecnología avanzada y estrategias eficientes desde la fase conceptual hasta la final.",
  "Compromiso y ética profesional: transparencia, responsabilidad y solidez en cada acción.",
  "Colaboración estratégica: trabajamos en estrecha alianza con clientes, socios y comunidades locales para generar valor compartido y un impacto positivo duradero.",
]

const values = [
  "Integridad: práctica ética en todas nuestras operaciones.",
  "Innovación: impulsamos soluciones modernas y sostenibles.",
  "Excelencia técnica: supervisión rigurosa del detalle constructivo y arquitectónico.",
  "Orientación al cliente: diseñamos pensando en bienestar, funcionalidad y satisfacción.",
  "Responsabilidad social: creemos en el desarrollo sostenible y su contribución al entorno.",
]

export default function SomosPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 bg-background">
        <section className="relative overflow-hidden border-b border-border/60 bg-navy py-16 px-4 lg:py-24 lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(230,149,0,0.32),transparent_42%),radial-gradient(circle_at_88%_72%,rgba(230,149,0,0.14),transparent_36%)]" />
          <div className="relative mx-auto max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">SOMOS</p>
            <h1 className="font-serif text-3xl font-bold leading-tight text-card lg:text-5xl">
              Chivana Real Estate: Construyendo espacios. Creando futuro.
            </h1>
          </div>
        </section>

        <article className="px-4 py-14 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-3xl space-y-14 text-[1.05rem] leading-8 text-foreground/90">
            <section className="space-y-5">
              <h2 className="font-serif text-3xl leading-tight text-foreground">Quiénes somos</h2>
              <p>
                Chivana Real Estate es una empresa internacional de construcción, promoción y desarrollo inmobiliario con más de tres décadas de experiencia. Nuestro equipo multidisciplinar combina innovación, integridad y profesionalidad para ofrecer resultados extraordinarios.
              </p>
            </section>

            <section className="space-y-5 border-t border-border/70 pt-12">
              <h2 className="font-serif text-3xl leading-tight text-foreground">Nuestra visión y propósito</h2>
              <p>
                Desarrollamos experiencias de vida, no edificaciones. Nuestro propósito es diseñar y materializar espacios excepcionales – residenciales, comerciales e industriales – que integren calidad, funcionalidad y diseño moderno, respondiendo a las demandas evolutivas del mercado.
              </p>
            </section>

            <section className="space-y-5 border-t border-border/70 pt-12">
              <h2 className="font-serif text-3xl leading-tight text-foreground">Ámbito de actuación</h2>
              <p>
                Operamos en toda España (Costa del Sol, Ibiza, Santander, Galicia, Madrid capital ,Toledo y sus entornos), así como en mercados internacionales como Reino Unido (Londres), Chipre, Grecia, Italia y Alemania.
              </p>
            </section>

            <section className="space-y-5 border-t border-border/70 pt-12">
              <h2 className="font-serif text-3xl leading-tight text-foreground">Servicios integrales</h2>
              <p>
                Ofrecemos un servicio completo de desarrollo inmobiliario que abarca: estudio de viabilidad, planificación y diseño, construcción, promoción y gestión del proyecto hasta su entrega al cliente.
              </p>
            </section>

            <section className="space-y-5 border-t border-border/70 pt-12">
              <h2 className="font-serif text-3xl leading-tight text-foreground">Diferenciadores clave</h2>
              <ul className="space-y-5 text-foreground/85">
                {differentiators.map((item) => (
                  <li key={item} className="relative pl-7">
                    <span className="absolute left-0 top-3 h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-5 border-t border-border/70 pt-12">
              <h2 className="font-serif text-3xl leading-tight text-foreground">Experiencia internacional</h2>
              <p>
                Con proyectos exitosos en España y diversos países europeos, tenemos experiencia en desarrollos residenciales de alto estándar, complejos vacacionales, hoteles y espacios terciarios en entornos urbanos y turísticos.
              </p>
            </section>

            <section className="space-y-5 border-t border-border/70 pt-12">
              <h2 className="font-serif text-3xl leading-tight text-foreground">Valores fundamentales</h2>
              <ul className="space-y-5 text-foreground/85">
                {values.map((item) => (
                  <li key={item} className="relative pl-7">
                    <span className="absolute left-0 top-3 h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-5 border-t border-border/70 pt-12">
              <h2 className="font-serif text-3xl leading-tight text-foreground">Construimos valor</h2>
              <p>
                Nos une una visión clara: no solo creamos propiedades, sino experiencias de vida que perduran. En Chivana Real Estate, cada proyecto es una promesa cumplida, reflejo de confianza, profesionalidad y alto impacto.
              </p>
            </section>

          
          </div>
        </article>
      </main>
    </>
  )
}
