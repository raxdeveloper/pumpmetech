export type Tier = "Bronze" | "Silver" | "Gold" | "Platinum" | "Graduate";

export function tierForScore(score: number, isGraduated = false): Tier {
  if (isGraduated || score >= 100) return "Graduate";
  if (score >= 81) return "Platinum";
  if (score >= 61) return "Gold";
  if (score >= 31) return "Silver";
  return "Bronze";
}

export const TIER_HEX: Record<Tier, string> = {
  Bronze: "#CD7F32",
  Silver: "#9945FF",
  Gold: "#14F195",
  Platinum: "#00C2FF",
  Graduate: "#FFB800",
};

export const TIER_CLASS: Record<Tier, string> = {
  Bronze: "text-tier-bronze border-tier-bronze/40 bg-tier-bronze/10",
  Silver: "text-tier-silver border-tier-silver/40 bg-tier-silver/10",
  Gold: "text-tier-gold border-tier-gold/40 bg-tier-gold/10",
  Platinum: "text-tier-platinum border-tier-platinum/40 bg-tier-platinum/10",
  Graduate: "text-tier-graduate border-tier-graduate/40 bg-tier-graduate/10",
};
