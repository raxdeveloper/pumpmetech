import { Link, NavLink, useLocation } from "react-router-dom";
import { Wallet, LogOut, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet, shortAddress } from "@/lib/wallet";
import { toast } from "sonner";

const links = [
  { to: "/", label: "Home" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/challenges", label: "Challenges" },
  { to: "/portfolio", label: "Portfolio" },
];

export function Navbar() {
  const loc = useLocation();
  const { publicKey, connect, disconnect, connecting, balanceSOL, hasPhantom } = useWallet();
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    if (!hasPhantom) {
      toast.error("Phantom wallet not found", { description: "Install Phantom to connect." });
    }
    await connect();
    if (publicKey || window.solana?.publicKey) toast.success("Wallet connected");
  };

  const handleCopy = async () => {
    if (!publicKey) return;
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-gradient-brand shadow-glow" />
          <span className="font-display text-lg font-semibold tracking-tight">
            pumpme<span className="text-brand-purple">.</span>tech
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive || (l.to !== "/" && loc.pathname.startsWith(l.to))
                    ? "text-foreground bg-elevated"
                    : "text-secondary-fg hover:text-foreground"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex border-white/10 bg-elevated hover:bg-hover">
            <Link to="/create">Launch token</Link>
          </Button>
          {publicKey ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="border-brand-purple/40 bg-elevated hover:bg-hover">
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-brand-green" />
                  <span className="font-mono-num">{shortAddress(publicKey)}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 border-white/10 bg-elevated">
                <DropdownMenuLabel className="text-xs text-secondary-fg">Phantom · devnet</DropdownMenuLabel>
                <div className="px-2 pb-2 text-sm">
                  <div className="font-mono-num">{shortAddress(publicKey, 6)}</div>
                  <div className="mt-1 font-mono-num text-xs text-secondary-fg">
                    {balanceSOL === null ? "–" : `${balanceSOL.toFixed(4)} SOL`}
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={handleCopy} className="cursor-pointer">
                  {copied ? <Check className="mr-2 h-4 w-4 text-brand-green" /> : <Copy className="mr-2 h-4 w-4" />}
                  {copied ? "Copied" : "Copy address"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={disconnect} className="cursor-pointer text-down">
                  <LogOut className="mr-2 h-4 w-4" /> Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              onClick={handleConnect}
              disabled={connecting}
              className="bg-gradient-brand text-white hover:opacity-90 shadow-glow"
            >
              <Wallet className="mr-2 h-4 w-4" />
              {connecting ? "Connecting…" : "Connect"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
