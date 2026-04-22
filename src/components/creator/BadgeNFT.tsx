import { generateBadgeSVG, svgToDataUri, type BadgeData } from "@/lib/badge-generator";

export function BadgeNFT({ data, size = 160 }: { data: BadgeData; size?: number }) {
  const svg = generateBadgeSVG(data);
  return (
    <img
      src={svgToDataUri(svg)}
      width={size}
      height={(size * 200) / 160}
      alt={`${data.handle} momentum badge`}
      className="rounded-xl border border-white/[0.06] shadow-card"
    />
  );
}
