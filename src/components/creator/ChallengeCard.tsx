import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { formatSOL } from "@/lib/bonding-curve";
import type { MockChallenge } from "@/lib/mock-data";
import { Calendar, Sparkles, Trophy } from "lucide-react";

export function ChallengeCard({ ch, creatorName }: { ch: MockChallenge; creatorName?: string }) {
  const [side, setSide] = useState<"yes" | "no">("yes");
  const [amount, setAmount] = useState("0.5");
  const total = ch.stakeYesSOL + ch.stakeNoSOL;
  const yesPct = total > 0 ? (ch.stakeYesSOL / total) * 100 : 50;
  const ms = ch.deadline.getTime() - Date.now();
  const days = Math.max(0, Math.floor(ms / 86400000));
  const hours = Math.max(0, Math.floor((ms % 86400000) / 3600000));
  const isClosed = ch.status !== "active";

  return (
    <div className="flex flex-col rounded-xl border border-white/[0.06] bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          {creatorName && <div className="label-eyebrow text-brand-purple">@{ch.creatorHandle}</div>}
          <h3 className="mt-1 font-display text-lg font-semibold leading-tight">{ch.title}</h3>
        </div>
        <span
          className={`rounded-md border px-2 py-1 text-[11px] font-medium uppercase tracking-wider ${
            ch.status === "active"
              ? "border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan"
              : ch.status === "completed"
              ? "border-up/40 bg-up/15 text-up"
              : "border-down/40 bg-down/15 text-down"
          }`}
        >
          {ch.status}
        </span>
      </div>

      <p className="mt-2 text-sm text-secondary-fg">{ch.description}</p>

      <div className="mt-4 flex items-center gap-4 text-xs text-secondary-fg">
        <span className="flex items-center gap-1.5">
          <Trophy className="h-3.5 w-3.5 text-brand-gold" /> {ch.rewardBps / 100}% reward
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {isClosed ? "Ended" : `${days}d ${hours}h left`}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-up font-mono-num">YES {formatSOL(ch.stakeYesSOL)} SOL</span>
          <span className="text-down font-mono-num">{formatSOL(ch.stakeNoSOL)} SOL NO</span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-elevated">
          <div className="absolute inset-y-0 left-0 bg-up" style={{ width: `${yesPct}%` }} />
          <div className="absolute inset-y-0 right-0 bg-down" style={{ width: `${100 - yesPct}%` }} />
        </div>
        <div className="flex justify-between text-[11px] text-tertiary-fg tabular">
          <span>{yesPct.toFixed(0)}% yes</span>
          <span>{(100 - yesPct).toFixed(0)}% no</span>
        </div>
      </div>

      {!isClosed && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-1 rounded-lg bg-elevated p-1">
            <button
              onClick={() => setSide("yes")}
              className={`rounded-md py-1.5 text-xs font-semibold ${side === "yes" ? "bg-up/15 text-up" : "text-secondary-fg"}`}
            >
              YES
            </button>
            <button
              onClick={() => setSide("no")}
              className={`rounded-md py-1.5 text-xs font-semibold ${side === "no" ? "bg-down/15 text-down" : "text-secondary-fg"}`}
            >
              NO
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            <Input
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-elevated border-white/[0.06] font-mono-num"
              placeholder="SOL"
            />
            <Button
              onClick={() =>
                toast.success(`Staked ${amount} SOL on ${side.toUpperCase()}`, {
                  description: "Wallet not connected — simulation only.",
                })
              }
              className={side === "yes" ? "bg-up text-background hover:bg-up/90" : "bg-down hover:bg-down/90"}
            >
              <Sparkles className="mr-1.5 h-4 w-4" /> Stake
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
