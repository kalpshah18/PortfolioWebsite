import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/getBlogPosts";
import { getPortfolioData } from "@/lib/getPortfolioData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlogPostMeta } from "@/types/portfolio";

export const metadata: Metadata = {
  title: "Blog | Kalp Shah",
  description:
    "Thoughts on algorithms, low-latency systems, quantitative ideas, and more.",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function BlogCard({ post }: { post: BlogPostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block no-underline text-inherit"
    >
      <article className="details-container color-container text-left h-full flex flex-col gap-3 group-hover:border-neutral-400 transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
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
        <h2 className="text-xl font-semibold text-black leading-snug group-hover:underline group-hover:underline-offset-4 decoration-neutral-400">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-sm leading-relaxed flex-1">{post.excerpt}</p>

        {/* Footer row */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-neutral-200">
          <time className="text-xs text-neutral-500">{formatDate(post.date)}</time>
          <span className="text-xs font-medium text-black group-hover:underline underline-offset-2">
            Read more →
          </span>
        </div>
      </article>
    </Link>
  );
}

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const data = getPortfolioData();

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar personal={data.personal} links={data.navLinks} />

      {/* Hero */}
      <section className="px-6 sm:px-12 lg:px-24 pt-12 pb-10 text-center">
        <p className="text-sm font-medium text-neutral-500 uppercase tracking-widest mb-2">
          Writing
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold text-black">Blog</h1>
        <p className="mt-4 text-base text-neutral-500 max-w-lg mx-auto leading-relaxed">
          Thoughts on algorithms, low-latency systems, quantitative ideas, and
          whatever I'm currently building or reading.
        </p>
      </section>

      {/* Divider */}
      <div className="w-24 h-px bg-neutral-300 mx-auto mb-12" />

      {/* Article Grid */}
      <section className="flex-1 px-6 sm:px-12 lg:px-24 pb-20">
        {posts.length === 0 ? (
          <p className="text-center text-neutral-400 text-lg mt-20">
            No articles yet — check back soon.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 max-w-6xl mx-auto">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>

      <Footer links={data.navLinks} copyright={data.footer.copyright} />
    </main>
  );
}
