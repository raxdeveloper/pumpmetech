import { tierForScore } from "./tiers";

export interface MockCreator {
  handle: string;
  displayName: string;
  tokenSymbol: string;
  initials: string;
  bio: string;
  avatarColor: string;
  xHandle: string;
  xVerified: boolean;
  momentumScore: number;
  momentumTrend: "up" | "down" | "stable";
  momentumReasoning: string;
  priceSOL: number;
  priceChange24h: number;
  priceHistory: number[];
  supply: number;
  solReserves: number;
  marketCapSOL: number;
  holderCount: number;
  volumeSOL: number;
  challengeCompletions: number;
  isGraduated: boolean;
}

function buildPriceHistory(base: number, vol: number, n = 24): number[] {
  const arr: number[] = [];
  let p = base;
  for (let i = 0; i < n; i++) {
    p = Math.max(0.0001, p * (1 + (Math.random() - 0.5) * vol));
    arr.push(p);
  }
  return arr;
}

const seeds: Array<Partial<MockCreator> & { handle: string; displayName: string; tokenSymbol: string; initials: string; bio: string; avatarColor: string; xHandle: string; momentumScore: number; priceSOL: number; }> = [
  { handle: "naval", displayName: "Naval", tokenSymbol: "NAVAL", initials: "NA", bio: "Wealth without luck.", avatarColor: "#14F195", xHandle: "@naval", momentumScore: 94, priceSOL: 0.0421 },
  { handle: "vitalik", displayName: "Vitalik", tokenSymbol: "VITA", initials: "VI", bio: "Building Ethereum, posting memes.", avatarColor: "#9945FF", xHandle: "@VitalikButerin", momentumScore: 88, priceSOL: 0.0312 },
  { handle: "pmarca", displayName: "Marc Andreessen", tokenSymbol: "PMRC", initials: "MA", bio: "It's time to build.", avatarColor: "#00C2FF", xHandle: "@pmarca", momentumScore: 76, priceSOL: 0.0188 },
  { handle: "balaji", displayName: "Balaji", tokenSymbol: "BLJI", initials: "BS", bio: "The Network State.", avatarColor: "#FFB800", xHandle: "@balajis", momentumScore: 82, priceSOL: 0.0254 },
  { handle: "punk6529", displayName: "6529", tokenSymbol: "6529", initials: "65", bio: "Open metaverse maxi.", avatarColor: "#9945FF", xHandle: "@punk6529", momentumScore: 71, priceSOL: 0.0149 },
  { handle: "cobie", displayName: "Cobie", tokenSymbol: "COBI", initials: "CO", bio: "UpOnly. Crypto chad.", avatarColor: "#14F195", xHandle: "@cobie", momentumScore: 67, priceSOL: 0.0098 },
  { handle: "hsaka", displayName: "Hsaka", tokenSymbol: "HSKA", initials: "HS", bio: "Charts and vibes.", avatarColor: "#00C2FF", xHandle: "@HsakaTrades", momentumScore: 58, priceSOL: 0.0072 },
  { handle: "loomdart", displayName: "Loomdart", tokenSymbol: "LOOM", initials: "LD", bio: "Anon trader, lord of memes.", avatarColor: "#9945FF", xHandle: "@loomdart", momentumScore: 49, priceSOL: 0.0044 },
  { handle: "tarun", displayName: "Tarun Chitra", tokenSymbol: "TRUN", initials: "TC", bio: "Gauntlet. DeFi research.", avatarColor: "#14F195", xHandle: "@tarunchitra", momentumScore: 64, priceSOL: 0.0081 },
  { handle: "cobratate", displayName: "Sun Tzu", tokenSymbol: "STZU", initials: "SZ", bio: "Build the network state.", avatarColor: "#FFB800", xHandle: "@suntzu", momentumScore: 38, priceSOL: 0.0021 },
  { handle: "anatoly", displayName: "Toly", tokenSymbol: "TOLY", initials: "TY", bio: "Solana co-founder.", avatarColor: "#14F195", xHandle: "@aeyakovenko", momentumScore: 100, priceSOL: 0.0892 },
  { handle: "mert", displayName: "Mert", tokenSymbol: "MERT", initials: "ME", bio: "Helius CEO. Solana max.", avatarColor: "#9945FF", xHandle: "@0xMert_", momentumScore: 91, priceSOL: 0.0512 },
];

