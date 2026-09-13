import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPortfolioData } from "@/lib/getPortfolioData";
import { getTeachingData } from "@/lib/getTeachingData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Course } from "@/types/teaching";
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Layers,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Teaching & Course Materials | Kalp Shah | IIT Gandhinagar",
  description:
    "Lecture materials, slides, notes, assignments, and resources for courses taught and mentored at IIT Gandhinagar by Kalp Shah.",
};

function CourseCard({ course }: { course: Course }) {
  const lectureCount = course.lectures?.length || 0;
  const assignmentCount = course.assignments?.length || 0;

  return (
    <div className="details-container color-container text-left h-full flex flex-col justify-between p-6 sm:p-8 hover:border-neutral-500 hover:shadow-lg transition-all duration-300 group">
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-black text-white">
              {course.code}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-neutral-200 text-neutral-800">
              {course.term}
            </span>
          </div>
          {course.status === "active" ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </span>
          ) : (
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-300 capitalize">
              {course.status}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-black group-hover:text-neutral-900 transition-colors leading-snug">
          {course.title}
        </h2>

        {/* Role & Dept */}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-medium text-neutral-600">
          <span className="bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
            Role: {course.role}
          </span>
          {course.department && (
            <span className="text-neutral-400">• {course.department}</span>
          )}
        </div>

        {/* Description */}
        <p className="mt-4 text-sm text-neutral-600 leading-relaxed line-clamp-3">
          {course.description}
        </p>

        {/* Quick Logistics */}
        {(course.timings || course.venue) && (
          <div className="mt-5 pt-4 border-t border-neutral-200/80 space-y-2 text-xs text-neutral-600">
            {course.timings && (
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                <span>{course.timings}</span>
              </div>
            )}
            {course.venue && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                <span>{course.venue}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer & CTA */}
      <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {lectureCount} {lectureCount === 1 ? "Lecture" : "Lectures"}
          </span>
          {assignmentCount > 0 && (
            <span className="inline-flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              {assignmentCount} {assignmentCount === 1 ? "Assignment" : "Assignments"}
            </span>
          )}
        </div>

        <Link
          href={`/iitgn/teaching/${course.slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-black group-hover:translate-x-1 transition-all underline underline-offset-4 decoration-neutral-300 group-hover:decoration-black"
        >
          View Materials
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function TeachingIndexPage() {
  const portfolioData = getPortfolioData();
  const teachingData = getTeachingData();
  const courses = teachingData.courses || [];

  const activeCourses = courses.filter((c) => c.status === "active");
  const pastCourses = courses.filter((c) => c.status !== "active");

  return (
    <main className="min-h-screen flex flex-col bg-white text-black">
      <Navbar personal={portfolioData.personal} links={portfolioData.navLinks} />

      {/* Hero / Header Section */}
      <section className="px-6 sm:px-12 lg:px-24 pt-10 pb-8 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-3">
          <GraduationCap className="w-4 h-4 text-black" />
          <span>IIT Gandhinagar • Academics</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black">
              Teaching & Course Materials
            </h1>
            <p className="mt-3 text-base sm:text-lg text-neutral-600 max-w-2xl leading-relaxed">
              {teachingData.overview}
            </p>
          </div>

          {teachingData.institutionLogo && (
            <div className="flex-shrink-0 hidden md:block">
              <Image
                src={teachingData.institutionLogo}
                alt="IITGN Logo"
                width={80}
                height={80}
                className="w-20 h-20 object-contain opacity-90"
              />
            </div>
          )}
        </div>

        {/* Quick Highlights Info Bar */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-neutral-200 shadow-sm">
              <Layers className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Total Courses</p>
              <p className="text-base font-bold text-black">{courses.length} Courses</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-neutral-200 shadow-sm">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Institution</p>
              <p className="text-base font-bold text-black">IIT Gandhinagar</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-neutral-200 shadow-sm">
              <BookOpen className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Resources</p>
              <p className="text-base font-bold text-black">Lecture Notes & Slides</p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-24 h-px bg-neutral-300 mx-auto my-6" />

      {/* Courses Grid Section */}
      <section className="flex-1 px-6 sm:px-12 lg:px-24 pb-20 max-w-6xl mx-auto w-full">
        {courses.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-neutral-300 rounded-3xl p-8">
            <BookOpen className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-black">No Courses Published Yet</h3>
            <p className="text-sm text-neutral-500 mt-1 max-w-md mx-auto">
              Course lecture slides, handouts, and materials will be uploaded here as the semester progresses.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Active / Current Courses */}
            {activeCourses.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h2 className="text-xl sm:text-2xl font-bold text-black">
                    Current & Active Courses
                  </h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {activeCourses.map((course) => (
                    <CourseCard key={course.id || course.slug} course={course} />
                  ))}
                </div>
              </div>
            )}

            {/* Past / Completed Courses */}
            {pastCourses.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
                  <h2 className="text-xl sm:text-2xl font-bold text-black">
                    Past & Archived Courses
                  </h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {pastCourses.map((course) => (
                    <CourseCard key={course.id || course.slug} course={course} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <Footer
        links={portfolioData.navLinks}
        copyright={portfolioData.footer.copyright}
      />
    </main>
  );
}
