import { ImageResponse } from "next/og";

export const alt = "Meadowbrook Ward Sacrament Meeting Planner";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #25103f, #6430a5)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "72px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "22px",
            fontSize: "30px",
            fontWeight: 700,
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "68px",
              height: "68px",
              borderRadius: "20px",
              background: "white",
              color: "#6430a5",
            }}
          >
            M
          </span>
          Meadowbrook Ward
        </div>
        <div style={{ fontSize: "72px", fontWeight: 800, lineHeight: 1.05 }}>
          Sacrament Meeting Planner
        </div>
        <div style={{ color: "#eadcf8", fontSize: "30px" }}>
          Prepare, manage, and share Sunday meeting programs.
        </div>
      </div>
    </div>,
    size,
  );
}
