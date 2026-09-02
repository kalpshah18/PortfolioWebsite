import Image from "next/image";
import { AboutSection } from "@/types/portfolio";

interface AboutProps {
  about: AboutSection;
}

export default function About({ about }: AboutProps) {
  return (
    <section id="about" className="relative min-h-screen py-16 px-6 lg:px-20 mx-auto max-w-7xl">
      {/* Section Headings */}
      <div className="text-center mb-12">
        <p className="font-semibold text-neutral-600 text-base mb-1">
          {about.subtitle}
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black">
          {about.title}
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-16">
        {/* Left: About Photo with optional caption */}
        <div className="w-full lg:w-[420px] flex-shrink-0 flex flex-col items-center">
          <div className="relative w-full max-w-[380px] h-[400px] sm:h-[460px] rounded-3xl overflow-hidden shadow-md border border-neutral-200">
            <Image
              src={about.aboutImage}
              alt="About Profile"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 380px, 420px"
              className="object-cover"
            />
          </div>
          {about.aboutCaption && (
            <p className="profile-caption border border-neutral-200/60 shadow-sm mt-3">
              {about.aboutCaption}
            </p>
          )}
        </div>

        {/* Right: Cards & Narrative Bio */}
        <div className="flex-1 flex flex-col gap-8 max-w-2xl">
          {/* Experience & Education Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Experience Card */}
            <div className="details-container hover:shadow-md transition-shadow">
              {about.experienceCard.icon && (
                <div className="h-14 flex items-center justify-center mb-2">
                  {about.experienceCard.iconLink ? (
                    <a
                      href={about.experienceCard.iconLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={about.experienceCard.icon}
                        alt="Experience"
                        width={48}
                        height={48}
                        className="h-10 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </a>
                  ) : (
                    <Image
                      src={about.experienceCard.icon}
                      alt="Experience"
                      width={48}
                      height={48}
                      className="h-10 w-auto object-contain"
                    />
                  )}
                </div>
              )}
              <h3 className="font-bold text-xl text-black mb-2">
                {about.experienceCard.title}
              </h3>
              <div className="flex flex-col gap-2">
                {about.experienceCard.items.map((item, idx) => (
                  <p key={idx} className="text-sm sm:text-base leading-snug">
                    <span className="font-medium text-black">{item.role}</span>
                    <br />
                    <span className="text-neutral-500 text-xs sm:text-sm">
                      {item.duration}
                    </span>
                  </p>
                ))}
              </div>
            </div>

            {/* Education Card */}
            <div className="details-container hover:shadow-md transition-shadow">
              {about.educationCard.icon && (
                <div className="h-14 flex items-center justify-center mb-2">
                  {about.educationCard.iconLink ? (
                    <a
                      href={about.educationCard.iconLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={about.educationCard.icon}
                        alt="Education"
                        width={60}
                        height={60}
                        className="h-14 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </a>
                  ) : (
                    <Image
                      src={about.educationCard.icon}
                      alt="Education"
                      width={60}
                      height={60}
                      className="h-14 w-auto object-contain"
                    />
                  )}
                </div>
              )}
              <h3 className="font-bold text-xl text-black mb-2">
                {about.educationCard.title}
              </h3>
              <div className="flex flex-col gap-2">
                {about.educationCard.items.map((item, idx) => (
                  <p key={idx} className="text-sm sm:text-base leading-snug">
                    <span className="font-medium text-black">{item.degree}</span>
                    <br />
                    <span className="text-neutral-500 text-xs sm:text-sm">
                      {item.duration}
                    </span>
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Bio text */}
          <div className="text-neutral-600 text-sm sm:text-base leading-relaxed flex flex-col gap-4">
            {about.bioParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Down Navigation Arrow */}
      <div className="hidden lg:flex justify-end mt-12">
        <a
          href="#projects"
          className="cursor-pointer transition-transform hover:translate-y-1"
          aria-label="Scroll to Projects"
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
