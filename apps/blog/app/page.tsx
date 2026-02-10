import { getAllPosts } from "@/lib/posts";
import { ThemeToggle } from "@/components/theme-toggle";
import { PostsList } from "@/components/posts-list";
import { HoverLink } from "@/components/hover-link";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen">
      <main className="max-w-2xl mx-auto px-6 py-10">
        <header className="flex items-center justify-between mb-20">
          <h1 className="text-2xl font-medium tracking-tight">
            @cxalem thoughts
          </h1>
          <ThemeToggle />
        </header>

        <PostsList posts={posts} />

        {/* me section */}
        <section
          className="mt-20 mb-16 animate-fade-in opacity-0"
          style={{ animationDelay: "100ms" }}
        >
          <h2 className="text-base font-medium text-zinc-400 dark:text-zinc-500 mb-4 lowercase">
            me
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-2 text-zinc-700 dark:text-zinc-300">
            <li>
              design engineer and solana developer, focused on building
              polished, high-performance interfaces and developer tools
            </li>
            <li>deep focus in ux and visual craft</li>
            <li>
              core contributor to solana foundation open-source projects,
              second-highest contributor to{" "}
              <HoverLink
                href="https://github.com/solana-foundation/templates"
                className="underline underline-offset-3 decoration-1 hover:text-zinc-500 transition-colors duration-200"
              >
                solana-foundation/templates
              </HoverLink>
            </li>
            <li>
              published sdk author, former devrel engineer at consensys
            </li>
            <li>
              building with next.js, react native, rust, typescript, anchor,
              and @solana/kit
            </li>
          </ul>
        </section>

        {/* current section */}
        <section
          className="mb-20 animate-fade-in opacity-0"
          style={{ animationDelay: "200ms" }}
        >
          <h2 className="text-base font-medium text-zinc-400 dark:text-zinc-500 mb-4 lowercase">
            current
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-2 text-zinc-700 dark:text-zinc-300">
            <li>
              software engineer (contract) at the solana foundation — building
              templates and maintaining the official{" "}
              <HoverLink
                href="https://github.com/solana-foundation/templates"
                className="underline underline-offset-3 decoration-1 hover:text-zinc-500 transition-colors duration-200"
              >
                templates
              </HoverLink>{" "}
              repo powering create-solana-dapp
            </li>
            <li>
              member of{" "}
              <HoverLink
                href="https://x.com/LaFamilia_so"
                className="underline underline-offset-3 decoration-1 hover:text-zinc-500 transition-colors duration-200"
              >
                la familia
              </HoverLink>
            </li>
            <li>
              building{" "}
              <HoverLink
                href="https://itx-indexer.com/"
                className="underline underline-offset-3 decoration-1 hover:text-zinc-500 transition-colors duration-200"
              >
                tx-indexer sdk
              </HoverLink>{" "}
              — classified solana transactions with protocol detection and spam
              filtering, being integrated into the foundation's framework-kit
            </li>
            <li>
              building{" "}
              <HoverLink
                href="https://dashboard.itx-indexer.com/"
                className="underline underline-offset-3 decoration-1 hover:text-zinc-500 transition-colors duration-200"
              >
                itx-dashboard
              </HoverLink>{" "}
              to showcase the power of the tx-indexer sdk and to create the best
              experience in solana
            </li>
            <li>
              collaborating with{" "}
              <HoverLink
                href="https://x.com/kronos_guild"
                className="underline underline-offset-3 decoration-1 hover:text-zinc-500 transition-colors duration-200"
              >
                kronos guild
              </HoverLink>
              ,{" "}
              <HoverLink
                href="https://x.com/SolanaStudentAf"
                className="underline underline-offset-3 decoration-1 hover:text-zinc-500 transition-colors duration-200"
              >
                ssa
              </HoverLink>
              , and open to collaborating with anyone building or educating
              about solana
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
