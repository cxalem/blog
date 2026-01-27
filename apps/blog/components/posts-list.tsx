"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { FormattedTitle } from "./formatted-title";

interface Post {
  slug: string;
  title: string;
  date: string;
}

interface PostsListProps {
  posts: Post[];
}

export function PostsList({ posts }: PostsListProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setScrollTop(target.scrollTop);
    setIsAtBottom(
      target.scrollHeight - target.scrollTop - target.clientHeight < 10,
    );
  }, []);

  if (posts.length === 0) {
    return <p className="text-zinc-500">No posts yet.</p>;
  }

  return (
    <div className="relative h-[60vh]">
      {/* Top fade - only show when scrolled */}
      {scrollTop > 10 && (
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[var(--color-background)] to-transparent z-10" />
      )}
      {/* Bottom fade - hide when at bottom */}
      {!isAtBottom && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--color-background)] to-transparent z-10" />
      )}

      <div
        onScroll={handleScroll}
        className="h-full overflow-y-auto posts-list pr-3"
      >
        <ul className="space-y-8">
          {posts.map((post, index) => (
            <li
              key={post.slug}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Link href={`/${post.slug}`} className="group block py-2 -my-2">
                <h2 className="text-lg tracking-tight group-hover:text-zinc-500 transition-colors duration-200">
                  <FormattedTitle title={post.title} />
                </h2>
                {post.date && (
                  <time className="text-sm text-zinc-400 dark:text-zinc-500 tabular-nums">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
