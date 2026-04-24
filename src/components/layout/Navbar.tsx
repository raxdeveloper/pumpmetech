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
import logo from "@/assets/pumpme-logo.png";

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
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="pumpme.tech" className="h-8 w-auto brightness-0 invert" />
        </Link>

        <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/[0.08] bg-elevated/60 p-1 backdrop-blur">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-1.5 text-sm transition-colors ${
                  isActive || (l.to !== "/" && loc.pathname.startsWith(l.to))
                    ? "bg-white/10 text-foreground"
                    : "text-secondary-fg hover:text-foreground"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex text-secondary-fg hover:text-foreground hover:bg-elevated">
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
              className="btn-cta-green rounded-full px-4"
            >
              <Wallet className="mr-2 h-4 w-4" />
              {connecting ? "Connecting…" : "Sign Up"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
