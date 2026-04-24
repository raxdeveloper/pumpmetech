import { Link } from "react-router-dom";
import { MomentumBadge } from "./MomentumBadge";
import { tierFor, type MockCreator } from "@/lib/mock-data";
import { formatSOL } from "@/lib/bonding-curve";

export function CreatorCard({ c }: { c: MockCreator }) {
  const up = c.priceChange24h >= 0;
  return (
    <Link
      to={`/c/${c.handle}`}
      className="group flex flex-col gap-4 rounded-2xl glass p-5 transition-all hover:border-primary/40 hover:shadow-glow"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-background"
            style={{ background: c.avatarColor }}
          >
            {c.initials}
          </div>
          <div>
            <div className="font-sans text-base font-semibold leading-tight">${c.tokenSymbol}</div>
            <div className="text-xs text-secondary-fg">{c.xHandle}</div>
          </div>
        </div>
        <MomentumBadge score={c.momentumScore} tier={tierFor(c)} trend={c.momentumTrend} size="sm" />
      </div>

      <p className="line-clamp-2 text-sm text-secondary-fg">{c.bio}</p>

      <div className="mt-auto flex items-end justify-between gap-3 pt-2">
        <div>
          <div className="label-eyebrow">Price</div>
          <div className="font-mono-num text-base">{formatSOL(c.priceSOL, 4)} SOL</div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${up ? "pill-up" : "pill-down"}`}>
          {up ? "↗ +" : "↘ "}
          {c.priceChange24h.toFixed(2)}%
        </span>
      </div>
    </Link>
  );
}
