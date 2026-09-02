"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NavLink, PersonalInfo } from "@/types/portfolio";

interface NavbarProps {
  personal: PersonalInfo;
  links: NavLink[];
}

export default function Navbar({ personal, links }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex justify-around items-center h-[17vh] px-8">
        <Link href="#" className="flex items-center gap-3 text-2xl md:text-[2rem] font-medium text-black hover:no-underline">
          {personal.logoIcon && (
            <Image
              src={personal.logoIcon}
              alt="Logo"
              width={45}
              height={45}
              className="w-[45px] h-[45px] object-contain"
            />
          )}
          <span>{personal.logoName || personal.name}</span>
        </Link>
        <div>
          <ul className="flex list-none gap-8 text-xl lg:text-[1.5rem]">
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
        </div>
      </nav>

      {/* Hamburger Navigation (Mobile & Tablet) */}
      <nav className="flex lg:hidden justify-between items-center h-[14vh] px-6 sm:px-12 relative z-50">
        <Link href="#" className="flex items-center gap-2 text-xl font-medium text-black hover:no-underline">
          {personal.logoIcon && (
            <Image
              src={personal.logoIcon}
              alt="Logo"
              width={35}
              height={35}
              className="w-[35px] h-[35px] object-contain"
            />
          )}
          <span>{personal.logoName || personal.name}</span>
        </Link>

        <div className="relative">
          <button
            type="button"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="flex flex-col justify-between w-[30px] h-[22px] cursor-pointer bg-transparent border-0 p-0 focus:outline-none"
          >
            <span
              className={`w-full h-[2px] bg-black transition-all duration-300 ease-in-out ${
                isOpen ? "rotate-45 translate-y-[10px]" : ""
              }`}
            />
            <span
              className={`w-full h-[2px] bg-black transition-all duration-300 ease-in-out ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`w-full h-[2px] bg-black transition-all duration-300 ease-in-out ${
                isOpen ? "-rotate-45 -translate-y-[10px]" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          <div
            className={`absolute right-0 top-full mt-3 bg-white/95 backdrop-blur-md shadow-xl rounded-2xl p-4 min-w-[200px] flex flex-col gap-2 transition-all duration-300 ease-in-out border border-neutral-200 ${
              isOpen
                ? "opacity-100 translate-y-0 pointer-events-auto visible"
                : "opacity-0 -translate-y-2 pointer-events-none invisible"
            }`}
          >
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target={link.isExternal ? "_blank" : undefined}
                rel={link.isExternal ? "noopener noreferrer" : undefined}
                onClick={() => setIsOpen(false)}
                className="text-lg py-2 px-3 text-center text-black hover:bg-neutral-100 rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
