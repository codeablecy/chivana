import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { seo } from "@/lib/seo"
import { ArrowLeft, FileText, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad de Chivana Real Estate. Información sobre el tratamiento de datos personales, cookies, contacto y derechos.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    type: "article",
    locale: seo.locale,
    url: "/privacy-policy",
    siteName: seo.siteName,
    title: "Política de privacidad",
    description:
      "Política de privacidad de Chivana Real Estate. Información sobre el tratamiento de datos personales, cookies, contacto y derechos.",
  },
}

/**
 * Privacy policy page — same Medium-like UI/UX as blog.
 * Content from Chivana Real Estate official policy.
 */
export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-20">
        <article className="max-w-2xl mx-auto px-5 lg:px-0">
          {/* Back link — same as blog */}
          <div className="pt-8 pb-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              Volver al inicio
            </Link>
          </div>

          {/* Title block — same structure as blog header */}
          <header className="pt-6 pb-8 border-b border-border">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
              Legal
            </p>
            <h1 className="font-serif text-3xl font-bold text-foreground leading-snug sm:text-4xl lg:text-5xl mb-5">
              Política de privacidad
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              La confidencialidad y la seguridad son valores primordiales de Chivana Real Estate
              y, en consecuencia, asumimos el compromiso de garantizar la privacidad del usuario
              en todo momento y de no recabar información innecesaria sobre el Usuario.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Documento legal
              </span>
            </div>
          </header>

          {/* Body — same typography as blog (Medium-like) */}
          <div className="py-10 space-y-6 text-[17px] leading-8 text-foreground/90">
            <h2 className="font-serif text-2xl font-bold text-foreground pt-4 leading-tight">
              ¿Quién es el Responsable del tratamiento?
            </h2>
            <p className="text-foreground/85 leading-8">
              Dependiendo del tratamiento que se lleve a cabo, el responsable del tratamiento de
              sus datos personales puede ser Chivana Real Estate, S.L. y/o las distintas
              sociedades gestionadas por Chivana Real Estate, S.L. que sean las promotoras del
              proyecto, todas con domicilio social en:
            </p>
            <p className="text-foreground/85 leading-8 font-medium">
              Carrer de la Mercè, núm. 17, esc. B, planta 1, puerta D, 17230 Palamós (Girona)
            </p>
            <p className="text-foreground/85 leading-8">
              Chivana Real Estate, S.L. se encarga de la gestión centralizada del tratamiento de
              datos en nombre y por cuenta de las sociedades del grupo Chivana que, al ser las
              promotoras de las distintas promociones, son las responsables del tratamiento de los
              datos personales que se obtengan en cada promoción.
            </p>
            <p className="text-foreground/85 leading-8">
              Si quiere conocer el detalle de las sociedades del grupo Chivana o bien desea
              trasladar cualquier consulta o solicitud que tenga en materia de protección de
              datos, puede ponerse en contacto con nosotros a través de:{" "}
              <a
                href="mailto:info@chivana-realestate.com"
                className="text-accent hover:underline"
              >
                info@chivana-realestate.com
              </a>
            </p>

            <h2 className="font-serif text-2xl font-bold text-foreground pt-4 leading-tight">
              ¿Cuáles son las finalidades del tratamiento de datos personales?
            </h2>

            <h3 className="font-serif text-xl font-semibold text-foreground pt-2 leading-tight">
              A) Formulario de contacto / envío de un correo electrónico o llamada telefónica
            </h3>
            <p className="text-foreground/85 leading-8">
              En el caso de que haya rellenado sus datos en el formulario de contacto o bien nos
              haya llamado o remitido un correo electrónico solicitando información, Chivana Real
              Estate tratará sus datos personales para poder atender y gestionar su solicitud
              resolviendo la petición de información que haya podido requerir. El tratamiento se
              basa en el consentimiento que usted presta al enviar activamente su solicitud.
              Usted podrá retirar su consentimiento en cualquier momento, expresando su voluntad
              a{" "}
              <a href="mailto:info@chivana-realestate.com" className="text-accent hover:underline">
                info@chivana-realestate.com
              </a>
            </p>

            <h3 className="font-serif text-xl font-semibold text-foreground pt-2 leading-tight">
              B) Blog
            </h3>
            <p className="text-foreground/85 leading-8">
              En el caso de que haya rellenado sus datos en el formulario de contacto del Blog,
              Chivana Real Estate tratará sus datos personales para poderle enviar información
              sobre el Blog o bien sobre promociones de Chivana. El tratamiento se basa en el
              consentimiento que usted presta al pulsar la suscripción. Usted podrá retirar su
              consentimiento en cualquier momento, expresando su voluntad a
              info@chivana-realestate.com, así como en cada una de las comunicaciones que
              reciba.
            </p>

            <h3 className="font-serif text-xl font-semibold text-foreground pt-2 leading-tight">
              C) Cookies
            </h3>
            <p className="text-foreground/85 leading-8">
              La página web de Chivana Real Estate instala cookies en los dispositivos de
              navegación de los usuarios con el objetivo de obtener información analítica y
              estadística de su navegación y del uso de nuestra página. Asimismo, en esta
              página web se tratan cookies de terceros para fines publicitarios. La instalación
              de dichas cookies se realiza de manera voluntaria por los usuarios, pudiendo en
              todo momento configurar sus opciones o retirar el consentimiento prestado. Puede
              encontrar más información en la política de cookies.
            </p>

            <h2 className="font-serif text-2xl font-bold text-foreground pt-4 leading-tight">
              ¿Durante cuánto tiempo conservamos sus datos?
            </h2>
            <ul className="list-disc list-inside text-foreground/85 leading-8 space-y-2 pl-1">
              <li>
                <strong className="text-foreground">Contacto:</strong> Trataremos sus datos
                durante el tiempo necesario para atender y resolver la petición que nos haya
                formulado a través de la sección de Contacto, y en cualquier caso, en el plazo
                máximo de 1 año, Chivana Real Estate procederá a su borrado.
              </li>
              <li>
                <strong className="text-foreground">Blog:</strong> Trataremos sus datos durante
                el tiempo en que usted mantenga su consentimiento, cesando en el tratamiento
                una vez lo haya retirado.
              </li>
              <li>
                <strong className="text-foreground">Cookies:</strong> Se podrán tratar los datos
                mientras mantenga su consentimiento para su instalación y durante la duración de
                la instalación de estas, siendo 2 años el plazo máximo.
              </li>
            </ul>

            <h2 className="font-serif text-2xl font-bold text-foreground pt-4 leading-tight">
              ¿A quién comunicamos sus datos?
            </h2>
            <p className="text-foreground/85 leading-8">
              Chivana Real Estate cuenta con colaboradores que prestan servicios (empresas de
              informática y mantenimiento web, servicios jurídicos y de consultoría) que para
              prestar sus servicios pueden acceder a los datos personales. Chivana Real Estate
              realiza una minuciosa selección y control de estos terceros con los que tiene
              firmados acuerdos de protección de datos. Asimismo, Chivana Real Estate puede
              comunicar los datos de los interesados a las autoridades administrativas que lo
              requieran. Aparte de lo anterior, Chivana Real Estate no comunica sus datos
              personales a ningún tercero adicional.
            </p>

            <h2 className="font-serif text-2xl font-bold text-foreground pt-4 leading-tight">
              Seguridad de sus datos personales
            </h2>
            <p className="text-foreground/85 leading-8">
              Chivana Real Estate ha adoptado todas las medidas de índole técnica y
              organizativa necesarias para garantizar la seguridad de los datos personales
              suministrados y evitar su alteración, pérdida y tratamientos o accesos no
              autorizados.
            </p>

            <h2 className="font-serif text-2xl font-bold text-foreground pt-4 leading-tight">
              ¿Cuáles son sus derechos y cómo ejercerlos?
            </h2>
            <p className="text-foreground/85 leading-8">
              Usted podrá, en los términos establecidos en la normativa sobre protección de
              datos, revocar en cualquier momento la autorización concedida para el tratamiento
              y cesión de sus datos personales, así como ejercer sus derechos de acceso,
              rectificación, oposición, limitación, supresión, portabilidad y no ser objeto de
              decisiones automatizadas, escribiendo a Chivana Real Estate a:{" "}
              <a href="mailto:info@chivana-realestate.com" className="text-accent hover:underline">
                info@chivana-realestate.com
              </a>
              , con domicilio social en Cuesta la Higuera, 45215 El Viso de San Juan, Toledo,
              España.
            </p>
            <p className="text-foreground/85 leading-8">
              Si considera que se ha violado alguno de sus derechos de protección de datos, puede
              ponerse en contacto con Chivana Real Estate en la dirección anterior. En
              cualquier caso, siempre puede dirigirse a la Agencia Española de Protección de
              Datos:{" "}
              <a
                href="https://www.aepd.es"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                www.aepd.es
              </a>
            </p>
          </div>

          {/* Divider — same as blog */}
          <div className="flex items-center gap-3 py-4 border-t border-border">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Chivana Real Estate
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* CTA — same pattern as blog */}
          <div className="my-10 rounded-2xl bg-accent/8 border border-accent/20 px-6 py-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">
              ¿Dudas sobre tus datos?
            </p>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
              Contáctanos
            </h2>
            <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
              Para ejercer tus derechos o resolver cualquier consulta en materia de privacidad.
            </p>
            <Link
              href="/#contacto"
              className="inline-flex items-center gap-2 bg-accent text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-accent/90 transition-colors"
            >
              Ir a contacto
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}
