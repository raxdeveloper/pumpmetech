// Lightweight Phantom wallet hook (read-only, devnet RPC).
// Uses window.solana directly — no wallet-adapter dep needed for this scope.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js";

interface PhantomProvider {
  isPhantom?: boolean;
  publicKey?: { toString(): string } | null;
  isConnected?: boolean;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString(): string } }>;
  disconnect: () => Promise<void>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window { solana?: PhantomProvider }
}

interface WalletCtx {
  publicKey: string | null;
  connecting: boolean;
  balanceSOL: number | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  hasPhantom: boolean;
}

const Ctx = createContext<WalletCtx | null>(null);
const RPC_URL = clusterApiUrl("devnet");

export function WalletProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [balanceSOL, setBalanceSOL] = useState<number | null>(null);
  const [hasPhantom, setHasPhantom] = useState(false);

  const connection = useMemo(() => new Connection(RPC_URL, "confirmed"), []);

  useEffect(() => {
    const provider = window.solana;
    setHasPhantom(!!provider?.isPhantom);
    if (!provider?.isPhantom) return;

    // Eager connect if already trusted
    provider.connect({ onlyIfTrusted: true })
      .then((r) => setPublicKey(r.publicKey.toString()))
      .catch(() => { /* not trusted yet */ });

    const onConnect = () => provider.publicKey && setPublicKey(provider.publicKey.toString());
    const onDisconnect = () => { setPublicKey(null); setBalanceSOL(null); };
    provider.on("connect", onConnect);
    provider.on("disconnect", onDisconnect);
    return () => {
      provider.removeListener?.("connect", onConnect);
      provider.removeListener?.("disconnect", onDisconnect);
    };
  }, []);

  // Fetch balance whenever pubkey changes
  useEffect(() => {
    if (!publicKey) { setBalanceSOL(null); return; }
    let cancelled = false;
    (async () => {
      try {
        const lamports = await connection.getBalance(new PublicKey(publicKey));
        if (!cancelled) setBalanceSOL(lamports / LAMPORTS_PER_SOL);
      } catch (e) {
        console.warn("balance fetch failed", e);
        if (!cancelled) setBalanceSOL(null);
      }
    })();
    return () => { cancelled = true; };
  }, [publicKey, connection]);

  const connect = useCallback(async () => {
    const provider = window.solana;
    if (!provider?.isPhantom) {
      window.open("https://phantom.app/", "_blank", "noopener,noreferrer");
      return;
    }
    setConnecting(true);
    try {
      const r = await provider.connect();
      setPublicKey(r.publicKey.toString());
    } catch (e) {
      console.warn("connect rejected", e);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try { await window.solana?.disconnect(); } catch { /* ignore */ }
    setPublicKey(null); setBalanceSOL(null);
  }, []);

  const value: WalletCtx = { publicKey, connecting, balanceSOL, connect, disconnect, hasPhantom };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWallet() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}

export function shortAddress(pk: string, n = 4) {
  return `${pk.slice(0, n)}…${pk.slice(-n)}`;
}
