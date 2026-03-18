import { getProjectIcon } from "@/lib/project-icons";

/**
 * Full-width orange section with glassmorphism quality cards.
 * Maps over `qualities` array — add/remove entries freely.
 */
export function ProjectQualities({
  qualities,
}: {
  qualities: { title: string; description: string; icon: string }[];
}) {
  return (
    <section
      data-accent-section
      className="relative py-16 px-4 lg:py-24 lg:px-8 bg-accent overflow-hidden"
    >
      {/* Subtle radial highlight for depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.12),transparent)]" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-white/70 font-semibold text-xs tracking-[0.2em] uppercase mb-3">
            Acabados
          </p>
          <h2 className="font-serif text-3xl font-bold text-white lg:text-4xl xl:text-5xl text-balance">
            Memoria de Calidades
          </h2>
          <p className="text-white/75 mt-4 max-w-xl mx-auto leading-relaxed text-base">
            Cada detalle cuenta. Materiales de primera y acabados de lujo en
            cada rincon.
          </p>
        </div>

        {/* Flex-wrap keeps each row centered for any card count (odd/even) */}
        <div className="flex flex-wrap justify-center gap-5 items-stretch">
          {qualities.map((q, idx) => {
            const Icon = getProjectIcon(q.icon);
            return (
              <div
                // `title` is not guaranteed unique (e.g. repeated "Zonas Comunes")
                key={`${q.title}-${idx}`}
                className="group relative bg-white/10 hover:bg-white/[0.16] backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/10 w-full sm:w-[18rem] flex-none"
              >
                {/* Icon */}
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-white/20 group-hover:bg-white/25 transition-colors mb-5">
                  <Icon className="h-5 w-5 text-white" strokeWidth={1.75} />
                </div>

                <h3 className="font-serif text-lg font-bold text-white mb-2 leading-snug">
                  {q.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {q.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
