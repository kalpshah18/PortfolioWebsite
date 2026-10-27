import type { Metadata } from "next";
import Link from "next/link";
import { lectures } from "./lectures";

export const metadata: Metadata = {
  title: "Intro to C++ | Kalp Shah",
  description: "Lecture slides and resources for Intro to C++.",
};

export default function IntroToCppPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/" className="text-sm text-theme-muted hover:underline">
        ← Kalp Shah
      </Link>

      <header className="mt-8 mb-10">
        <h1 className="text-4xl font-semibold text-black">Intro to C++</h1>
        <p className="mt-3 text-lg">
          Lecture slides and resources. Slides open in a new page and can be presented full screen (press F).
        </p>
      </header>

      <h2 className="text-2xl font-medium mb-4">Lectures</h2>
      <ul className="list-none p-0 m-0 flex flex-col gap-4">
        {lectures.map((lec) => (
          <li key={lec.number} className="rounded-2xl border border-theme-border p-5 shadow-project">
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <h3 className="text-xl font-medium text-black">
                Lecture {lec.number}: {lec.title}
              </h3>
              {lec.slug ? (
                <div className="flex gap-4 text-sm font-medium">
                  <a href={`/teaching/intro-to-cpp/slides/${lec.slug}.html`} className="underline underline-offset-4">
                    Slides
                  </a>
                  {lec.resources?.map((r) => (
                    <a key={r.href} href={r.href} className="underline underline-offset-4">
                      {r.label}
                    </a>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-theme-muted">Coming soon</span>
              )}
            </div>
            <p className="mt-2 mb-0">{lec.summary}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
