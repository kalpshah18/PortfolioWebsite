import Image from "next/image";
import { ContactSection } from "@/types/portfolio";

interface ContactProps {
  contact: ContactSection;
}

export default function Contact({ contact }: ContactProps) {
  return (
    <section
      id="contact"
      className="flex flex-col justify-center items-center min-h-[50vh] lg:h-[70vh] py-16 px-6 mx-auto max-w-5xl"
    >
      {/* Headings */}
      <div className="text-center mb-6">
        <p className="font-semibold text-neutral-600 text-base mb-1">
          {contact.subtitle}
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black">
          {contact.title}
        </h2>
      </div>

      {/* Pill Contact Container */}
      <div className="flex flex-col sm:flex-row justify-center items-center rounded-3xl border border-neutral-400 bg-neutral-50 px-6 sm:px-10 py-3 gap-6 sm:gap-10 my-6 shadow-sm">
        {/* Email */}
        {contact.email && (
          <div className="flex items-center gap-3">
            <Image
              src="/assets/email.png"
              alt="Email"
              width={35}
              height={35}
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain cursor-default"
            />
            <a
              href={`mailto:${contact.email}`}
              className="text-base sm:text-lg text-black hover:text-neutral-600 hover:underline transition-colors"
            >
              {contact.email}
            </a>
          </div>
        )}

        {/* LinkedIn */}
        {contact.linkedin && contact.linkedin.url && (
          <div className="flex items-center gap-3">
            <Image
              src="/assets/linkedin.png"
              alt="LinkedIn"
              width={32}
              height={32}
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain cursor-default"
            />
            <a
              href={contact.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base sm:text-lg text-black hover:text-neutral-600 hover:underline transition-colors"
            >
              {contact.linkedin.label || "LinkedIn"}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
