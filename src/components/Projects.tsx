import Image from "next/image";
import { ProjectsSection } from "@/types/portfolio";

interface ProjectsProps {
  projects: ProjectsSection;
}

export default function Projects({ projects }: ProjectsProps) {
  return (
    <section id="projects" className="relative min-h-screen py-16 px-6 lg:px-20 mx-auto max-w-7xl">
      {/* Headings */}
      <div className="text-center mb-12">
        <p className="font-semibold text-neutral-600 text-base mb-1">
          {projects.subtitle}
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black">
          {projects.title}
        </h2>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {projects.projects.map((project, idx) => (
          <div
            key={idx}
            className="details-container color-container w-full max-w-[380px] flex flex-col justify-between hover:border-neutral-500 transition-colors"
          >
            <div>
              {/* Project Image */}
              <div className="w-full h-48 sm:h-52 relative mb-6 overflow-hidden rounded">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="project-img object-contain bg-white p-2"
                />
              </div>

              {/* Project Title */}
              <h3 className="font-bold text-xl sm:text-2xl text-black text-center mb-2 px-2">
                {project.title}
              </h3>

              {/* Project Description */}
              <p className="text-xs sm:text-sm text-neutral-600 text-center leading-relaxed mb-6 px-3">
                {project.description}
              </p>
            </div>

            {/* Buttons */}
            <div className="btn-container flex flex-wrap justify-center gap-3 mt-auto pt-2">
              {project.buttons.map((btn, btnIdx) => (
                <a
                  key={btnIdx}
                  href={btn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn project-btn"
                >
                  {btn.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Down Navigation Arrow */}
      <div className="hidden lg:flex justify-end mt-12">
        <a
          href="#posters"
          className="cursor-pointer transition-transform hover:translate-y-1"
          aria-label="Scroll to Posters"
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
