import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCourses, getCourseBySlug } from "@/lib/getTeachingData";
import { getPortfolioData } from "@/lib/getPortfolioData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Code,
  Video,
  ExternalLink,
  Download,
  AlertCircle,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";

interface Props {
  params: { courseSlug: string };
}

export async function generateStaticParams() {
  const courses = getAllCourses();
  return courses
    .filter((c) => c && c.slug)
    .map((c) => ({ courseSlug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const courseSlug = resolvedParams?.courseSlug;
  const course = getCourseBySlug(courseSlug);

  if (!course) {
    return { title: "Course Not Found | IITGN Teaching" };
  }

  return {
    title: `${course.code}: ${course.title} | Teaching | Kalp Shah`,
    description: `Lecture materials, slides, notes and syllabus for ${course.code} (${course.title}) at IIT Gandhinagar.`,
  };
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function CourseDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const courseSlug = resolvedParams?.courseSlug;
  const course = getCourseBySlug(courseSlug);

  if (!course) {
    notFound();
  }

  const portfolioData = getPortfolioData();

  return (
    <main className="min-h-screen flex flex-col bg-white text-black">
      <Navbar personal={portfolioData.personal} links={portfolioData.navLinks} />

      <div className="flex-1 px-6 sm:px-12 lg:px-24 py-10 max-w-6xl mx-auto w-full">
        {/* Back Link & Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
          <Link
            href="/iitgn/teaching"
            className="inline-flex items-center gap-1 hover:text-black transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            All Courses
          </Link>
          <span>/</span>
          <span className="text-black font-semibold">{course.code}</span>
        </div>

        {/* Course Header Banner */}
        <section className="details-container color-container p-6 sm:p-10 rounded-3xl border border-neutral-300">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-sm font-bold px-3 py-1 rounded-full bg-black text-white">
                {course.code}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-neutral-200 text-neutral-800">
                {course.term}
              </span>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-300">
                Role: {course.role}
              </span>
            </div>

            {course.status === "active" ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Current Semester
              </span>
            ) : (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-300 capitalize">
                {course.status}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black tracking-tight leading-tight">
            {course.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-4xl">
            {course.description}
          </p>

          {/* Logistics Meta Grid */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-neutral-200 text-xs sm:text-sm">
            {course.timings && (
              <div className="flex items-start gap-2.5 text-neutral-700">
                <Clock className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-black">Schedule</p>
                  <p className="text-neutral-600">{course.timings}</p>
                </div>
              </div>
            )}

            {course.venue && (
              <div className="flex items-start gap-2.5 text-neutral-700">
                <MapPin className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-black">Location</p>
                  <p className="text-neutral-600">{course.venue}</p>
                </div>
              </div>
            )}

            {course.officeHours && (
              <div className="flex items-start gap-2.5 text-neutral-700">
                <Calendar className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-black">Office Hours</p>
                  <p className="text-neutral-600">{course.officeHours}</p>
                </div>
              </div>
            )}

            {course.department && (
              <div className="flex items-start gap-2.5 text-neutral-700">
                <GraduationCap className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-black">Department</p>
                  <p className="text-neutral-600">{course.department}</p>
                </div>
              </div>
            )}
          </div>

          {/* Instructor & TA list if present */}
          {(course.instructor || (course.teachingAssistants && course.teachingAssistants.length > 0)) && (
            <div className="mt-4 pt-4 border-t border-neutral-200 flex flex-wrap gap-x-8 gap-y-2 text-xs sm:text-sm text-neutral-600">
              {course.instructor && (
                <div>
                  <span className="font-semibold text-black">Instructor: </span>
                  <span>{course.instructor}</span>
                </div>
              )}
              {course.teachingAssistants && course.teachingAssistants.length > 0 && (
                <div>
                  <span className="font-semibold text-black">Mentors / TAs: </span>
                  <span>{course.teachingAssistants.join(", ")}</span>
                </div>
              )}
            </div>
          )}

          {/* Optional Syllabus button */}
          {course.syllabusUrl && (
            <div className="mt-6 pt-4">
              <a
                href={course.syllabusUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Download Syllabus PDF
              </a>
            </div>
          )}
        </section>

        {/* Announcements (if any) */}
        {course.announcements && course.announcements.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Course Announcements
            </h2>
            <div className="space-y-3">
              {course.announcements.map((ann, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-neutral-800"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-amber-950 text-sm">{ann.title}</span>
                    <span className="text-xs text-amber-800/80 font-mono">{formatDate(ann.date)}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Lecture Materials Section */}
        <section className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-black flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-black" />
                Lecture Schedule & Materials
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                Access lecture slides, reading materials, code notebooks, and supplementary handouts.
              </p>
            </div>
          </div>

          {course.lectures.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-neutral-300 rounded-2xl p-6">
              <p className="text-neutral-500 text-sm">No lecture materials uploaded yet for this course.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {course.lectures.map((lec) => (
                <div
                  key={lec.number}
                  className="p-5 sm:p-6 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  {/* Left: Number, Topic, Description */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-neutral-900 text-white">
                        Lecture {lec.number}
                      </span>
                      {lec.date && (
                        <span className="text-xs text-neutral-600 font-medium bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                          {formatDate(lec.date)}
                        </span>
                      )}
                      {lec.time && (
                        <span className="text-xs text-neutral-600 font-medium bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                          {lec.time}
                        </span>
                      )}
                      {lec.duration && (
                        <span className="text-xs text-neutral-500 font-medium">
                          ({lec.duration})
                        </span>
                      )}
                      {lec.instructor && (
                        <span className="text-xs text-neutral-600 font-medium">
                          Instructor: <span className="font-semibold text-neutral-800">{lec.instructor}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-black">{lec.topic}</h3>

                    {lec.description && (
                      <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                        {lec.description}
                      </p>
                    )}

                    {/* Additional inline resources/readings */}
                    {lec.additionalResources && lec.additionalResources.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-neutral-500">Readings:</span>
                        {lec.additionalResources.map((res, rIdx) => (
                          <a
                            key={rIdx}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded border border-neutral-200 transition-colors"
                          >
                            <span>{res.title}</span>
                            <ExternalLink className="w-3 h-3 text-neutral-400" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Resource Download / Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 md:self-center flex-shrink-0">
                    {lec.slidesUrl && (
                      <a
                        href={lec.slidesUrl}
                        target={lec.slidesUrl.startsWith("http") ? "_blank" : undefined}
                        rel={lec.slidesUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-neutral-900 text-white hover:bg-black transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Slides
                      </a>
                    )}

                    {lec.notesUrl && (
                      <a
                        href={lec.notesUrl}
                        target={lec.notesUrl.startsWith("http") ? "_blank" : undefined}
                        rel={lec.notesUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-neutral-100 text-black border border-neutral-300 hover:bg-neutral-200 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-neutral-600" />
                        Notes
                      </a>
                    )}

                    {lec.codeUrl && (
                      <a
                        href={lec.codeUrl}
                        target={lec.codeUrl.startsWith("http") ? "_blank" : undefined}
                        rel={lec.codeUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-neutral-100 text-black border border-neutral-300 hover:bg-neutral-200 transition-colors"
                      >
                        <Code className="w-3.5 h-3.5 text-neutral-600" />
                        Code / Lab
                      </a>
                    )}

                    {lec.recordingUrl && (
                      <a
                        href={lec.recordingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-neutral-100 text-black border border-neutral-300 hover:bg-neutral-200 transition-colors"
                      >
                        <Video className="w-3.5 h-3.5 text-neutral-600" />
                        Recording
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Assignments Section (if any) */}
        {course.assignments && course.assignments.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold text-black flex items-center gap-2 mb-2">
              <FileText className="w-6 h-6 text-black" />
              Assignments & Problem Sets
            </h2>
            <p className="text-sm text-neutral-500 mb-6">
              Problem statements, due dates, starter repositories, and guidelines.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {course.assignments.map((asgn) => (
                <div
                  key={asgn.number}
                  className="p-5 sm:p-6 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black text-white">
                        Assignment #{asgn.number}
                      </span>
                      <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        Due: {formatDate(asgn.dueDate)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-black mt-2">{asgn.title}</h3>
                    {asgn.description && (
                      <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
                        {asgn.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-200 flex flex-wrap items-center gap-2">
                    {asgn.handoutUrl && (
                      <a
                        href={asgn.handoutUrl}
                        target={asgn.handoutUrl.startsWith("http") ? "_blank" : undefined}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        Handout
                      </a>
                    )}
                    {asgn.starterCodeUrl && (
                      <a
                        href={asgn.starterCodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-neutral-300 text-black hover:bg-neutral-100 transition-colors"
                      >
                        <Code className="w-3 h-3" />
                        Starter Code
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* References Section (if any) */}
        {course.references && course.references.length > 0 && (
          <section className="mt-14 mb-10">
            <h2 className="text-2xl font-bold text-black flex items-center gap-2 mb-2">
              <GraduationCap className="w-6 h-6 text-black" />
              Recommended References & Textbooks
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {course.references.map((ref, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-neutral-200 bg-white flex items-start justify-between gap-3"
                >
                  <div>
                    <h3 className="text-sm font-bold text-black">{ref.title}</h3>
                    {ref.author && (
                      <p className="text-xs text-neutral-500 mt-0.5">by {ref.author}</p>
                    )}
                    {ref.description && (
                      <p className="text-xs text-neutral-600 mt-1">{ref.description}</p>
                    )}
                  </div>
                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors"
                      aria-label="Reference link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Navigation */}
        <div className="pt-8 border-t border-neutral-200 mt-12 flex justify-between items-center">
          <Link
            href="/iitgn/teaching"
            className="inline-flex items-center gap-2 text-sm font-semibold text-black hover:underline underline-offset-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Teaching Materials
          </Link>

          <Link
            href="/"
            className="text-xs text-neutral-500 hover:text-black transition-colors"
          >
            Portfolio Home →
          </Link>
        </div>
      </div>

      <Footer
        links={portfolioData.navLinks}
        copyright={portfolioData.footer.copyright}
      />
    </main>
  );
}
