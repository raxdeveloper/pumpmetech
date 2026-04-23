import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import confetti from "canvas-confetti";
import { Navbar } from "@/components/layout/Navbar";
import { MOCK_CHALLENGES, tierFor } from "@/lib/mock-data";
import { useCreator } from "@/hooks/useCreators";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";
import { MomentumBadge } from "@/components/creator/MomentumBadge";
import { BadgeNFT } from "@/components/creator/BadgeNFT";
import { BondingCurveChart } from "@/components/trading/BondingCurveChart";
import { TradePanel } from "@/components/trading/TradePanel";
import { ChallengeCard } from "@/components/creator/ChallengeCard";
import { Progress } from "@/components/ui/progress";
import { formatSOL, GRADUATION_SOL } from "@/lib/bonding-curve";
import { ExternalLink, Users, Activity, Trophy, BadgeCheck } from "lucide-react";

export default function CreatorProfile() {
  const { handle = "" } = useParams();
  const { creator: c } = useCreator(handle);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (c?.isGraduated) {
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.3 }, colors: ["#9945FF", "#14F195", "#FFB800", "#00C2FF"] });
    }
  }, [c?.isGraduated]);

  async function refreshScore() {
    if (!c) return;
    setRefreshing(true);
    const prev = c.momentumScore;
    try {
      const { data, error } = await supabase.functions.invoke("score-creator", {
        body: { handle: c.handle },
      });
      if (error) throw error;
      const next = data?.score ?? data?.momentum_score;
      toast({ title: "Momentum rescored", description: `${prev} → ${next ?? "?"} · ${data?.trend ?? ""}` });
    } catch (e: any) {
      toast({ title: "Rescore failed", description: e.message ?? "Try again", variant: "destructive" });
    } finally {
      setRefreshing(false);
    }
  }

  if (!c) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="font-display text-3xl">Creator not found</h1>
          <Link to="/leaderboard" className="mt-4 inline-block text-brand-purple hover:underline">Back to leaderboard</Link>
        </div>
      </div>
    );
  }

  const tier = tierFor(c);
  const up = c.priceChange24h >= 0;
  const challenges = MOCK_CHALLENGES.filter((x) => x.creatorHandle === c.handle);
  const gradPct = Math.min(100, (c.marketCapSOL / GRADUATION_SOL) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        {/* Header */}
        <div className="rounded-2xl border border-white/[0.06] bg-surface p-6 shadow-card md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-5">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full font-display text-2xl font-semibold text-background shadow-glow"
                style={{ background: c.avatarColor }}
              >
                {c.initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-3xl font-semibold tracking-tight">{c.displayName}</h1>
                  {c.xVerified && <BadgeCheck className="h-5 w-5 text-brand-cyan" />}
                </div>
                <a className="mt-1 inline-flex items-center gap-1 text-sm text-secondary-fg hover:text-foreground" href={`https://x.com/${c.handle}`} target="_blank" rel="noreferrer">
                  {c.xHandle} <ExternalLink className="h-3 w-3" />
                </a>
                <p className="mt-3 max-w-xl text-secondary-fg">{c.bio}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <MomentumBadge score={c.momentumScore} tier={tier} trend={c.momentumTrend} size="lg" />
                  <span className="rounded-md border border-white/[0.06] bg-elevated px-2.5 py-1 text-xs font-display font-semibold">${c.tokenSymbol}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={refreshScore}
                    disabled={refreshing}
                    className="h-7 gap-1.5 border-brand-purple/40 text-xs hover:bg-brand-purple/10"
                  >
                    <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
                    {refreshing ? "Scoring…" : "Refresh score"}
                  </Button>
                  <span className="text-xs text-secondary-fg">· {c.momentumReasoning}</span>
                </div>
              </div>
            </div>
            <BadgeNFT
              data={{
                handle: c.handle,
                initials: c.initials,
                tokenSymbol: c.tokenSymbol,
                displayName: c.displayName,
                momentumScore: c.momentumScore,
                tier,
                priceSOL: c.priceSOL,
                priceChange24h: c.priceChange24h,
                priceHistory: c.priceHistory.slice(-7),
                holderCount: c.holderCount,
                isGraduated: c.isGraduated,
              }}
              size={140}
            />
          </div>

          {/* Stats grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
            <Stat label="Price" value={`${formatSOL(c.priceSOL, 4)} SOL`} sub={<span className={up ? "text-up" : "text-down"}>{up ? "+" : ""}{c.priceChange24h.toFixed(2)}%</span>} />
            <Stat label="Market cap" value={`${formatSOL(c.marketCapSOL)} SOL`} />
            <Stat label="Supply" value={formatSOL(c.supply)} />
            <Stat label="Holders" value={c.holderCount.toLocaleString()} icon={<Users className="h-3.5 w-3.5" />} />
            <Stat label="24h volume" value={`${formatSOL(c.volumeSOL)} SOL`} icon={<Activity className="h-3.5 w-3.5" />} />
          </div>

          {/* Graduation */}
          <div className="mt-6 rounded-xl border border-brand-gold/20 bg-brand-gold/5 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium">
                <Trophy className="h-4 w-4 text-brand-gold" /> Graduation progress
              </span>
              <span className="font-mono-num">{formatSOL(c.marketCapSOL)} / {GRADUATION_SOL} SOL</span>
            </div>
            <Progress value={gradPct} className="mt-3 h-2 bg-elevated [&>div]:bg-brand-gold" />
            <div className="mt-2 text-xs text-secondary-fg">
              At 69 SOL market cap, ${c.tokenSymbol} graduates to a constant-product AMM and the badge upgrades to Graduate tier.
            </div>
          </div>
        </div>

        {/* Chart + trade */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-white/[0.06] bg-surface p-5 shadow-card lg:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <span className="label-eyebrow text-brand-purple">Bonding curve · 24h</span>
              <span className="text-xs text-tertiary-fg">Quadratic · K = 1e-9</span>
            </div>
            <BondingCurveChart history={c.priceHistory} />
          </div>
          <TradePanel symbol={c.tokenSymbol} supply={c.supply} reserves={c.solReserves} />
        </div>

        {/* Challenges */}
        <div className="mt-10">
          <div className="flex items-end justify-between">
            <div>
              <span className="label-eyebrow text-brand-green">Active challenges</span>
              <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">Bet on @{c.handle}'s next move</h2>
            </div>
          </div>
          {challenges.length === 0 ? (
            <div className="mt-4 rounded-xl border border-white/[0.06] bg-surface p-8 text-center text-secondary-fg">
              No active challenges from this creator yet.
            </div>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {challenges.map((ch) => <ChallengeCard key={ch.id} ch={ch} />)}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, sub, icon }: { label: string; value: string; sub?: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-elevated px-4 py-3">
      <div className="label-eyebrow flex items-center gap-1.5 text-tertiary-fg">{icon}{label}</div>
      <div className="mt-1 font-mono-num text-lg">{value}</div>
      {sub && <div className="mt-0.5 text-xs font-mono-num">{sub}</div>}
    </div>
  );
}
