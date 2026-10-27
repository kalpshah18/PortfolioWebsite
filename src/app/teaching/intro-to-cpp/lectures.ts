export interface Lecture {
  number: number;
  title: string;
  summary: string;
  /** Filename in public/teaching/intro-to-cpp/slides/ (without .html). Leave undefined until the slides exist. */
  slug?: string;
  /** Optional extra material, e.g. { label: "Code", href: "..." } */
  resources?: { label: string; href: string }[];
}

// Add a lecture here after creating public/teaching/intro-to-cpp/slides/<slug>.html
export const lectures: Lecture[] = [
  {
    number: 1,
    title: "Getting Started",
    summary: "Compiling and running programs, Hello world, basic types and input/output.",
    slug: "lecture-01",
  },
  {
    number: 2,
    title: "Control Flow and Functions",
    summary: "Conditionals, loops, functions and scope.",
  },
];
