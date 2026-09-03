import type { Metadata } from "next";
import CV from "@/components/CV";

export const metadata: Metadata = {
  title: "CV | Kalp Shah",
  description: "Curriculum Vitae of Kalp Shah",
};

export default function CVPage() {
  return <CV />;
}
