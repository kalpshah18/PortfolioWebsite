export interface Course {
  slug: string;
  code?: string;
  title: string;
  term: string;
  institution: string;
  instructors?: string[];
  description: string;
}

// Add a course here after creating src/app/teaching/<slug>/page.tsx
export const courses: Course[] = [
  {
    slug: "intro-to-cpp",
    code: "SC 428",
    title: "Introduction to C++ and the STL",
    term: "Autumn 2026",
    institution: "IIT Gandhinagar",
    instructors: ["Bhavay Goyal", "Kalp Shah", "Ramji Purwar"],
    description:
      "Short course for beginners: control flow, time complexity, arrays, vectors and the STL. Lecture slides, recordings and practice sheets.",
  },
];
