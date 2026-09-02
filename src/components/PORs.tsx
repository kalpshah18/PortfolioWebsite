import Image from "next/image";
import { PORsSection } from "@/types/portfolio";

interface PORsProps {
  pors: PORsSection;
}

export default function PORs({ pors }: PORsProps) {
  return (
    <section id="blog" className="relative min-h-screen py-16 px-6 lg:px-20 mx-auto max-w-7xl">
      {/* Headings */}
      <div className="text-center mb-12">
        <p className="font-semibold text-neutral-600 text-base mb-1">
          {pors.subtitle}
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black">
          {pors.title}
        </h2>
      </div>

      {/* POR Decks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {pors.groups.map((group, gIdx) => (
          <div
            key={gIdx}
            className="details-container hover:shadow-md transition-shadow p-6 sm:p-8 flex flex-col gap-6"
          >
            {group.items.map((item, iIdx) => (
              <article key={iIdx} className="flex gap-4 items-start text-left">
                <div className="flex-shrink-0 mt-1">
                  <Image
                    src="/assets/checkmark.png"
                    alt="Checkmark"
                    width={28}
                    height={28}
                    className="w-6 h-6 sm:w-7 sm:h-7 object-contain cursor-default"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base sm:text-lg text-black mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 whitespace-pre-line leading-relaxed">
                    {item.organization}
                  </p>
                  {item.details && item.details.length > 0 && (
                    <div className="mt-1 flex flex-col gap-1">
                      {item.details.map((detail, dIdx) => (
                        <p
                          key={dIdx}
                          className="text-xs sm:text-sm text-neutral-500 leading-relaxed"
                        >
                          {detail}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ))}
      </div>

      {/* Down Navigation Arrow */}
      <div className="hidden lg:flex justify-end mt-12">
        <a
          href="#contact"
          className="cursor-pointer transition-transform hover:translate-y-1"
          aria-label="Scroll to Contact"
        >
          <Image
            src="/assets/arrow.png"
            alt="Scroll down"
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
          />
        </a>
      </div>
    </section>
  );
}
