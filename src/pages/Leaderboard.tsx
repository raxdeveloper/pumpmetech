import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { MOCK_CREATORS, tierFor } from "@/lib/mock-data";
import { MomentumBadge } from "@/components/creator/MomentumBadge";
import { formatSOL } from "@/lib/bonding-curve";
import { Input } from "@/components/ui/input";
import { ArrowDown, ArrowUp, Search } from "lucide-react";

type SortKey = "momentum" | "price" | "change" | "holders" | "volume";

export default function Leaderboard() {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("momentum");
  const [desc, setDesc] = useState(true);

  const rows = useMemo(() => {
    const filtered = MOCK_CREATORS.filter(
      (c) => !q || c.handle.toLowerCase().includes(q.toLowerCase()) || c.tokenSymbol.toLowerCase().includes(q.toLowerCase())
    );
    const m: Record<SortKey, (a: typeof MOCK_CREATORS[number]) => number> = {
      momentum: (a) => a.momentumScore,
      price: (a) => a.priceSOL,
      change: (a) => a.priceChange24h,
      holders: (a) => a.holderCount,
      volume: (a) => a.volumeSOL,
    };
    return [...filtered].sort((a, b) => (desc ? m[sortKey](b) - m[sortKey](a) : m[sortKey](a) - m[sortKey](b)));
  }, [q, sortKey, desc]);

  const toggle = (k: SortKey) => {
    if (sortKey === k) setDesc(!desc);
    else { setSortKey(k); setDesc(true); }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="label-eyebrow text-brand-purple">Leaderboard</span>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">All creators, ranked by signal.</h1>
            <p className="mt-2 text-secondary-fg">Live AI-scored momentum across {MOCK_CREATORS.length} active tokens.</p>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-tertiary-fg" />
            <Input
              placeholder="Search handle or symbol"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="border-white/[0.06] bg-elevated pl-9"
            />
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-white/[0.06] bg-surface shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-elevated/60 text-xs uppercase tracking-wider text-tertiary-fg">
                <tr>
                  <th className="px-5 py-3 text-left">#</th>
                  <th className="px-5 py-3 text-left">Creator</th>
                  <Th label="Momentum" k="momentum" sortKey={sortKey} desc={desc} onClick={toggle} />
                  <Th label="Price" k="price" sortKey={sortKey} desc={desc} onClick={toggle} align="right" />
                  <Th label="24h" k="change" sortKey={sortKey} desc={desc} onClick={toggle} align="right" />
                  <Th label="Holders" k="holders" sortKey={sortKey} desc={desc} onClick={toggle} align="right" />
                  <Th label="Volume" k="volume" sortKey={sortKey} desc={desc} onClick={toggle} align="right" />
                </tr>
              </thead>
              <tbody>
                {rows.map((c, i) => {
                  const up = c.priceChange24h >= 0;
                  return (
                    <tr key={c.handle} className="border-t border-white/[0.04] bg-hover-row">
                      <td className="px-5 py-4 text-tertiary-fg tabular">{i + 1}</td>
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
                            <div className="text-xs text-secondary-fg">{c.xHandle}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <MomentumBadge score={c.momentumScore} tier={tierFor(c)} trend={c.momentumTrend} size="sm" />
                      </td>
                      <td className="px-5 py-4 text-right font-mono-num">{formatSOL(c.priceSOL, 4)} SOL</td>
                      <td className={`px-5 py-4 text-right font-mono-num ${up ? "text-up" : "text-down"}`}>
                        {up ? "+" : ""}{c.priceChange24h.toFixed(2)}%
                      </td>
                      <td className="px-5 py-4 text-right font-mono-num text-secondary-fg">{c.holderCount.toLocaleString()}</td>
                      <td className="px-5 py-4 text-right font-mono-num text-secondary-fg">{formatSOL(c.volumeSOL)} SOL</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function Th({
  label, k, sortKey, desc, onClick, align = "left",
}: { label: string; k: SortKey; sortKey: SortKey; desc: boolean; onClick: (k: SortKey) => void; align?: "left" | "right" }) {
  const active = sortKey === k;
  return (
    <th className={`px-5 py-3 ${align === "right" ? "text-right" : "text-left"}`}>
      <button onClick={() => onClick(k)} className={`inline-flex items-center gap-1 hover:text-foreground ${active ? "text-foreground" : ""}`}>
        {label}
        {active && (desc ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />)}
      </button>
    </th>
  );
}
