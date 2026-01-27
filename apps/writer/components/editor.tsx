"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { savePost, deletePost } from "@/lib/actions";

// Lazy load syntax highlighter (heavy dependency ~200KB)
const SyntaxHighlighter = dynamic(
  () => import("react-syntax-highlighter").then((mod) => mod.Prism),
  { ssr: false },
);
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Maximize2,
  Minimize2,
  Save,
  Check,
  Bold,
  Italic,
  Strikethrough,
  List,
  Eye,
  Pencil,
  Trash2,
  SpellCheck,
  X,
  Loader2,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useGrammar } from "@/hooks/use-grammar";

interface EditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialDraft?: boolean;
  slug?: string;
}

// Hoisted static JSX elements (Rule 6.3)
const scrollFadeTop = (
  <div className="pointer-events-none absolute top-0 right-0 w-2 h-24 bg-gradient-to-b from-[var(--color-background)] to-transparent" />
);
const scrollFadeBottom = (
  <div className="pointer-events-none absolute bottom-0 right-0 w-2 h-24 bg-gradient-to-t from-[var(--color-background)] to-transparent" />
);

// Hoisted markdown component configurations to avoid re-creating on each render
const markdownTitleComponents = {
  p: ({ children }: { children?: React.ReactNode }) => <span>{children}</span>,
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-bold">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic">{children}</em>
  ),
  del: ({ children }: { children?: React.ReactNode }) => (
    <del className="line-through text-zinc-500">{children}</del>
  ),
};

