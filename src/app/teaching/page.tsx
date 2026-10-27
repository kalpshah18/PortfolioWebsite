import type { Metadata } from "next";
import Link from "next/link";
import { courses } from "./courses";

export const metadata: Metadata = {
  title: "Teaching | Kalp Shah",
  description: "Courses I teach: lecture slides, recordings and practice material.",
};

export default function TeachingPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/" className="text-sm text-theme-muted hover:underline">
        ← Kalp Shah
      </Link>

      <header className="mt-8 mb-10">
        <h1 className="text-4xl font-semibold text-black">Teaching</h1>
        <p className="mt-3 text-lg">Courses I teach. Pick a course for its lecture slides, recordings and practice sheets.</p>
      </header>

      <ul className="list-none p-0 m-0 flex flex-col gap-5">
        {courses.map((course) => (
          <li key={course.slug}>
            <Link
              href={`/teaching/${course.slug}`}
              className="block rounded-2xl border border-theme-border p-6 shadow-project hover:shadow-project-hover transition-shadow no-underline"
            >
              <p className="m-0 text-sm text-theme-muted">
                {[course.code, course.term, course.institution].filter(Boolean).join(" · ")}
              </p>
              <h2 className="mt-1 mb-2 text-2xl font-medium text-black">{course.title}</h2>
              <p className="m-0">{course.description}</p>
              <span className="inline-block mt-4 text-sm font-medium text-black underline underline-offset-4">
                Open course →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
