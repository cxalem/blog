"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  type MouseEvent,
} from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useInteractions,
  FloatingPortal,
} from "@floating-ui/react";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

interface HoverLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

interface LinkMeta {
  title: string;
  description: string;
  icon?: "github" | "solana" | "x" | "external";
  image?: string;
}

// Known links metadata - more specific patterns first
const LINK_METADATA: Record<string, LinkMeta> = {
  "github.com/solana-foundation/templates": {
    title: "Solana Templates",
    description: "Official Solana Foundation templates repository",
    icon: "solana",
  },
  "x.com/LaFamilia_so": {
    title: "La Familia",
    description: "Solana community collective",
    image: "/la-familia.png",
  },
  "dashboard.itx-indexer.com": {
    title: "ITX Dashboard",
    description: "Showcase of TX Indexer SDK capabilities",
    image: "/itx.svg",
  },
  "itx-indexer.com": {
    title: "TX Indexer SDK",
    description: "SDK for classified Solana transactions",
    image: "/itx.svg",
  },
  "x.com/kronos_guild": {
    title: "Kronos Guild",
    description: "Solana development guild",
    icon: "x",
  },
  "x.com/SolanaStudentAf": {
    title: "SSA",
    description: "Solana Student Africa",
    icon: "x",
  },
};

function getLinkMeta(href: string): LinkMeta {
  for (const [pattern, meta] of Object.entries(LINK_METADATA)) {
    if (href.includes(pattern)) {
      return meta;
    }
  }

  try {
    const url = new URL(href);
    const hostname = url.hostname.replace("www.", "");

    if (hostname.includes("github.com")) {
      return { title: "GitHub", description: "View on GitHub", icon: "github" };
    }
    if (hostname.includes("x.com") || hostname.includes("twitter.com")) {
      return { title: "X (Twitter)", description: "View on X", icon: "x" };
    }

    return {
      title: hostname,
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
        <svg
          className={iconClass}
          viewBox="0 0 397.7 311.7"
          fill="currentColor"
        >
          <linearGradient
            id="solana-gradient-a"
            gradientUnits="userSpaceOnUse"
            x1="360.879"
            y1="351.455"
            x2="141.213"
            y2="-69.294"
            gradientTransform="matrix(1 0 0 -1 0 314)"
          >
            <stop offset="0" stopColor="#00FFA3" />
            <stop offset="1" stopColor="#DC1FFF" />
          </linearGradient>
          <linearGradient
            id="solana-gradient-b"
            gradientUnits="userSpaceOnUse"
            x1="264.829"
            y1="401.601"
            x2="45.163"
            y2="-19.148"
            gradientTransform="matrix(1 0 0 -1 0 314)"
          >
            <stop offset="0" stopColor="#00FFA3" />
            <stop offset="1" stopColor="#DC1FFF" />
          </linearGradient>
          <linearGradient
            id="solana-gradient-c"
            gradientUnits="userSpaceOnUse"
            x1="312.548"
            y1="376.688"
            x2="92.882"
            y2="-44.061"
            gradientTransform="matrix(1 0 0 -1 0 314)"
          >
            <stop offset="0" stopColor="#00FFA3" />
            <stop offset="1" stopColor="#DC1FFF" />
          </linearGradient>
          <path
            fill="url(#solana-gradient-a)"
            d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"
          />
          <path
            fill="url(#solana-gradient-b)"
            d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"
          />
          <path
            fill="url(#solana-gradient-c)"
            d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"
          />
        </svg>
      );
    case "x":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    default:
      return <ExternalLink className={iconClass} />;
  }
}

export function HoverLink({ href, children, className }: HoverLinkProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [offsetX, setOffsetX] = useState(0);

  const targetOffsetRef = useRef(0);
  const currentOffsetRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "top",
    middleware: [
      offset(12),
      flip({
        fallbackPlacements: ["bottom", "right", "left"],
        padding: 8,
      }),
      shift({ padding: 8 }),
    ],
  });

  const hover = useHover(context, {
    delay: { open: 0, close: 150 },
  });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
  ]);

  // Animation loop
  useEffect(() => {
    if (!isOpen) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const animate = () => {
      const diff = targetOffsetRef.current - currentOffsetRef.current;
      const lerp = 0.1; // Smoothing factor

      if (Math.abs(diff) > 0.5) {
        currentOffsetRef.current += diff * lerp;
        setOffsetX(currentOffsetRef.current);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isOpen]);

  // Calculate offset from link center
  const updateTargetOffset = useCallback((clientX: number) => {
    if (!linkRef.current) return;

    const linkRect = linkRef.current.getBoundingClientRect();
    const linkCenterX = linkRect.left + linkRect.width / 2;
    const newOffset = clientX - linkCenterX;

    // Clamp to reasonable range
    const maxOffset = 60;
    targetOffsetRef.current = Math.max(
      -maxOffset,
      Math.min(maxOffset, newOffset),
    );
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      updateTargetOffset(e.clientX);
    },
    [updateTargetOffset],
  );

  const handleMouseEnter = useCallback(
    (e: MouseEvent) => {
      updateTargetOffset(e.clientX);
      // Initialize current position to target (no animation on first appear)
      currentOffsetRef.current = targetOffsetRef.current;
      setOffsetX(targetOffsetRef.current);
    },
    [updateTargetOffset],
  );

  const meta = getLinkMeta(href);

  // Merge our handlers with Floating UI's handlers
  const referenceProps = getReferenceProps({
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
  });

  return (
    <>
      <a
        ref={(node) => {
          refs.setReference(node);
          linkRef.current = node;
        }}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...referenceProps}
      >
        {children}
      </a>

      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="z-50"
            {...getFloatingProps()}
          >
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover-card flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 min-w-[180px] max-w-[260px] no-underline"
              style={{
                transform: `translateX(${offsetX}px)`,
              }}
            >
              <div className="flex-shrink-0 opacity-80">
                {meta.image ? (
                  <Image
                    src={meta.image}
                    alt={meta.title}
                    width={10}
                    height={10}
                    unoptimized={true}
                    className="h-10 w-10 object-contain rounded-lg"
                  />
                ) : (
                  <LinkIcon type={meta.icon} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{meta.title}</div>
                <div className="text-xs opacity-60 truncate">
                  {meta.description}
                </div>
              </div>
            </a>
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
