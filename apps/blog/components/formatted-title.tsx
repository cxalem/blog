"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface FormattedTitleProps {
  title: string;
}

export function FormattedTitle({ title }: FormattedTitleProps) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <>{children}</>,
        strong: ({ children }) => (
          <strong className="font-bold">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        del: ({ children }) => (
          <del className="line-through text-zinc-500 dark:text-zinc-400">
            {children}
          </del>
        ),
      }}
    >
      {title}
    </Markdown>
  );
}
