import { NavLink } from "@/types/portfolio";

interface FooterProps {
  links: NavLink[];
  copyright: string;
}

export default function Footer({ links, copyright }: FooterProps) {
  return (
    <footer className="h-[26vh] flex flex-col justify-center items-center px-4 pb-8">
      <nav className="mb-6">
        <ul className="flex flex-wrap justify-center gap-6 sm:gap-8 list-none text-base sm:text-xl">
          {links.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                target={link.isExternal ? "_blank" : undefined}
                rel={link.isExternal ? "noopener noreferrer" : undefined}
                className="nav-link-custom"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <p className="text-center text-xs sm:text-sm text-neutral-500">
        {copyright}
      </p>
    </footer>
  );
}