export const MOCK_CREATORS: MockCreator[] = seeds.map((s) => {
  const isGraduated = s.momentumScore >= 100;
  const supply = Math.sqrt((2 * s.priceSOL) / 1e-9) || 0;
  const solReserves = (1e-9 / 2) * supply * supply;
  const marketCapSOL = (1e-9 / 2) * supply * supply;
  const change = (Math.random() - 0.3) * 40;
  return {
    ...s,
    momentumTrend: change > 5 ? "up" : change < -5 ? "down" : "stable",
    momentumReasoning:
      s.momentumScore >= 80
        ? "Viral activity, daily posting, strong engagement growth."
        : s.momentumScore >= 60
        ? "Consistent posting, healthy engagement."
        : s.momentumScore >= 40
        ? "Moderate activity, slight decline."
        : "Quiet week, low engagement.",
    priceChange24h: parseFloat(change.toFixed(2)),
    priceHistory: buildPriceHistory(s.priceSOL, 0.06),
    supply,
    solReserves,
    marketCapSOL,
    holderCount: Math.floor(50 + s.momentumScore * 20 + Math.random() * 500),
    volumeSOL: parseFloat((s.momentumScore * 0.5 + Math.random() * 20).toFixed(2)),
    challengeCompletions: Math.floor(Math.random() * 12),
    isGraduated,
  } as MockCreator;
});

export function getCreatorByHandle(handle: string): MockCreator | undefined {
  return MOCK_CREATORS.find((c) => c.handle === handle);
}

export function tierFor(c: MockCreator) {
  return tierForScore(c.momentumScore, c.isGraduated);
}

// Mock challenges
export interface MockChallenge {
  id: string;
  creatorHandle: string;
  title: string;
  description: string;
  rewardBps: number;
  deadline: Date;
  stakeYesSOL: number;
  stakeNoSOL: number;
  status: "active" | "completed" | "failed";
}

export const MOCK_CHALLENGES: MockChallenge[] = [
  { id: "1", creatorHandle: "naval", title: "Ship 7 podcasts in 7 days", description: "Publish one new podcast episode every day for a week.", rewardBps: 500, deadline: new Date(Date.now() + 4 * 86400000), stakeYesSOL: 12.4, stakeNoSOL: 3.2, status: "active" },
  { id: "2", creatorHandle: "vitalik", title: "EIP draft published on GitHub", description: "Submit a new EIP draft to the ethereum/EIPs repo.", rewardBps: 300, deadline: new Date(Date.now() + 2 * 86400000), stakeYesSOL: 28.1, stakeNoSOL: 5.4, status: "active" },
  { id: "3", creatorHandle: "mert", title: "10K new followers in 30 days", description: "Net +10,000 followers on X within 30 days from challenge start.", rewardBps: 800, deadline: new Date(Date.now() + 18 * 86400000), stakeYesSOL: 6.8, stakeNoSOL: 9.1, status: "active" },
  { id: "4", creatorHandle: "balaji", title: "Network State summit IRL", description: "Host an in-person Network State summit with >100 attendees.", rewardBps: 1000, deadline: new Date(Date.now() + 25 * 86400000), stakeYesSOL: 18.0, stakeNoSOL: 11.5, status: "active" },
  { id: "5", creatorHandle: "anatoly", title: "Mainnet performance milestone", description: "Achieve sustained 65k+ TPS on Solana mainnet.", rewardBps: 200, deadline: new Date(Date.now() - 2 * 86400000), stakeYesSOL: 44.0, stakeNoSOL: 2.1, status: "completed" },
  { id: "6", creatorHandle: "cobie", title: "Drop a new UpOnly episode", description: "Publish a new UpOnly podcast within 14 days.", rewardBps: 400, deadline: new Date(Date.now() + 9 * 86400000), stakeYesSOL: 5.2, stakeNoSOL: 4.8, status: "active" },
];
