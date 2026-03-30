import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = {
  width: 512,
  height: 512
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #7cead8 0%, #32d2c5 45%, #2fa7ff 100%)",
          borderRadius: 100,
          color: "white",
          fontSize: 180,
          fontWeight: 800,
          letterSpacing: -10
        }}
      >
        30
      </div>
    ),
    size
  );
}
