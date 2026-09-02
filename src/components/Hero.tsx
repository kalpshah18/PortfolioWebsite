import Image from "next/image";
import { PersonalInfo, SocialLink } from "@/types/portfolio";

interface HeroProps {
  personal: PersonalInfo;
  socials: SocialLink[];
}

export default function Hero({ personal, socials }: HeroProps) {
  return (
    <section
      id="profile"
      className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-20 min-h-[75vh] lg:h-[80vh] px-6 lg:px-20 mx-auto max-w-7xl pt-4 pb-12"
    >
      {/* Profile Picture */}
      <div className="section__pic-container flex flex-col items-center justify-center">
        <div className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] lg:w-[370px] lg:h-[370px] overflow-hidden rounded-full shadow-lg border-2 border-neutral-100">
          <Image
            src={personal.profileImage}
            alt={`${personal.name} Profile`}
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>

      {/* Hero Intro Text */}
      <div className="section__text text-center flex flex-col items-center">
        <p className="font-semibold text-neutral-600 text-base md:text-lg mb-1">
          {personal.roleGreeting}
        </p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black mb-3">
          {personal.name}
        </h1>
        <p className="font-semibold text-lg md:text-xl text-neutral-700 mb-2">
          {personal.headlineRole}
        </p>
        <p className="font-normal text-sm sm:text-base text-neutral-600 mb-6 whitespace-pre-line leading-relaxed">
          {personal.subRole}
        </p>

        {/* Action Buttons */}
        <div className="btn-container flex flex-wrap justify-center gap-4 mb-6">
          {personal.resumeUrl && (
            <a
              className="btn btn-color-2"
              href={personal.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {personal.resumeButtonText || "Download CV"}
            </a>
          )}
          <a className="btn btn-color-1" href="#contact">
            {personal.contactButtonText || "Contact Me"}
          </a>
        </div>

        {/* Social Icons */}
        <div id="socials-container" className="flex justify-center gap-4">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110 active:scale-95"
              aria-label={social.name}
            >
              <Image
                src={social.icon}
                alt={social.name}
                width={32}
                height={32}
                className="w-8 h-8 object-contain cursor-pointer"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
