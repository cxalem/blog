import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/posts";
export const alt = "Blog post";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Strip markdown formatting for clean display
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1") // bold
    .replace(/\*(.+?)\*/g, "$1") // italic
    .replace(/~~(.+?)~~/g, "$1") // strikethrough
    .replace(/`(.+?)`/g, "$1"); // inline code
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const title = post ? stripMarkdown(post.title) : "Post not found";
  const date = post?.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        backgroundColor: "#fafafa",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: 64,
          fontWeight: 500,
          color: "#18181b",
          lineHeight: 1.2,
          marginBottom: 24,
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {title}
      </div>

      {/* Date and author */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        {date && (
          <div
            style={{
              fontSize: 28,
              color: "#71717a",
            }}
          >
            {date}
          </div>
        )}
        <div
          style={{
            fontSize: 28,
            color: "#71717a",
          }}
        >
          @cxalem
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 8,
          backgroundColor: "#18181b",
        }}
      />
    </div>,
    {
      ...size,
    },
  );
}
