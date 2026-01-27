import { ImageResponse } from "next/og";

export const alt = "@cxalem thoughts";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "80px",
        backgroundColor: "#fafafa",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 500,
          color: "#18181b",
          marginBottom: 24,
        }}
      >
        @cxalem thoughts
      </div>
      <div
        style={{
          fontSize: 32,
          color: "#71717a",
        }}
      >
        Personal blog
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
