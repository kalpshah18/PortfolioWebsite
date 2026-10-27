export interface Lecture {
  number: number;
  title: string;
  summary: string;
  /** Filename in public/teaching/intro-to-cpp/slides/ (without .html). Leave undefined until the slides exist. */
  slug?: string;
  /** Optional extra material, e.g. { label: "Code", href: "..." } */
  resources?: { label: string; href: string }[];
}

// Add a lecture here after copying its deck to public/teaching/intro-to-cpp/slides/<slug>.html
export const lectures: Lecture[] = [
  {
    number: 1,
    title: "Why C++, and your first programs",
    summary:
      "Why C++ is fast, how it runs, first programs, data types, operators, loops, competitive programming basics and compiler optimizations.",
    slug: "lecture-01",
    resources: [
      { label: "Recording", href: "https://drive.google.com/file/d/1vW_e_wWRYYQAYD5CzE7qC7vHbRr_1uta/view" },
      { label: "Practice sheet", href: "/teaching/intro-to-cpp/files/Lecture1_Practice_Sheet.pdf" },
    ],
  },
  {
    number: 2,
    title: "Control Flow, Complexity, Arrays and Vectors",
    summary:
      "if / else and switch, loops and patterns, Big-O intuition, arrays, vectors and their costs, and useful STL functions.",
    slug: "lecture-02",
  },
];
