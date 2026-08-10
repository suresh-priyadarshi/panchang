"use client";

export default function MoonPhase({ illum, waxing, size = 120 }) {
  const k = 1 - 2 * illum;
  const shadowWidth = Math.abs(k) * (size / 2);
  const clipSide = waxing ? "right" : "left";
  const roundedFar = clipSide === "right" ? "0 50% 50% 0 / 0 50% 50% 0" : "50% 0 0 50% / 50% 0 0 50%";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        position: "relative",
        background: "#0A0C22",
        boxShadow: "inset 0 0 18px rgba(0,0,0,0.6), 0 0 40px rgba(232,179,76,0.12)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, #F3D98B, #E8B34C 70%)",
        }}
      />
      {illum < 0.5 ? (
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: size / 2,
              background: "#0A0C22",
              borderRadius: roundedFar,
              [clipSide]: 0,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: size / 2 - shadowWidth,
              background: "#0A0C22",
              borderRadius: "50%",
              [clipSide === "right" ? "left" : "right"]: shadowWidth,
            }}
          />
        </>
      ) : (
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: size / 2,
              background: "#0A0C22",
              borderRadius: roundedFar,
              [clipSide]: 0,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: size / 2 - shadowWidth,
              background: "radial-gradient(circle at 50% 50%, #F3D98B, #E8B34C 70%)",
              [clipSide]: 0,
            }}
          />
        </>
      )}
    </div>
  );
}