export function Editor({
  initialTitle = "",
  initialContent = "",
  initialDraft = true,
  slug,
}: EditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isDraft, setIsDraft] = useState(initialDraft);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showGrammar, setShowGrammar] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const {
    matches: grammarMatches,
    isChecking: isCheckingGrammar,
    detectedLanguage,
    check: checkGrammar,
    clearMatches: clearGrammarMatches,
  } = useGrammar({ debounceMs: 1500 });

  const handleSave = useCallback(
    async (asDraft?: boolean) => {
      if (!title.trim()) return;

      const draftStatus = asDraft ?? isDraft;
      setSaving(true);
      const result = await savePost({
        title,
        content,
        draft: draftStatus,
        existingSlug: slug,
      });
      setSaving(false);

      if (result.success) {
        setIsDraft(draftStatus);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    },
    [title, content, isDraft, slug],
  );

  const handleDelete = useCallback(async () => {
    if (!slug) return;

    setDeleting(true);
    const result = await deletePost(slug);
    setDeleting(false);

    if (result.success) {
      router.push("/");
    }
  }, [slug, router]);

  // Toggle formatting - adds if not present, removes if present
  const toggleFormat = useCallback(
    (before: string, after: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);

      // Check if selection is already wrapped with the formatting
      const beforeStart = start - before.length;
      const afterEnd = end + after.length;
      const textBefore = content.substring(Math.max(0, beforeStart), start);
      const textAfter = content.substring(
        end,
        Math.min(content.length, afterEnd),
      );

      let newContent: string;
      let newStart: number;
      let newEnd: number;

      if (textBefore === before && textAfter === after) {
        // Remove formatting
        newContent =
          content.substring(0, beforeStart) +
          selectedText +
          content.substring(afterEnd);
        newStart = beforeStart;
        newEnd = beforeStart + selectedText.length;
      } else {
        // Add formatting
        newContent =
          content.substring(0, start) +
          before +
          selectedText +
          after +
          content.substring(end);
        newStart = start + before.length;
        newEnd = end + before.length;
      }

      setContent(newContent);

      // Restore focus and selection
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newStart, newEnd);
      }, 0);
    },
    [content],
  );

  const toggleListItem = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const beforeCursor = content.substring(0, start);

    // Find the start of the current line
    const lastNewline = beforeCursor.lastIndexOf("\n");
    const lineStart = lastNewline + 1;

    // Check if line already starts with "- "
    const linePrefix = content.substring(lineStart, lineStart + 2);

    let newContent: string;
    let newCursorPos: number;

    if (linePrefix === "- ") {
      // Remove "- " from the beginning of the line
      newContent =
        content.substring(0, lineStart) + content.substring(lineStart + 2);
      newCursorPos = Math.max(lineStart, start - 2);
    } else {
      // Add "- " at the beginning of the line
      newContent =
        content.substring(0, lineStart) + "- " + content.substring(lineStart);
      newCursorPos = start + 2;
    }

    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [content]);

  const formatBold = useCallback(
    () => toggleFormat("**", "**"),
    [toggleFormat],
  );
  const formatItalic = useCallback(
    () => toggleFormat("*", "*"),
    [toggleFormat],
  );
  const formatStrikethrough = useCallback(
    () => toggleFormat("~~", "~~"),
    [toggleFormat],
  );

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

  // Check grammar when content changes and panel is open
  useEffect(() => {
    if (showGrammar && content) {
      checkGrammar(content);
    } else if (!showGrammar) {
      clearGrammarMatches();
    }
  }, [content, showGrammar, checkGrammar, clearGrammarMatches]);

  // Typewriter mode: keep cursor at bottom (which appears in center due to padding)
  useEffect(() => {
    if (!isFullscreen || !textareaRef.current || isPreview) return;

    const textarea = textareaRef.current;

    // Scroll to bottom after content changes
    requestAnimationFrame(() => {
      const maxScroll = textarea.scrollHeight - textarea.clientHeight;
      textarea.scrollTop = maxScroll;
      setScrollTop(maxScroll);
    });
  }, [isFullscreen, isPreview, content]);

  // Track scroll position for fade effect
  const handleScroll = useCallback((e: React.UIEvent<HTMLTextAreaElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Store handlers in refs for stable keyboard effect (Rule 8.1)
  const handleSaveRef = useRef(handleSave);
  const formatBoldRef = useRef(formatBold);
  const formatItalicRef = useRef(formatItalic);
  const isPreviewRef = useRef(isPreview);
  const setIsPreviewRef = useRef(setIsPreview);

  useEffect(() => {
    handleSaveRef.current = handleSave;
  }, [handleSave]);

  useEffect(() => {
    formatBoldRef.current = formatBold;
  }, [formatBold]);

  useEffect(() => {
    formatItalicRef.current = formatItalic;
  }, [formatItalic]);

  useEffect(() => {
    isPreviewRef.current = isPreview;
  }, [isPreview]);

  // Keyboard shortcuts - stable subscription, never re-subscribes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            handleSaveRef.current();
            break;
          case "b":
            e.preventDefault();
            formatBoldRef.current();
            break;
          case "i":
            e.preventDefault();
            formatItalicRef.current();
            break;
          case "p":
            e.preventDefault();
            setIsPreviewRef.current(!isPreviewRef.current);
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const formatButtonClass =
    "p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors duration-200";

  const toggleButtonClass = (active: boolean) =>
    `p-2 rounded-md transition-colors duration-200 ${
      active
        ? "bg-zinc-200 dark:bg-zinc-600"
        : "hover:bg-zinc-100 dark:hover:bg-zinc-700"
    }`;

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[var(--color-background)]"
    >
      {/* Toolbar - minimal in fullscreen */}
      <div
        className={`transition-opacity duration-300 ${
          isFullscreen
            ? "opacity-0 hover:opacity-100 fixed top-0 left-0 right-0 z-10 bg-gradient-to-b from-[var(--color-background)] to-transparent pt-4 pb-8"
            : "opacity-100"
        }`}
      >
        <div className="max-w-2xl mx-auto py-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Draft/Publish toggle */}
            <div className="flex items-center rounded-md bg-zinc-100 dark:bg-zinc-700 p-0.5 mr-2">
              <button
                onClick={() => setIsDraft(true)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors duration-200 ${
                  isDraft
                    ? "bg-white dark:bg-zinc-600 text-zinc-900 dark:text-zinc-100 shadow-sm"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                Draft
              </button>
              <button
                onClick={() => setIsDraft(false)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors duration-200 ${
                  !isDraft
                    ? "bg-white dark:bg-zinc-600 text-zinc-900 dark:text-zinc-100 shadow-sm"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                Published
              </button>
            </div>

            <button
              onClick={() => handleSave()}
              disabled={saving || !title.trim()}
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {saved ? (
                <Check className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Saving..." : saved ? "Saved" : "Save"}
            </button>

            {/* Delete button - only shown when editing existing post */}
            {slug && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-200"
                aria-label="Delete post"
                title="Delete post"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}

            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 mx-2" />

            {/* Formatting controls - animated visibility */}
            <div
              className={`flex items-center gap-1 overflow-hidden transition-all duration-300 ease-out ${
                isPreview ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"
              }`}
            >
              <button
                onClick={formatBold}
                className={formatButtonClass}
                aria-label="Bold"
                title="Bold (⌘B)"
                tabIndex={isPreview ? -1 : 0}
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                onClick={formatItalic}
                className={formatButtonClass}
                aria-label="Italic"
                title="Italic (⌘I)"
                tabIndex={isPreview ? -1 : 0}
              >
                <Italic className="h-4 w-4" />
              </button>
              <button
                onClick={formatStrikethrough}
                className={formatButtonClass}
                aria-label="Strikethrough"
                title="Strikethrough"
                tabIndex={isPreview ? -1 : 0}
              >
                <Strikethrough className="h-4 w-4" />
              </button>
              <button
                onClick={toggleListItem}
                className={formatButtonClass}
                aria-label="Bullet list"
                title="Bullet list"
                tabIndex={isPreview ? -1 : 0}
              >
                <List className="h-4 w-4" />
              </button>

              <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 ml-2" />
            </div>

            {/* Edit/Preview toggle */}
            <button
              onClick={() => setIsPreview(false)}
              className={toggleButtonClass(!isPreview)}
              aria-label="Edit"
              title="Edit (⌘P)"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsPreview(true)}
              className={toggleButtonClass(isPreview)}
              aria-label="Preview"
              title="Preview (⌘P)"
            >
              <Eye className="h-4 w-4" />
            </button>

            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 mx-2" />

            {/* Grammar check toggle */}
            <button
              onClick={() => setShowGrammar(!showGrammar)}
              className={`relative ${toggleButtonClass(showGrammar)}`}
              aria-label="Grammar check"
              title="Grammar check"
            >
              <SpellCheck className="h-4 w-4" />
              {grammarMatches.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] font-medium bg-amber-500 text-white rounded-full flex items-center justify-center">
                  {grammarMatches.length > 9 ? "9+" : grammarMatches.length}
                </span>
              )}
              {isCheckingGrammar && (
                <span className="absolute -top-1 -right-1">
                  <Loader2 className="h-3 w-3 animate-spin text-zinc-400" />
                </span>
              )}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors duration-200"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Editor area */}
      <div
        className={`max-w-2xl mx-auto ${
          isFullscreen ? "h-screen flex flex-col justify-center" : "pb-16"
        }`}
      >
        {/* Title */}
        {isPreview ? (
          <div
            className={`font-medium mb-8 ${
              isFullscreen ? "text-4xl" : "text-3xl"
            }`}
          >
            {title ? (
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={markdownTitleComponents}
              >
                {title}
              </Markdown>
            ) : (
              <span className="text-zinc-400 dark:text-zinc-500">Untitled</span>
            )}
          </div>
        ) : (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className={`w-full bg-transparent border-none outline-none font-medium placeholder:text-zinc-400 dark:placeholder:text-zinc-500 mb-8 ${
              isFullscreen ? "text-4xl" : "text-3xl"
            }`}
          />
        )}

        {/* Content area */}
        <div
          ref={editorContainerRef}
          className={`relative ${isFullscreen ? "h-[30vh]" : "h-[70vh]"}`}
        >
          {/* Top fade - only show when scrolled */}
          {isFullscreen && scrollTop > 20 && (
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[var(--color-background)] to-transparent z-10" />
          )}
          {/* Bottom fade - always show in fullscreen */}
          {isFullscreen && !isPreview && (
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--color-background)] to-transparent z-10" />
          )}

          {isPreview ? (
            /* Preview mode - rendered markdown */
            <div
              className={`prose-preview h-full overflow-y-auto pr-2 ${
                isFullscreen ? "text-xl" : "text-base"
              }`}
            >
              {content ? (
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => (
                      <p className="mb-4 leading-relaxed">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic">{children}</em>
                    ),
                    del: ({ children }) => (
                      <del className="line-through text-zinc-500">
                        {children}
                      </del>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-6 mb-4 space-y-1">
                        {children}
                      </ul>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed">{children}</li>
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-medium mb-4 mt-8">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-medium mb-3 mt-6">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-medium mb-2 mt-4">
                        {children}
                      </h3>
                    ),
                    code: ({ className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      const codeString = String(children).replace(/\n$/, "");
                      return match ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-md !my-4 text-sm"
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          className="bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-sm font-mono"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-zinc-300 dark:border-zinc-600 pl-4 italic text-zinc-600 dark:text-zinc-400 my-4">
                        {children}
                      </blockquote>
                    ),
                    pre: ({ children }) => <>{children}</>,
                  }}
                >
                  {content}
                </Markdown>
              ) : (
                <p className="text-zinc-400 dark:text-zinc-500">
                  Nothing to preview yet...
                </p>
              )}
            </div>
          ) : (
            /* Edit mode - textarea */
            <>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onScroll={handleScroll}
                placeholder="Start writing..."
                className={`editor-textarea w-full h-full bg-transparent border-none outline-none resize-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 leading-relaxed ${
                  isFullscreen ? "text-xl typewriter-mode" : "text-base"
                }`}
              />
              {/* Scrollbar fade overlays - only in non-fullscreen */}
              {!isFullscreen && scrollFadeTop}
              {!isFullscreen && scrollFadeBottom}
            </>
          )}
        </div>
      </div>

      {/* Grammar panel */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-zinc-50 dark:bg-zinc-800 border-l border-zinc-200 dark:border-zinc-700 transform transition-transform duration-300 ease-out z-40 ${
          showGrammar ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
          <div>
            <h3 className="font-medium">Grammar Check</h3>
            {detectedLanguage && (
              <p className="text-xs text-zinc-500">{detectedLanguage}</p>
            )}
          </div>
          <button
            onClick={() => setShowGrammar(false)}
            className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-60px)] p-4">
          {isCheckingGrammar && grammarMatches.length === 0 && (
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking...
            </div>
          )}

          {!isCheckingGrammar && grammarMatches.length === 0 && content && (
            <p className="text-sm text-zinc-500">No issues found.</p>
          )}

          {!content && (
            <p className="text-sm text-zinc-500">
              Start writing to check grammar.
            </p>
          )}

          {grammarMatches.length > 0 && (
            <ul className="space-y-3">
              {grammarMatches.map((match, index) => (
                <li
                  key={`${match.offset}-${index}`}
                  className="p-3 bg-white dark:bg-zinc-700/50 rounded-lg border border-zinc-200 dark:border-zinc-600"
                >
                  <p className="text-sm mb-2">{match.message}</p>
                  <p className="text-xs text-zinc-500 mb-2">{match.category}</p>
                  {match.replacements.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {match.replacements.map((replacement, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            // Apply the replacement
                            const before = content.substring(0, match.offset);
                            const after = content.substring(
                              match.offset + match.length,
                            );
                            setContent(before + replacement + after);
                          }}
                          className="px-2 py-0.5 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                        >
                          {replacement}
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-medium mb-2">Delete post?</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              This action cannot be undone. The post will be permanently
              deleted.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  handleDelete();
                }}
                disabled={deleting}
                className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors duration-200"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
