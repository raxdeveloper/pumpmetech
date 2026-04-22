import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Check, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

const STEPS = ["Identity", "X account", "Bio & token", "Confirm"] as const;

export default function CreateWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    displayName: "",
    handle: "",
    xHandle: "",
    bio: "",
    tokenSymbol: "",
  });

  const set = (k: keyof typeof data, v: string) => setData((p) => ({ ...p, [k]: v }));

  const canNext =
    (step === 0 && data.displayName && data.handle) ||
    (step === 1 && data.xHandle) ||
    (step === 2 && data.bio && data.tokenSymbol) ||
    step === 3;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-2xl py-10">
        <span className="label-eyebrow text-brand-purple">Launch</span>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">Mint your creator token.</h1>
        <p className="mt-2 text-secondary-fg">4 steps. ~30 seconds. Your AI score starts the moment you ship.</p>

        {/* Stepper */}
        <div className="mt-8 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                i < step ? "bg-brand-green text-background" : i === step ? "bg-gradient-brand text-white" : "bg-elevated text-tertiary-fg"
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-xs ${i === step ? "text-foreground" : "text-tertiary-fg"}`}>{s}</span>
              {i < STEPS.length - 1 && <div className="ml-1 h-px flex-1 bg-white/[0.06]" />}
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-white/[0.06] bg-surface p-6 shadow-card animate-fade-in">
          {step === 0 && (
            <div className="space-y-4">
              <Field label="Display name">
                <Input value={data.displayName} onChange={(e) => set("displayName", e.target.value)} placeholder="Naval" className="bg-elevated border-white/[0.06]" />
              </Field>
              <Field label="Handle (URL slug)">
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-white/[0.06] bg-elevated px-3 text-sm text-secondary-fg">pumpme.tech/c/</span>
                  <Input value={data.handle} onChange={(e) => set("handle", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} placeholder="naval" className="rounded-l-none bg-elevated border-white/[0.06]" />
                </div>
              </Field>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <Field label="X handle">
                <Input value={data.xHandle} onChange={(e) => set("xHandle", e.target.value.replace(/^@/, ""))} placeholder="naval" className="bg-elevated border-white/[0.06]" />
              </Field>
              <p className="text-xs text-secondary-fg">
                We'll use Twitter/X public metrics to score your momentum every 6h. No DMs, no private data.
              </p>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <Field label="Token symbol">
                <Input
                  value={data.tokenSymbol}
                  onChange={(e) => set("tokenSymbol", e.target.value.toUpperCase().slice(0, 6))}
                  placeholder="NAVAL"
                  className="bg-elevated border-white/[0.06] font-display font-semibold"
                />
              </Field>
              <Field label="Bio">
                <Textarea
                  value={data.bio}
                  onChange={(e) => set("bio", e.target.value)}
                  placeholder="What you're building, in one line."
                  rows={3}
                  className="bg-elevated border-white/[0.06]"
                />
              </Field>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3">
              <Row k="Display name" v={data.displayName} />
              <Row k="Profile" v={`pumpme.tech/c/${data.handle}`} />
              <Row k="X" v={`@${data.xHandle}`} />
              <Row k="Symbol" v={`$${data.tokenSymbol}`} />
              <Row k="Bio" v={data.bio} />
              <div className="mt-4 rounded-lg bg-gradient-brand-soft border border-brand-purple/30 p-4 text-sm">
                <Sparkles className="inline h-4 w-4 text-brand-purple" />{" "}
                Your token launches with 0 supply on a quadratic bonding curve. Initial price is 0 SOL — first buyer mints supply.
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
            className="border-white/10 bg-elevated hover:bg-hover"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button
              disabled={!canNext}
              onClick={() => setStep((s) => s + 1)}
              className="bg-gradient-brand text-white hover:opacity-90 shadow-glow"
            >
              Next <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          ) : (
            <Button
              className="bg-gradient-brand text-white hover:opacity-90 shadow-glow"
              onClick={() => {
                toast.success("Token launch simulated", { description: "Connect wallet to deploy on devnet." });
                navigate("/leaderboard");
              }}
            >
              Launch ${data.tokenSymbol || "TOKEN"} <Sparkles className="ml-1.5 h-4 w-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label-eyebrow text-tertiary-fg">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-white/[0.04] py-2 text-sm">
      <span className="text-secondary-fg">{k}</span>
      <span className="font-medium text-right max-w-[60%] truncate">{v || <span className="text-tertiary-fg">—</span>}</span>
    </div>
  );
}
