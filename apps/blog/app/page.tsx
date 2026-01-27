import { getAllPosts } from "@/lib/posts";
import { ThemeToggle } from "@/components/theme-toggle";
import { PostsList } from "@/components/posts-list";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen">
      <main className="max-w-2xl mx-auto px-6 py-20">
        <header className="flex items-center justify-between mb-20">
          <h1 className="text-2xl font-medium tracking-tight">
            @cxalem thoughts
          </h1>
          <ThemeToggle />
        </header>

        <PostsList posts={posts} />
      </main>
    </div>
  );
}
