import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { CreatorCard } from "@/components/creator/CreatorCard";
import { useCreators } from "@/hooks/useCreators";
import { ArrowRight, Activity, Brain, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { formatSOL } from "@/lib/bonding-curve";

export default function Landing() {
  const { creators } = useCreators();
  const top = [...creators].sort((a, b) => b.momentumScore - a.momentumScore).slice(0, 6);
  const ticker = [...creators, ...creators];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0 -z-10 opacity-80" />
        <div className="container relative pb-24 pt-20 md:pt-28">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-purple/40 bg-brand-purple/10 px-3 py-1 text-xs font-medium text-brand-purple">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green animate-pulse-glow" />
              Live on Solana · scored by AI
            </span>
            <h1 className="mt-6 font-display text-4xl leading-[1.1] md:text-6xl">
              The only social token platform <br />
              <span className="text-gradient-brand">where price means something.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl font-terminal text-2xl text-secondary-fg">
              &gt; Creators mint personal tokens. AI scores their social momentum every 6 hours and adjusts the bonding curve in real-time. Holders bet on creator challenges via on-chain prediction markets._
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-gradient-brand text-white hover:opacity-90 shadow-glow">
                <Link to="/create">Launch your token <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/10 bg-elevated hover:bg-hover">
                <Link to="/leaderboard">View leaderboard</Link>
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 text-center">
              <Stat label="Creators" value={creators.length.toString()} />
              <Stat label="Total volume" value={`${formatSOL(creators.reduce((s, c) => s + c.volumeSOL, 0))} SOL`} />
              <Stat label="Holders" value={creators.reduce((s, c) => s + c.holderCount, 0).toLocaleString()} />
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className="border-y border-white/[0.06] bg-surface/60 backdrop-blur">
          <div className="overflow-hidden py-3">
            <div className="flex gap-8 animate-ticker whitespace-nowrap">
              {ticker.map((c, i) => {
                const up = c.priceChange24h >= 0;
                return (
                  <span key={i} className="inline-flex items-center gap-2 text-sm">
                    <span className="font-display font-semibold">${c.tokenSymbol}</span>
                    <span className="font-mono-num text-secondary-fg">{formatSOL(c.priceSOL, 4)}</span>
                    <span className={`font-mono-num text-xs ${up ? "text-up" : "text-down"}`}>
                      {up ? "+" : ""}{c.priceChange24h.toFixed(2)}%
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="label-eyebrow text-brand-purple">How it works</span>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight">Real signal, on-chain.</h2>
          <p className="mt-3 text-secondary-fg">
            Four primitives that make creator tokens trade on substance, not vibes.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: Brain, t: "AI Momentum Oracle", d: "Claude scores each creator 0–100 every 6h based on real social signals." },
            { Icon: Activity, t: "Quadratic bonding curve", d: "Price = K × supply. Fair, predictable, no rug surprises." },
            { Icon: Trophy, t: "Prediction markets", d: "Stake YES/NO on creator challenges. Winners split the pot." },
            { Icon: ShieldCheck, t: "Live badge NFTs", d: "Bronze → Graduate. Auto-mints, auto-updates as score moves." },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="rounded-xl border border-white/[0.06] bg-surface p-5 shadow-card">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-brand-soft">
                <Icon className="h-5 w-5 text-brand-purple" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-secondary-fg">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top movers */}
      <section className="container pb-24">
        <div className="flex items-end justify-between">
          <div>
            <span className="label-eyebrow text-brand-green">Top momentum</span>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">Highest-scoring creators right now</h2>
          </div>
          <Button asChild variant="outline" className="border-white/10 bg-elevated hover:bg-hover">
            <Link to="/leaderboard">All creators <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {top.map((c) => <CreatorCard key={c.handle} c={c} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="overflow-hidden rounded-2xl border border-brand-purple/30 bg-gradient-brand-soft p-10 text-center shadow-glow">
          <Sparkles className="mx-auto h-8 w-8 text-brand-purple" />
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Your reputation, traded live.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-secondary-fg">
            Mint your token in 4 steps. Your score, badge, and curve start moving the moment you post.
          </p>
          <Button asChild size="lg" className="mt-6 bg-gradient-brand text-white hover:opacity-90 shadow-glow">
            <Link to="/create">Launch token <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-white/[0.06]">
        <div className="container flex h-16 items-center justify-between text-xs text-tertiary-fg">
          <span>pumpme.tech · Solana Frontier 2026</span>
          <span>Devnet · AI oracle by Lovable AI</span>
        </div>
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-surface px-4 py-3">
      <div className="font-mono-num text-xl font-semibold">{value}</div>
      <div className="label-eyebrow text-tertiary-fg">{label}</div>
    </div>
  );
}
