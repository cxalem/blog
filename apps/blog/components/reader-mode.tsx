"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BookOpen, Minimize2 } from "lucide-react";

interface ReaderModeProps {
  children: React.ReactNode;
  title: React.ReactNode;
  date?: string;
}

export function ReaderMode({ children, title, date }: ReaderModeProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div ref={containerRef} className="min-h-0 bg-[var(--color-background)]">
      {isFullscreen ? (
        /* Fullscreen reader mode */
        <>
          {/* Exit fullscreen button - bottom right */}
          <button
            onClick={toggleFullscreen}
            className="fixed bottom-6 right-6 z-20 p-3 rounded-full bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors duration-200 shadow-lg"
            aria-label="Exit fullscreen"
            title="Exit fullscreen"
          >
            <Minimize2 className="h-5 w-5" />
          </button>

          {/* Centered viewport container with title */}
          <div className="h-screen flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl px-6">
              {/* Title - just above the content */}
              <div className="mb-6">
                <h1 className="text-4xl font-medium tracking-tight mb-2">
                  {title}
                </h1>
                {date && (
                  <time className="text-sm text-zinc-400 dark:text-zinc-500 tabular-nums">
                    {new Date(date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                )}
              </div>

              {/* Content area */}
              <div className="relative h-[30vh]">
                {/* Top fade - animated appearance */}
                <div
                  className={`pointer-events-none absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[var(--color-background)] to-transparent z-10 transition-opacity duration-500 ${
                    scrollTop > 5 ? "opacity-100" : "opacity-0"
                  }`}
                />
                {/* Bottom fade */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--color-background)] to-transparent z-10" />

                {/* Scrollable content */}
                <div
                  ref={contentRef}
                  onScroll={handleScroll}
                  className="reader-content h-full overflow-y-auto text-xl leading-relaxed"
                >
                  <div className="pb-[40%]">
                    {/* Content */}
                    <div className="prose prose-lg max-w-none">{children}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Normal article view */
        <article className="animate-fade-in">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-3xl font-medium tracking-tight">{title}</h1>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200 flex-shrink-0"
              aria-label="Enter reader mode"
              title="Reader mode"
            >
              <BookOpen className="h-5 w-5" />
            </button>
          </div>
          {date && (
            <time className="text-sm text-zinc-400 dark:text-zinc-500 block mb-16 tabular-nums">
              {new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          <div className="prose max-w-none">{children}</div>
        </article>
      )}
    </div>
  );
}
