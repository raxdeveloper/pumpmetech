import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { MOCK_CREATORS, tierFor } from "@/lib/mock-data";
import { MomentumBadge } from "@/components/creator/MomentumBadge";
import { formatSOL } from "@/lib/bonding-curve";
import { Wallet } from "lucide-react";

// Mock holdings — first 4 creators
const HOLDINGS = MOCK_CREATORS.slice(0, 4).map((c, i) => ({
  c,
  tokens: [125_000, 48_000, 22_000, 9_500][i],
  costBasis: c.priceSOL * 0.78, // pretend bought a bit cheaper
}));

export default function Portfolio() {
  const totalValue = HOLDINGS.reduce((s, h) => s + h.tokens * h.c.priceSOL, 0);
  const totalCost = HOLDINGS.reduce((s, h) => s + h.tokens * h.costBasis, 0);
  const pnl = totalValue - totalCost;
  const pnlPct = totalCost > 0 ? (pnl / totalCost) * 100 : 0;
  const up = pnl >= 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <span className="label-eyebrow text-brand-purple">Portfolio</span>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">Your positions.</h1>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Big label="Total value" value={`${formatSOL(totalValue)} SOL`} icon={<Wallet className="h-4 w-4" />} />
          <Big label="Cost basis" value={`${formatSOL(totalCost)} SOL`} />
          <Big
            label="P&L"
            value={`${up ? "+" : ""}${formatSOL(pnl)} SOL`}
            sub={<span className={up ? "text-up" : "text-down"}>{up ? "+" : ""}{pnlPct.toFixed(2)}%</span>}
          />
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-white/[0.06] bg-surface shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-elevated/60 text-xs uppercase tracking-wider text-tertiary-fg">
              <tr>
                <th className="px-5 py-3 text-left">Token</th>
                <th className="px-5 py-3 text-left">Momentum</th>
                <th className="px-5 py-3 text-right">Balance</th>
                <th className="px-5 py-3 text-right">Avg cost</th>
                <th className="px-5 py-3 text-right">Price</th>
                <th className="px-5 py-3 text-right">Value</th>
                <th className="px-5 py-3 text-right">P&L</th>
              </tr>
            </thead>
            <tbody>
              {HOLDINGS.map(({ c, tokens, costBasis }) => {
                const value = tokens * c.priceSOL;
                const cost = tokens * costBasis;
                const p = value - cost;
                const upRow = p >= 0;
                return (
                  <tr key={c.handle} className="border-t border-white/[0.04] bg-hover-row">
                    <td className="px-5 py-4">
                      <Link to={`/c/${c.handle}`} className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-full font-display text-xs font-semibold text-background"
                          style={{ background: c.avatarColor }}
                        >
                          {c.initials}
                        </div>
                        <div>
                          <div className="font-display font-semibold">${c.tokenSymbol}</div>
                          <div className="text-xs text-secondary-fg">{c.displayName}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <MomentumBadge score={c.momentumScore} tier={tierFor(c)} trend={c.momentumTrend} size="sm" />
                    </td>
                    <td className="px-5 py-4 text-right font-mono-num">{tokens.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right font-mono-num text-secondary-fg">{formatSOL(costBasis, 5)}</td>
                    <td className="px-5 py-4 text-right font-mono-num">{formatSOL(c.priceSOL, 5)}</td>
                    <td className="px-5 py-4 text-right font-mono-num">{formatSOL(value)} SOL</td>
                    <td className={`px-5 py-4 text-right font-mono-num ${upRow ? "text-up" : "text-down"}`}>
                      {upRow ? "+" : ""}{formatSOL(p)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function Big({ label, value, sub, icon }: { label: string; value: string; sub?: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-surface p-5 shadow-card">
      <div className="label-eyebrow flex items-center gap-1.5 text-tertiary-fg">{icon}{label}</div>
      <div className="mt-2 font-mono-num text-2xl">{value}</div>
      {sub && <div className="mt-1 text-sm font-mono-num">{sub}</div>}
    </div>
  );
}
