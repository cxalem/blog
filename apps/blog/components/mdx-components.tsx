import type { ReactNode, AnchorHTMLAttributes } from "react";
import { LinkPreview } from "./link-preview";

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children?: ReactNode;
};

// Custom MDX components for the blog
// External links get the preview card, internal links stay normal
export const mdxComponents = {
  a: ({ href, children, ...props }: AnchorProps) => {
    // Skip preview for internal links or anchor links
    if (!href || href.startsWith("/") || href.startsWith("#")) {
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    }

    // External links get the preview card
    return <LinkPreview href={href}>{children}</LinkPreview>;
  },
};
