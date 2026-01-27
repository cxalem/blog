import Link from "next/link";
import { getAllPosts } from "@/lib/actions";
import { ThemeToggle } from "@/components/theme-toggle";
import { Plus, FileText } from "lucide-react";

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen">
      <main className="max-w-2xl mx-auto px-6 py-20">
        <header className="flex items-center justify-between mb-20">
          <h1 className="text-2xl font-medium tracking-tight">Writer</h1>
          <div className="flex items-center gap-2">
            <Link
              href="/new"
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              New post
            </Link>
            <ThemeToggle />
          </div>
        </header>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="h-12 w-12 mx-auto text-zinc-300 dark:text-zinc-600 mb-4" />
            <p className="text-zinc-400 mb-4">No posts yet.</p>
            <Link
              href="/new"
              className="text-zinc-600 dark:text-zinc-400 underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-600 hover:decoration-zinc-500 transition-colors duration-200"
            >
              Create your first post
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/edit/${post.slug}`}
                  className="group flex items-center justify-between p-4 -mx-4 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg tracking-tight">{post.title}</h2>
                        {post.draft && (
                          <span className="px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded">
                            Draft
                          </span>
                        )}
                      </div>
                      {post.date && (
                        <time className="text-sm text-zinc-400 dark:text-zinc-500 tabular-nums">
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-zinc-400 dark:text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Edit
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
