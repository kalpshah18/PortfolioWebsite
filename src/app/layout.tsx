import type { Metadata } from "next";
import "./globals.css";
import { getPortfolioData } from "@/lib/getPortfolioData";

export async function generateMetadata(): Promise<Metadata> {
  const data = getPortfolioData();
  return {
    title: data.meta.title,
    description: data.meta.description,
    icons: {
      icon: data.meta.favicon || "/assets/favicon.png",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-['Poppins',sans-serif] bg-white text-black selection:bg-neutral-200">
        {children}
      </body>
    </html>
  );
}
