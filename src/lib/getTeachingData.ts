import fs from "fs";
import path from "path";
import { TeachingData, Course } from "@/types/teaching";

const teachingFilePath = path.join(process.cwd(), "data/teaching.json");

export function getTeachingData(): TeachingData {
  if (!fs.existsSync(teachingFilePath)) {
    return {
      title: "Teaching & Academic Course Materials",
      subtitle: "Indian Institute of Technology Gandhinagar",
      institution: "IIT Gandhinagar",
      overview: "Course materials and lecture notes.",
      courses: [],
    };
  }

  try {
    const fileContents = fs.readFileSync(teachingFilePath, "utf8");
    return JSON.parse(fileContents) as TeachingData;
  } catch (e) {
    console.error("Error reading teaching.json:", e);
    return {
      title: "Teaching & Academic Course Materials",
      subtitle: "Indian Institute of Technology Gandhinagar",
      institution: "IIT Gandhinagar",
      overview: "Course materials and lecture notes.",
      courses: [],
    };
  }
}

export function getAllCourses(): Course[] {
  const data = getTeachingData();
  return data.courses || [];
}

export function getCourseBySlug(slug?: string): Course | null {
  if (!slug) return null;
  const courses = getAllCourses();
  return (
    courses.find(
      (course) =>
        course &&
        typeof course.slug === "string" &&
        course.slug.toLowerCase() === slug.toLowerCase()
    ) || null
  );
}
