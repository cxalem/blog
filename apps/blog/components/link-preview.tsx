"use client";

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
  type MouseEvent,
} from "react";
import { ExternalLink } from "lucide-react";

interface LinkPreviewProps {
  href: string;
  children: ReactNode;
}

// Placeholder data - will be extended later with real metadata
interface LinkMeta {
  title: string;
  description: string;
  icon?: "github" | "solana" | "external";
}

function getLinkMeta(href: string): LinkMeta {
  // Placeholder logic - will be replaced with actual metadata later
  if (href.includes("github.com")) {
    return {
      title: "GitHub",
      description: "View repository on GitHub",
      icon: "github",
    };
  }
  if (href.includes("solana")) {
    return {
      title: "Solana",
      description: "Solana blockchain resource",
      icon: "solana",
    };
  }

  // Extract domain for generic links
  try {
    const url = new URL(href);
    return {
      title: url.hostname.replace("www.", ""),
      description: "External link",
      icon: "external",
    };
  } catch {
    return {
      title: "Link",
      description: "External resource",
      icon: "external",
    };
  }
}

// Placeholder icons - will be replaced with actual logos later
function LinkIcon({ type }: { type: LinkMeta["icon"] }) {
  const iconClass = "h-5 w-5";

  switch (type) {
    case "github":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      );
    case "solana":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.87 5.23a.67.67 0 0 0-.47-.2H4.15a.33.33 0 0 0-.24.57l3.47 3.4a.67.67 0 0 0 .47.2h13.25a.33.33 0 0 0 .24-.57l-3.47-3.4zM4.15 14.8h13.25a.67.67 0 0 0 .47-.2l3.47-3.4a.33.33 0 0 0-.24-.57H7.85a.67.67 0 0 0-.47.2l-3.47 3.4a.33.33 0 0 0 .24.57zm17.19 3.97l-3.47-3.4a.67.67 0 0 0-.47-.2H4.15a.33.33 0 0 0-.24.57l3.47 3.4a.67.67 0 0 0 .47.2h13.25a.33.33 0 0 0 .24-.57z" />
        </svg>
      );
    default:
      return <ExternalLink className={iconClass} />;
  }
}

export function LinkPreview({ href, children }: LinkPreviewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });

  const linkRef = useRef<HTMLAnchorElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const meta = getLinkMeta(href);

  // Smooth animation using lerp (linear interpolation)
  useEffect(() => {
    if (!isVisible) return;

    const animate = () => {
      setPosition((prev) => {
        const dx = targetPosition.x - prev.x;
        const dy = targetPosition.y - prev.y;

        // Lerp factor - controls smoothness (0.15 = smooth, 1 = instant)
        const lerp = 0.15;

        // Stop animating if close enough
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
          return targetPosition;
        }

        return {
          x: prev.x + dx * lerp,
          y: prev.y + dy * lerp,
        };
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVisible, targetPosition]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Position card above cursor, offset to the right
    setTargetPosition({
      x: e.clientX + 12,
      y: e.clientY - 80,
    });
  }, []);

  const handleMouseEnter = useCallback((e: MouseEvent) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    // Set initial position immediately (no animation for first show)
    const initialPos = {
      x: e.clientX + 12,
      y: e.clientY - 80,
    };
    setPosition(initialPos);
    setTargetPosition(initialPos);
    setIsVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Small delay before hiding to allow moving to the card
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150);
  }, []);

  const handleCardMouseEnter = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <>
      <a
        ref={linkRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className="link-preview-trigger"
      >
        {children}
      </a>

      {isVisible && (
        <div
          ref={cardRef}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
          onClick={() => window.open(href, "_blank", "noopener,noreferrer")}
          className="link-preview-card fixed z-50 pointer-events-auto cursor-pointer"
          style={{
            left: position.x,
            top: position.y,
            transform: "translateY(0)",
          }}
        >
          {/* Card with inverted theme: dark bg in light mode, light bg in dark mode */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 min-w-[200px] max-w-[280px]">
            <div className="flex-shrink-0 opacity-80">
              <LinkIcon type={meta.icon} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{meta.title}</div>
              <div className="text-xs opacity-70 truncate">
                {meta.description}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
