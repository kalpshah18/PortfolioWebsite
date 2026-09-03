import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/getBlogPosts";
import { getPortfolioData } from "@/lib/getPortfolioData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found | Kalp Shah" };
  return {
    title: `${post.title} | Kalp Shah`,
    description: post.excerpt,
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const data = getPortfolioData();

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar personal={data.personal} links={data.navLinks} />

      <article className="flex-1 px-6 sm:px-12 lg:px-24 pb-24 max-w-3xl mx-auto w-full">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-black transition-colors mt-10 mb-10 no-underline"
        >
          ← Back to Blog
        </Link>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-neutral-200 text-neutral-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-semibold text-black leading-tight mb-4">
          {post.title}
        </h1>

        {/* Date */}
        <time className="block text-sm text-neutral-500 mb-10">
          {formatDate(post.date)}
        </time>

        {/* Divider */}
        <div className="w-16 h-px bg-neutral-300 mb-10" />

        {/* Article body */}
        <div
          className="prose-blog"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>

      <Footer links={data.navLinks} copyright={data.footer.copyright} />
    </main>
  );
}
