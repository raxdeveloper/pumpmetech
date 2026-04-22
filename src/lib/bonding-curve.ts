// Pump.fun-style quadratic bonding curve. DO NOT change formula.
export const K = 0.000000001; // 1e-9
export const GRADUATION_SOL = 69;

export function getTokensOut(solReserves: number, solIn: number): number {
  const before = Math.sqrt((2 * solReserves) / K);
  const after = Math.sqrt((2 * (solReserves + solIn)) / K);
  return Math.max(0, after - before);
}

export function getSolOut(supply: number, tokensIn: number): number {
  const after = Math.max(0, supply - tokensIn);
  return (K / 2) * (supply ** 2 - after ** 2);
}

export function getPrice(supply: number): number {
  return K * supply;
}

export function getMarketCap(supply: number): number {
  return (K / 2) * supply ** 2;
}

export function getGradProgress(supply: number): number {
  return Math.min(100, (getMarketCap(supply) / GRADUATION_SOL) * 100);
}

export function getPriceImpact(supply: number, solIn: number, reserves: number): number {
  const cur = getPrice(supply);
  if (cur === 0) return 0;
  const out = getTokensOut(reserves, solIn);
  const next = getPrice(supply + out);
  return ((next - cur) / cur) * 100;
}

export function formatSOL(n: number, digits = 4): string {
  if (n === 0) return "0";
  if (n < 0.0001) return n.toExponential(2);
  if (n < 1) return n.toFixed(digits);
  if (n < 1000) return n.toFixed(2);
  if (n < 1_000_000) return (n / 1000).toFixed(2) + "K";
  return (n / 1_000_000).toFixed(2) + "M";
}

export function formatTokens(n: number): string {
  if (n < 1000) return n.toFixed(0);
  if (n < 1_000_000) return (n / 1000).toFixed(2) + "K";
  if (n < 1_000_000_000) return (n / 1_000_000).toFixed(2) + "M";
  return (n / 1_000_000_000).toFixed(2) + "B";
}
