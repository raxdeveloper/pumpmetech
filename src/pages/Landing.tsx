import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { CreatorCard } from "@/components/creator/CreatorCard";
import { useCreators } from "@/hooks/useCreators";
import { ArrowUpRight, Compass, TrendingUp, Rocket, MessageCircle, Coins } from "lucide-react";
import { formatSOL } from "@/lib/bonding-curve";

export default function Landing() {
  const { creators } = useCreators();
  const top = [...creators].sort((a, b) => b.momentumScore - a.momentumScore).slice(0, 6);
  const ticker = [...creators, ...creators];

  const totalVolume = creators.reduce((s, c) => s + c.volumeSOL, 0);
  const totalHolders = creators.reduce((s, c) => s + c.holderCount, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero — cinematic sky */}
      <section className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 -z-10 clouds-bg" />
        {/* Two layered cloud drifts for parallax depth */}
        <div
          className="absolute inset-0 -z-10 opacity-50 animate-cloud-1"
          style={{ background: "radial-gradient(ellipse 55% 35% at 25% 75%, hsl(28 50% 40% / 0.45), transparent 70%)" }}
        />
        <div
          className="absolute inset-0 -z-10 opacity-40 animate-cloud-2"
          style={{ background: "radial-gradient(ellipse 50% 30% at 75% 70%, hsl(28 45% 35% / 0.4), transparent 70%)" }}
        />

        <div className="container relative pt-12 pb-10 md:pt-20">
          {/* Powered by Solana pill */}
          <div className="flex justify-center animate-hero-rise">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/40 px-4 py-1.5 text-xs backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse-dot" />
              <span className="text-secondary-fg">Powered by</span>
              <span className="font-semibold text-gradient-brand">Solana</span>
            </div>
          </div>

          {/* Headline */}
          <div className="mx-auto mt-8 max-w-4xl text-center">
            <h1 className="font-bitcount text-5xl leading-[1.05] md:text-7xl lg:text-[88px] animate-hero-rise delay-100">
              The only social token platform
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">where price means something.</span>
                <span className="absolute inset-x-0 bottom-2 -z-0 h-[0.55em] bg-white/5 backdrop-blur-sm rounded-sm" />
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl font-sans text-base text-secondary-fg md:text-lg animate-hero-rise delay-200">
              Creators mint personal tokens. AI scores their social momentum every 6 hours
              and adjusts the bonding curve in real-time. Holders bet on creator
              challenges via on-chain prediction markets.
            </p>

            {/* Hero subgrid — animated key stats */}
            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
              <HeroStat
                delay="delay-300"
                eyebrow="AI Oracle"
                value="6h"
                label="score refresh cadence"
                progress={0.66}
              />
              <HeroStat
                delay="delay-400"
                eyebrow="Bonding Curve"
                value="LIVE"
                label="quadratic · on-chain"
                progress={1}
                pulse
              />
              <HeroStat
                delay="delay-500"
                eyebrow="Prediction Markets"
                value="YES/NO"
                label="stake on challenges"
                progress={0.45}
              />
            </div>

            {/* CTA */}
            <div className="mt-10 flex flex-col items-center gap-3 animate-hero-rise delay-500">
              <div className="ring-cta">
                <Button asChild size="lg" className="btn-cta-green rounded-full px-8 py-6 text-base font-semibold">
                  <Link to="/create">
                    Start Trading <ArrowUpRight className="ml-1 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <p className="text-xs text-secondary-fg">
                Secure Non-Custodial Wallet
                <br />
                Instant sign-up, instant Rewards.
              </p>
            </div>

            {/* Quick nav chips */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2 animate-hero-rise delay-600">
              <ChipLink to="/leaderboard" Icon={Compass} label="Discover" active />
              <ChipLink to="/leaderboard" Icon={TrendingUp} label="Trade" />
              <ChipLink to="/create" Icon={Rocket} label="Create" />
              <ChipLink to="/challenges" Icon={MessageCircle} label="Chat" />
              <ChipLink to="/portfolio" Icon={Coins} label="Earn" />
            </div>
          </div>

          {/* Floating dashboard preview — minimal, no AI avatars */}
          <div className="relative mx-auto mt-16 max-w-6xl animate-hero-rise delay-500">
            <div className="rounded-3xl border border-white/10 bg-elevated/80 p-3 shadow-card backdrop-blur-xl animate-float">
              <div className="rounded-2xl bg-background/80 p-4">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <span className="font-sans text-sm font-medium tracking-tight">pumpme<span className="text-primary">.</span>tech</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 font-mono-num text-xs text-secondary-fg">
                    <span>{formatSOL(totalVolume, 0)} SOL · 24h</span>
                    <span className="rounded-md border border-white/10 px-2 py-1">+ Create</span>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {top.slice(0, 4).map((c) => {
                    const up = c.priceChange24h >= 0;
                    return (
                      <div key={c.handle} className="rounded-xl border border-white/[0.06] bg-surface/80 p-3 transition-colors hover:border-white/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border border-white/10 bg-background text-[10px] font-medium text-foreground/80">
                              {c.tokenSymbol.slice(0, 2)}
                            </span>
                            <span className="font-mono-num text-xs truncate">${c.tokenSymbol}</span>
                          </div>
                          <span className="font-mono-num text-[10px] text-tertiary-fg">{c.holderCount.toLocaleString()}</span>
                        </div>
                        <div className="mt-3 flex items-end justify-between">
                          <div>
                            <div className="label-eyebrow text-[9px]">Mkt cap</div>
                            <div className="font-mono-num text-sm">{formatSOL(c.marketCapSOL, 1)}</div>
                            <div className={`font-mono-num text-xs ${up ? "text-up" : "text-down"}`}>
                              {up ? "+" : ""}{c.priceChange24h.toFixed(2)}%
                            </div>
                          </div>
                          <Sparkline up={up} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* glow */}
            <div className="pointer-events-none absolute -inset-x-12 -bottom-12 -z-10 h-40 rounded-full bg-primary/20 blur-3xl" />
          </div>
        </div>

        {/* Live ticker */}
        <div className="border-y border-white/[0.06] bg-background/60 backdrop-blur">
          <div className="overflow-hidden py-3">
            <div className="flex gap-8 animate-ticker whitespace-nowrap">
              {ticker.map((c, i) => {
                const up = c.priceChange24h >= 0;
                return (
                  <span key={i} className="inline-flex items-center gap-2 text-sm">
                    <span className="font-sans font-semibold">${c.tokenSymbol}</span>
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

      {/* Stats strip */}
      <section className="container py-16">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Total Volume" value={`${formatSOL(totalVolume, 0)} SOL`} />
          <Stat label="Creators" value={creators.length.toString()} />
          <Stat label="Holders" value={totalHolders.toLocaleString()} />
          <Stat label="Graduated" value={creators.filter((c) => c.isGraduated).length.toString()} />
        </div>
      </section>

      {/* How it works */}
      <section className="container pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="label-eyebrow">How it works</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">
            Real signal, <span className="font-serif-it text-primary">on-chain.</span>
          </h2>
          <p className="mt-4 font-sans text-secondary-fg">
            Four primitives that make creator tokens trade on substance, not vibes.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { t: "AI Momentum Oracle", d: "Scored every 6h on real social signals — verified, signed, on-chain." },
            { t: "Quadratic Curve", d: "Price = K × supply. Fair, predictable, no surprises." },
            { t: "Prediction Markets", d: "Stake YES/NO on creator challenges. Winners split the pot." },
            { t: "Live Badge NFTs", d: "Bronze → Graduate. Auto-mints, auto-updates as score moves." },
          ].map(({ t, d }, i) => (
            <div key={t} className="group relative overflow-hidden rounded-2xl glass p-6 transition-all hover:border-primary/30">
              <div className="font-mono-num text-xs text-primary">0{i + 1}</div>
              <h3 className="mt-3 font-display text-2xl">{t}</h3>
              <p className="mt-2 font-sans text-sm text-secondary-fg">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top movers */}
      <section className="container pb-20">
        <div className="flex items-end justify-between">
          <div>
            <span className="label-eyebrow">Top momentum</span>
            <h2 className="mt-2 font-display text-4xl">
              Highest-scoring creators <span className="font-serif-it text-primary">right now</span>
            </h2>
          </div>
          <Button asChild variant="outline" className="border-white/10 bg-elevated hover:bg-hover rounded-full">
            <Link to="/leaderboard">All creators <ArrowUpRight className="ml-1.5 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {top.map((c) => <CreatorCard key={c.handle} c={c} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 clouds-bg p-12 text-center">
          <h2 className="font-display text-4xl md:text-6xl">
            Your reputation, <span className="font-serif-it text-primary">traded live.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-secondary-fg">
            Mint your token in 4 steps. Score, badge and curve start moving the moment you post.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="ring-cta">
              <Button asChild size="lg" className="btn-cta-green rounded-full px-8 py-6 text-base font-semibold">
                <Link to="/create">Launch token <ArrowUpRight className="ml-1 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
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

function ChipLink({
  to, Icon, label, active = false,
}: { to: string; Icon: typeof Compass; label: string; active?: boolean }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition-colors ${
        active
          ? "border-primary/50 bg-primary/10 text-foreground"
          : "border-white/10 bg-elevated/60 text-secondary-fg hover:text-foreground hover:border-white/20"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl glass px-5 py-4">
      <div className="label-eyebrow">{label}</div>
      <div className="mt-1 font-mono-num text-2xl">{value}</div>
    </div>
  );
}

function Sparkline({ up }: { up: boolean }) {
  const color = up ? "hsl(var(--up))" : "hsl(var(--down))";
  const path = up
    ? "M0 18 L8 14 L16 16 L24 10 L32 12 L40 6 L48 8 L56 4"
    : "M0 4 L8 8 L16 6 L24 12 L32 10 L40 16 L48 14 L56 18";
  return (
    <svg width="56" height="22" viewBox="0 0 56 22" fill="none">
      <path d={path} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
