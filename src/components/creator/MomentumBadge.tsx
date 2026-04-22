import { TIER_CLASS, type Tier } from "@/lib/tiers";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

export function MomentumBadge({
  score,
  tier,
  trend = "stable",
  size = "md",
}: {
  score: number;
  tier: Tier;
  trend?: "up" | "down" | "stable";
  size?: "sm" | "md" | "lg";
}) {
  const Icon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const sizes = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium tabular ${TIER_CLASS[tier]} ${sizes[size]}`}
    >
      <Icon className="h-3 w-3" />
      <span>{score}</span>
      <span className="opacity-70">·</span>
      <span className="uppercase tracking-wider text-[0.85em]">{tier}</span>
    </span>
  );
}
