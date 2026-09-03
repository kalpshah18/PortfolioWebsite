import type { Metadata } from "next";
import Transcript from "@/components/Transcript";

export const metadata: Metadata = {
  title: "Transcript | Kalp Shah",
  description: "Academic Transcript of Kalp Shah",
};

export default function TranscriptPage() {
  return <Transcript />;
}
