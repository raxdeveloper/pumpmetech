import { Link } from "react-router-dom";
import { Wallet, LogOut, Copy, Check, Twitter } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet, shortAddress } from "@/lib/wallet";
import { toast } from "sonner";
import logo from "@/assets/pumpme-logo.png";

export function Navbar() {
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
    <header className="absolute top-0 left-0 right-0 z-40">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo — large & visible */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="pumpme.tech"
            className="h-12 md:h-14 w-auto brightness-0 invert drop-shadow-[0_2px_8px_rgba(20,241,149,0.25)]"
          />
        </Link>

        {/* Right cluster — X link + Sign Up, like creator.fun */}
        <div className="flex items-center gap-2">
          <a
            href="https://x.com/pumpmetech"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-md border border-white/10 bg-background/40 px-4 py-2 text-sm text-secondary-fg backdrop-blur transition-colors hover:text-foreground hover:border-white/20"
          >
            <Twitter className="h-4 w-4" />
            @pumpmetech
          </a>

          {publicKey ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="rounded-md border-white/10 bg-background/40 backdrop-blur hover:bg-hover">
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />
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
                  {copied ? <Check className="mr-2 h-4 w-4 text-primary" /> : <Copy className="mr-2 h-4 w-4" />}
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
              variant="outline"
              className="rounded-md border-white/15 bg-background/40 px-5 py-2 text-sm font-medium backdrop-blur hover:bg-elevated hover:border-white/30"
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
