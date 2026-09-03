"use client";

import Link from "next/link";
import { ArrowLeft, Download, ExternalLink, FileText } from "lucide-react";

export default function CV() {
  const pdfPath = "/assets/Kalp_CV.pdf";

  return (
    <div className="flex flex-col h-screen w-screen bg-neutral-900 text-white overflow-hidden">
      {/* Header bar */}
      <header className="h-16 bg-neutral-950 border-b border-neutral-800 px-4 sm:px-8 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <div className="h-5 w-px bg-neutral-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-neutral-400" />
            <h1 className="text-base sm:text-lg font-semibold text-neutral-100 truncate">
              Curriculum Vitae
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-800 transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Open in New Tab</span>
          </a>
          <a
            href={pdfPath}
            download="Kalp_Shah_CV.pdf"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-black bg-white hover:bg-neutral-200 px-3 py-1.5 rounded-lg transition-colors font-semibold shadow-sm"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </a>
        </div>
      </header>

      {/* PDF Viewport */}
      <main className="flex-1 w-full h-full bg-neutral-900 relative">
        <object
          data={pdfPath}
          type="application/pdf"
          className="w-full h-full"
        >
          <iframe
            src={pdfPath}
            className="w-full h-full border-0"
            title="Curriculum Vitae PDF"
            suppressHydrationWarning
          />
        </object>
      </main>
    </div>
  );
}
