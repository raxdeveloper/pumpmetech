// Browser-compatible SVG badge generator (no node-canvas).
import { TIER_HEX, type Tier } from "./tiers";

export interface BadgeData {
  handle: string;
  initials: string;
  tokenSymbol: string;
  displayName: string;
  momentumScore: number;
  tier: Tier;
  priceSOL: number;
  priceChange24h: number;
  priceHistory: number[]; // 7 points
  holderCount: number;
  isGraduated?: boolean;
}

export function generateBadgeSVG(d: BadgeData): string {
  const tierColor = TIER_HEX[d.tier];
  const score = Math.max(0, Math.min(100, d.momentumScore));
  const ringLen = 213; // ~2*PI*r where r=34
  const dash = (score / 100) * ringLen;
  const priceUp = d.priceChange24h >= 0;
  const pillBg = priceUp ? "#14F19526" : "#FF444426";
  const pillFg = priceUp ? "#14F195" : "#FF4444";
  const sign = priceUp ? "+" : "";

  // sparkline polyline (y: 175 high → 155 low)
  const hist = d.priceHistory.length ? d.priceHistory : [1, 1, 1, 1, 1, 1, 1];
  const min = Math.min(...hist);
  const max = Math.max(...hist);
  const range = max - min || 1;
  const points = hist
    .map((v, i) => {
      const x = 16 + (i * (160 - 32)) / (hist.length - 1 || 1);
      const y = 175 - ((v - min) / range) * 20;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const areaPoints = `16,175 ${points} 144,175`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 200" width="160" height="200">
  <rect width="160" height="200" fill="#0A0A0A" rx="12"/>
  <rect x="0" y="0" width="160" height="5" fill="${tierColor}"/>
  <circle cx="80" cy="62" r="34" fill="#111111" stroke="${tierColor}" stroke-width="1.5" opacity="0.9"/>
  <circle cx="80" cy="62" r="34" fill="none" stroke="${tierColor}" stroke-width="2.5"
    stroke-dasharray="${dash.toFixed(1)} ${ringLen.toFixed(1)}"
    stroke-dashoffset="-53"
    stroke-linecap="round"
    transform="rotate(-90 80 62)"/>
  <text x="80" y="68" text-anchor="middle" fill="${tierColor}" font-family="Space Grotesk, sans-serif" font-size="18" font-weight="500">${escapeXml(d.initials)}</text>
  <text x="80" y="114" text-anchor="middle" fill="#FFFFFF" font-family="Space Grotesk, sans-serif" font-size="15" font-weight="600">${escapeXml(d.tokenSymbol)}</text>
  <text x="80" y="130" text-anchor="middle" fill="#FFFFFF" fill-opacity="0.45" font-family="Inter, sans-serif" font-size="9" letter-spacing="1">${escapeXml(d.displayName.toUpperCase().slice(0, 18))}</text>
  <polygon points="${areaPoints}" fill="${tierColor}" fill-opacity="0.08"/>
  <polyline points="${points}" fill="none" stroke="${tierColor}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
  <text x="10" y="192" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="11" font-weight="500">${formatPrice(d.priceSOL)} SOL</text>
  <rect x="98" y="183" width="52" height="13" rx="6.5" fill="${pillBg}"/>
  <text x="124" y="192" text-anchor="middle" fill="${pillFg}" font-family="Inter, sans-serif" font-size="9" font-weight="600">${sign}${d.priceChange24h.toFixed(1)}%</text>
  <text x="150" y="16" text-anchor="end" fill="${tierColor}" font-family="Inter, sans-serif" font-size="9" font-weight="700">${score}</text>
  <text x="80" y="200" text-anchor="middle" fill="#FFFFFF" fill-opacity="0.20" font-family="Inter, sans-serif" font-size="6">pumpme.tech</text>
</svg>`;
}

function formatPrice(n: number): string {
  if (n < 0.0001) return n.toExponential(1);
  if (n < 1) return n.toFixed(4);
  return n.toFixed(2);
}

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!));
}

export function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
