import Image from "next/image";
import { PostersSection } from "@/types/portfolio";

interface PostersProps {
  posters: PostersSection;
}

export default function Posters({ posters }: PostersProps) {
  return (
    <section id="posters" className="relative min-h-screen py-16 px-6 lg:px-20 mx-auto max-w-7xl">
      {/* Headings */}
      <div className="text-center mb-12">
        <p className="font-semibold text-neutral-600 text-base mb-1">
          {posters.subtitle}
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black">
          {posters.title}
        </h2>
      </div>

      {/* Posters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {posters.posters.map((poster, idx) => (
          <div
            key={idx}
            className="details-container color-container w-full max-w-[380px] flex flex-col justify-between hover:border-neutral-500 transition-colors"
          >
            <div>
              {/* Poster Image */}
              <div className="w-full h-48 sm:h-52 relative mb-6 overflow-hidden rounded">
                <Image
                  src={poster.image}
                  alt={poster.title}
                  fill
                  className="project-img object-contain bg-white p-2"
                />
              </div>

              {/* Title */}
              <h3 className="font-bold text-lg sm:text-xl text-black text-center mb-2 px-2 leading-snug">
                {poster.title}
              </h3>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-neutral-600 text-center leading-relaxed mb-6 px-3">
                {poster.subtitle}
              </p>
            </div>

            {/* Link Button */}
            <div className="btn-container flex justify-center mt-auto pt-2">
              <a
                href={poster.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn project-btn"
              >
                {poster.buttonLabel || "Poster Link"}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Down Navigation Arrow */}
      <div className="hidden lg:flex justify-end mt-12">
        <a
          href="#blog"
          className="cursor-pointer transition-transform hover:translate-y-1"
          aria-label="Scroll to PORs"
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
