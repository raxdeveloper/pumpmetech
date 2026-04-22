import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  formatSOL,
  formatTokens,
  getPrice,
  getPriceImpact,
  getSolOut,
  getTokensOut,
} from "@/lib/bonding-curve";

type Side = "buy" | "sell";

export function TradePanel({
  symbol,
  supply,
  reserves,
  onTrade,
}: {
  symbol: string;
  supply: number;
  reserves: number;
  onTrade?: (side: Side, amount: number) => void;
}) {
  const [side, setSide] = useState<Side>("buy");
  const [amount, setAmount] = useState("0.1");

  const num = Math.max(0, parseFloat(amount) || 0);

  const quote = useMemo(() => {
    if (side === "buy") {
      const out = getTokensOut(reserves, num);
      const impact = getPriceImpact(supply, num, reserves);
      const next = getPrice(supply + out);
      return { out, impact, next, label: `${symbol} received` };
    } else {
      const sol = getSolOut(supply, num);
      const impact = -((getPrice(supply) - getPrice(Math.max(0, supply - num))) / getPrice(supply || 1)) * 100;
      const next = getPrice(Math.max(0, supply - num));
      return { out: sol, impact, next, label: "SOL received" };
    }
  }, [side, num, reserves, supply, symbol]);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-surface p-5 shadow-card">
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-elevated p-1">
        <button
          onClick={() => setSide("buy")}
          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            side === "buy" ? "bg-up/15 text-up" : "text-secondary-fg hover:text-foreground"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide("sell")}
          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            side === "sell" ? "bg-down/15 text-down" : "text-secondary-fg hover:text-foreground"
          }`}
        >
          Sell
        </button>
      </div>

      <div className="mt-4">
        <label className="label-eyebrow text-tertiary-fg">
          {side === "buy" ? "Amount (SOL)" : `Amount (${symbol})`}
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/[0.06] bg-elevated px-3 py-2">
          <Input
            type="number"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border-0 bg-transparent p-0 font-mono-num text-lg shadow-none focus-visible:ring-0"
          />
          <span className="text-sm text-secondary-fg">{side === "buy" ? "SOL" : symbol}</span>
        </div>
        <div className="mt-2 flex gap-1.5">
          {(side === "buy" ? ["0.1", "0.5", "1", "5"] : ["10K", "100K", "1M"]).map((v) => (
            <button
              key={v}
              onClick={() =>
                setAmount(
                  v.endsWith("K") ? String(parseFloat(v) * 1000) : v.endsWith("M") ? String(parseFloat(v) * 1_000_000) : v
                )
              }
              className="rounded-md border border-white/[0.06] bg-elevated px-2.5 py-1 text-xs text-secondary-fg hover:bg-hover hover:text-foreground"
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-2 rounded-lg bg-elevated p-3 text-sm">
        <Row label={quote.label} value={`${side === "buy" ? formatTokens(quote.out) : formatSOL(quote.out, 4)}`} />
        <Row label="Price impact" value={`${quote.impact >= 0 ? "+" : ""}${quote.impact.toFixed(2)}%`} valueClass={quote.impact >= 0 ? "text-up" : "text-down"} />
        <Row label="New price" value={`${formatSOL(quote.next, 6)} SOL`} />
        <Row label="Platform fee" value="0.5%" muted />
      </div>

      <Button
        onClick={() => {
          onTrade?.(side, num);
          toast.success(`${side === "buy" ? "Buy" : "Sell"} order simulated`, {
            description: `${formatSOL(num)} ${side === "buy" ? "SOL" : symbol} — connect wallet to execute`,
          });
        }}
        className={`mt-4 w-full ${
          side === "buy"
            ? "bg-up text-background hover:bg-up/90"
            : "bg-down text-foreground hover:bg-down/90"
        }`}
        size="lg"
      >
        {side === "buy" ? `Buy ${symbol}` : `Sell ${symbol}`}
      </Button>
    </div>
  );
}

function Row({ label, value, valueClass = "", muted = false }: { label: string; value: string; valueClass?: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-tertiary-fg" : "text-secondary-fg"}>{label}</span>
      <span className={`font-mono-num ${valueClass || "text-foreground"}`}>{value}</span>
    </div>
  );
}
