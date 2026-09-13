export interface LectureResource {
  title: string;
  url: string;
  type?: "slides" | "notes" | "code" | "video" | "handout" | "link";
}

export interface LectureItem {
  number: number;
  date: string;
  topic: string;
  description?: string;
  instructor?: string;
  time?: string;
  duration?: string;
  slidesUrl?: string;
  notesUrl?: string;
  codeUrl?: string;
  recordingUrl?: string;
  additionalResources?: LectureResource[];
}

export interface AssignmentItem {
  number: number;
  title: string;
  releaseDate?: string;
  dueDate: string;
  description?: string;
  handoutUrl?: string;
  starterCodeUrl?: string;
  solutionUrl?: string;
}

export interface ReferenceItem {
  title: string;
  author?: string;
  url?: string;
  description?: string;
  type?: "textbook" | "paper" | "documentation" | "tools";
}

export interface CourseAnnouncement {
  date: string;
  title: string;
  content: string;
}

export interface Course {
  id: string;
  slug: string;
  code: string;
  title: string;
  term: string;
  role: string;
  status: "active" | "completed" | "upcoming";
  description: string;
  department?: string;
  instructor?: string;
  teachingAssistants?: string[];
  timings?: string;
  venue?: string;
  officeHours?: string;
  syllabusUrl?: string;
  announcements?: CourseAnnouncement[];
  lectures: LectureItem[];
  assignments?: AssignmentItem[];
  references?: ReferenceItem[];
}

export interface TeachingData {
  title: string;
  subtitle: string;
  institution: string;
  institutionLogo?: string;
  overview: string;
  officeLocation?: string;
  email?: string;
  courses: Course[];
}
