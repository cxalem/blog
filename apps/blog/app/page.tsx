import { getAllPosts } from "@/lib/posts";
import { ThemeToggle } from "@/components/theme-toggle";
import { PostsList } from "@/components/posts-list";
import Link from "next/link";

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

        {/* me section */}
        <section className="mt-20 mb-16 animate-fade-in opacity-0" style={{ animationDelay: "100ms" }}>
          <h2 className="text-sm font-medium text-zinc-400 dark:text-zinc-500 mb-4 lowercase">
            me
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-2 text-zinc-700 dark:text-zinc-300">
            <li>design engineer with 5+ years of experience building mobile and web apps</li>
            <li>deep focus in ux</li>
            <li>
              have interests in blockchain, specifically in solana, i've been collaborating to repos like{" "}
              <Link
                href="https://github.com/solana-foundation/templates"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-3 decoration-1 hover:text-zinc-500 transition-colors duration-200"
              >
                solana-foundation/templates
              </Link>
            </li>
            <li>i've been building with next.js, react native, node, rust, and typescript</li>
          </ul>
        </section>

        {/* current section */}
        <section className="mb-20 animate-fade-in opacity-0" style={{ animationDelay: "200ms" }}>
          <h2 className="text-sm font-medium text-zinc-400 dark:text-zinc-500 mb-4 lowercase">
            current
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-2 text-zinc-700 dark:text-zinc-300">
            <li>building templates and maintainer of the solana foundation templates repo</li>
            <li>
              member of{" "}
              <Link
                href="https://x.com/LaFamilia_so"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-3 decoration-1 hover:text-zinc-500 transition-colors duration-200"
              >
                la familia
              </Link>
            </li>
            <li>building tx-indexer sdk to get classified transactions</li>
            <li>
              building{" "}
              <Link
                href="https://dashboard.itx-indexer.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-3 decoration-1 hover:text-zinc-500 transition-colors duration-200"
              >
                itx-dashboard
              </Link>{" "}
              to showcase the power of the tx-indexer sdk and to create the best experience in solana
            </li>
            <li>
              collaborating with{" "}
              <Link
                href="https://x.com/kronos_guild"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-3 decoration-1 hover:text-zinc-500 transition-colors duration-200"
              >
                kronos guild
              </Link>
              ,{" "}
              <Link
                href="https://x.com/SolanaStudentAf"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-3 decoration-1 hover:text-zinc-500 transition-colors duration-200"
              >
                ssa
              </Link>
              , and open to collaborating with anyone building or educating about solana
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
