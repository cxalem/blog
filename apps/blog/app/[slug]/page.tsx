import { cache } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { ThemeToggle } from "@/components/theme-toggle";
import { FormattedTitle } from "@/components/formatted-title";
import { ReaderMode } from "@/components/reader-mode";
import { ArrowLeft } from "lucide-react";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

// Cache post fetch to deduplicate between generateMetadata and page render
const getCachedPost = cache((slug: string) => getPostBySlug(slug));

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Strip markdown for meta tags
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/~~(.+?)~~/g, "$1")
    .replace(/`(.+?)`/g, "$1");
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getCachedPost(slug);

  if (!post) {
    return { title: "Not Found" };
  }

  const cleanTitle = stripMarkdown(post.title);

  const description = post.content.slice(0, 160).replace(/\n/g, " ").trim();

  return {
    title: `${cleanTitle} | @cxalem thoughts`,
    description,
    openGraph: {
      title: cleanTitle,
      description,
      type: "article",
      publishedTime: post.date,
      authors: ["@cxalem"],
      siteName: "@cxalem thoughts",
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description,
      creator: "@cxalem",
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getCachedPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-2xl mx-auto px-6 py-20">
        <header className="flex items-center justify-between mb-16">
          <Link
            href="/"
            className="group flex items-center gap-2 text-zinc-600 dark:text-zinc-100 hover:text-zinc-900 dark:hover:text-zinc-400 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back
          </Link>
          <ThemeToggle />
        </header>

        <ReaderMode
          title={<FormattedTitle title={post.title} />}
          date={post.date}
        >
          <MDXRemote source={post.content} />
        </ReaderMode>
      </main>
    </div>
  );
}
