import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export const metadata: Metadata = {
  title: "Política de privacidad | Chivana Real Estate | El Mirador",
  description:
    "Política de privacidad de Chivana Real Estate. Información sobre el tratamiento de datos personales, cookies, contacto y derechos.",
}

/**
 * Privacy policy page — content from Chivana Real Estate official policy.
 * @see https://www.chivana-realestate.com/privacy-policy
 */
export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <article className="py-16 px-4 lg:py-24 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-2">
              Legal
            </p>
            <h1 className="font-serif text-3xl font-bold text-foreground lg:text-4xl xl:text-5xl text-balance mb-4">
              Política de privacidad
            </h1>
            <p className="text-muted-foreground text-lg mb-12 leading-relaxed">
              La confidencialidad y la seguridad son valores primordiales de Chivana Real Estate
              y, en consecuencia, asumimos el compromiso de garantizar la privacidad del usuario
              en todo momento y de no recabar información innecesaria sobre el Usuario.
            </p>

            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10">
              <section>
                <h2 className="font-serif text-xl font-bold text-foreground mb-3">
                  ¿Quién es el Responsable del tratamiento?
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Dependiendo del tratamiento que se lleve a cabo, el responsable del tratamiento
                  de sus datos personales puede ser Chivana Real Estate, S.L. y/o las distintas
                  sociedades gestionadas por Chivana Real Estate, S.L. que sean las promotoras del
                  proyecto, todas con domicilio social en:
                </p>
                <p className="text-foreground font-medium">
                  Carrer de la Mercè, núm. 17, esc. B, planta 1, puerta D, 17230 Palamós (Girona)
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Chivana Real Estate, S.L. se encarga de la gestión centralizada del tratamiento
                  de datos en nombre y por cuenta de las sociedades del grupo Chivana que, al ser
                  las promotoras de las distintas promociones, son las responsables del tratamiento
                  de los datos personales que se obtengan en cada promoción.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
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
              </section>

              <section>
                <h2 className="font-serif text-xl font-bold text-foreground mb-3">
                  ¿Cuáles son las finalidades del tratamiento de datos personales?
                </h2>

                <h3 className="font-semibold text-foreground mt-6 mb-2">
                  A) Formulario de contacto / envío de un correo electrónico o llamada telefónica
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  En el caso de que haya rellenado sus datos en el formulario de contacto o bien
                  nos haya llamado o remitido un correo electrónico solicitando información,
                  Chivana Real Estate tratará sus datos personales para poder atender y gestionar
                  su solicitud resolviendo la petición de información que haya podido requerir.
                  El tratamiento se basa en el consentimiento que usted presta al enviar
                  activamente su solicitud. Usted podrá retirar su consentimiento en cualquier
                  momento, expresando su voluntad a{" "}
                  <a
                    href="mailto:info@chivana-realestate.com"
                    className="text-accent hover:underline"
                  >
                    info@chivana-realestate.com
                  </a>
                </p>

                <h3 className="font-semibold text-foreground mt-6 mb-2">B) Blog</h3>
                <p className="text-muted-foreground leading-relaxed">
                  En el caso de que haya rellenado sus datos en el formulario de contacto del
                  Blog, Chivana Real Estate tratará sus datos personales para poderle enviar
                  información sobre el Blog o bien sobre promociones de Chivana. El tratamiento se
                  basa en el consentimiento que usted presta al pulsar la suscripción. Usted
                  podrá retirar su consentimiento en cualquier momento, expresando su voluntad a
                  info@chivana-realestate.com, así como en cada una de las comunicaciones que
                  reciba.
                </p>

                <h3 className="font-semibold text-foreground mt-6 mb-2">C) Cookies</h3>
                <p className="text-muted-foreground leading-relaxed">
                  La página web de Chivana Real Estate instala cookies en los dispositivos de
                  navegación de los usuarios con el objetivo de obtener información analítica y
                  estadística de su navegación y del uso de nuestra página. Asimismo, en esta
                  página web se tratan cookies de terceros para fines publicitarios. La
                  instalación de dichas cookies se realiza de manera voluntaria por los usuarios,
                  pudiendo en todo momento configurar sus opciones o retirar el consentimiento
                  prestado. Puede encontrar más información en la política de cookies.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl font-bold text-foreground mb-3">
                  ¿Durante cuánto tiempo conservamos sus datos?
                </h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 pl-2">
                  <li>
                    <strong className="text-foreground">Contacto:</strong> Trataremos sus datos
                    durante el tiempo necesario para atender y resolver la petición que nos haya
                    formulado a través de la sección de Contacto, y en cualquier caso, en el
                    plazo máximo de 1 año, Chivana Real Estate procederá a su borrado.
                  </li>
                  <li>
                    <strong className="text-foreground">Blog:</strong> Trataremos sus datos
                    durante el tiempo en que usted mantenga su consentimiento, cesando en el
                    tratamiento una vez lo haya retirado.
                  </li>
                  <li>
                    <strong className="text-foreground">Cookies:</strong> Se podrán tratar los
                    datos mientras mantenga su consentimiento para su instalación y durante la
                    duración de la instalación de estas, siendo 2 años el plazo máximo.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-xl font-bold text-foreground mb-3">
                  ¿A quién comunicamos sus datos?
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Chivana Real Estate cuenta con colaboradores que prestan servicios (empresas
                  de informática y mantenimiento web, servicios jurídicos y de consultoría) que
                  para prestar sus servicios pueden acceder a los datos personales. Chivana Real
                  Estate realiza una minuciosa selección y control de estos terceros con los que
                  tiene firmados acuerdos de protección de datos. Asimismo, Chivana Real Estate
                  puede comunicar los datos de los interesados a las autoridades administrativas
                  que lo requieran. Aparte de lo anterior, Chivana Real Estate no comunica sus
                  datos personales a ningún tercero adicional.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl font-bold text-foreground mb-3">
                  Seguridad de sus datos personales
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Chivana Real Estate ha adoptado todas las medidas de índole técnica y
                  organizativa necesarias para garantizar la seguridad de los datos personales
                  suministrados y evitar su alteración, pérdida y tratamientos o accesos no
                  autorizados.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl font-bold text-foreground mb-3">
                  ¿Cuáles son sus derechos y cómo ejercerlos?
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Usted podrá, en los términos establecidos en la normativa sobre protección de
                  datos, revocar en cualquier momento la autorización concedida para el
                  tratamiento y cesión de sus datos personales, así como ejercer sus derechos de
                  acceso, rectificación, oposición, limitación, supresión, portabilidad y no ser
                  objeto de decisiones automatizadas, escribiendo a Chivana Real Estate a:{" "}
                  <a
                    href="mailto:info@chivana-realestate.com"
                    className="text-accent hover:underline"
                  >
                    info@chivana-realestate.com
                  </a>
                  , con domicilio social en Cuesta la Higuera, 45215 El Viso de San Juan,
                  Toledo, España.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Si considera que se ha violado alguno de sus derechos de protección de datos,
                  puede ponerse en contacto con Chivana Real Estate en la dirección anterior. En
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
              </section>
            </div>

            <div className="mt-14 pt-8 border-t border-border">
              <Link
                href="/"
                className="text-accent font-medium hover:underline inline-flex items-center gap-1"
              >
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </article>
      </main>
    </>
  )
}
