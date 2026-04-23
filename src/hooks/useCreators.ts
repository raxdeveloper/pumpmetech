// Live creators from Lovable Cloud with realtime updates.
// Falls back to mock data if Cloud query fails (keeps UI stable in dev).
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MOCK_CREATORS, type MockCreator } from "@/lib/mock-data";
import { tierForScore } from "@/lib/tiers";

type Row = {
  handle: string;
  display_name: string;
  token_symbol: string;
  initials: string;
  avatar_color: string;
  x_handle: string | null;
  x_verified: boolean;
  bio: string | null;
  momentum_score: number;
  momentum_trend: string;
  momentum_reasoning: string | null;
  badge_tier: string;
  price_sol: number | string;
  price_change_24h: number | string;
  price_history: (number | string)[];
  supply: number | string;
  sol_reserves: number | string;
  market_cap_sol: number | string;
  holder_count: number;
  volume_sol: number | string;
  challenge_completions: number;
  is_graduated: boolean;
};

function toMock(r: Row): MockCreator {
  const trend = (["up", "down", "stable"].includes(r.momentum_trend)
    ? r.momentum_trend
    : r.momentum_trend === "rising" ? "up" : r.momentum_trend === "falling" ? "down" : "stable") as MockCreator["momentumTrend"];
  return {
    handle: r.handle,
    displayName: r.display_name,
    tokenSymbol: r.token_symbol,
    initials: r.initials,
    bio: r.bio ?? "",
    avatarColor: r.avatar_color,
    xHandle: r.x_handle ?? `@${r.handle}`,
    xVerified: r.x_verified,
    momentumScore: r.momentum_score,
    momentumTrend: trend,
    momentumReasoning: r.momentum_reasoning ?? "",
    priceSOL: Number(r.price_sol),
    priceChange24h: Number(r.price_change_24h),
    priceHistory: (r.price_history ?? []).map(Number),
    supply: Number(r.supply),
    solReserves: Number(r.sol_reserves),
    marketCapSOL: Number(r.market_cap_sol),
    holderCount: r.holder_count,
    volumeSOL: Number(r.volume_sol),
    challengeCompletions: r.challenge_completions,
    isGraduated: r.is_graduated,
  };
}

export function useCreators() {
  const [creators, setCreators] = useState<MockCreator[]>(MOCK_CREATORS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("creators")
        .select("*")
        .order("momentum_score", { ascending: false });
      if (cancelled) return;
      if (error || !data?.length) {
        console.warn("useCreators fallback to mock", error?.message);
      } else {
        setCreators(data.map((d) => toMock(d as unknown as Row)));
      }
      setLoading(false);
    })();

    const channel = supabase
      .channel("creators-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "creators" }, (payload) => {
        const row = payload.new as unknown as Row;
        if (!row?.handle) return;
        setCreators((prev) => {
          const next = [...prev];
          const i = next.findIndex((c) => c.handle === row.handle);
          const mapped = toMock(row);
          if (i >= 0) next[i] = mapped; else next.push(mapped);
          return next.sort((a, b) => b.momentumScore - a.momentumScore);
        });
      })
      .subscribe();

    return () => { cancelled = true; supabase.removeChannel(channel); };
  }, []);

  // Re-export tier helper bound to live data
  return { creators, loading, tierFor: (c: MockCreator) => tierForScore(c.momentumScore, c.isGraduated) };
}

export function useCreator(handle: string) {
  const { creators, loading } = useCreators();
  return { creator: creators.find((c) => c.handle === handle), loading };
}
