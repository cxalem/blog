"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import Lenis from "lenis";
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    if (posts.length <= 5 || !wrapperRef.current) return;

    const lenis = new Lenis({
      wrapper: wrapperRef.current,
      content: wrapperRef.current.firstElementChild as HTMLElement,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Update scroll state from Lenis
    lenis.on(
      "scroll",
      ({ scroll, limit }: { scroll: number; limit: number }) => {
        setScrollTop(scroll);
        setIsAtBottom(limit - scroll < 10);
      },
    );

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [posts.length]);

  // Fallback scroll handler for when Lenis isn't active
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (lenisRef.current) return; // Lenis handles this
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
    <div className={`relative ${posts.length > 5 ? "max-h-[85vh]" : ""}`}>
      {/* Top fade - animated appearance */}
      {posts.length > 5 && (
        <div
          className={`pointer-events-none absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[var(--color-background)] to-transparent z-10 transition-opacity duration-500 ${
            scrollTop > 5 ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      {/* Bottom fade - animated disappearance */}
      {posts.length > 5 && (
        <div
          className={`pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--color-background)] to-transparent z-10 transition-opacity duration-500 ${
            isAtBottom ? "opacity-0" : "opacity-100"
          }`}
        />
      )}

      <div
        ref={wrapperRef}
        onScroll={handleScroll}
        className={`posts-list pr-3 ${posts.length > 5 ? "max-h-[400px] overflow-y-auto" : ""}`}
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
