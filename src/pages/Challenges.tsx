import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { MOCK_CHALLENGES, getCreatorByHandle } from "@/lib/mock-data";
import { ChallengeCard } from "@/components/creator/ChallengeCard";

type Filter = "all" | "active" | "completed" | "failed";

export default function Challenges() {
  const [f, setF] = useState<Filter>("active");
  const list = MOCK_CHALLENGES.filter((c) => f === "all" || c.status === f);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <span className="label-eyebrow text-brand-green">Prediction markets</span>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">Stake on creator challenges.</h1>
        <p className="mt-2 max-w-2xl text-secondary-fg">
          Each challenge is a YES/NO market. Stake SOL on either side. Claude verifies the proof — winners split the pot, minus 1% protocol fee.
        </p>

        <div className="mt-6 flex gap-1 rounded-lg border border-white/[0.06] bg-surface p-1 w-fit">
          {(["active", "completed", "failed", "all"] as Filter[]).map((opt) => (
            <button
              key={opt}
              onClick={() => setF(opt)}
              className={`rounded-md px-3 py-1.5 text-sm capitalize transition-colors ${
                f === opt ? "bg-elevated text-foreground" : "text-secondary-fg hover:text-foreground"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((ch) => {
            const creator = getCreatorByHandle(ch.creatorHandle);
            return <ChallengeCard key={ch.id} ch={ch} creatorName={creator?.displayName} />;
          })}
        </div>
      </main>
    </div>
  );
}
