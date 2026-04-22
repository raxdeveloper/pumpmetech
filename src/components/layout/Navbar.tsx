import { Link, NavLink, useLocation } from "react-router-dom";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Home" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/challenges", label: "Challenges" },
  { to: "/portfolio", label: "Portfolio" },
];

export function Navbar() {
  const loc = useLocation();
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
          <Button size="sm" className="bg-gradient-brand text-white hover:opacity-90 shadow-glow">
            <Wallet className="mr-2 h-4 w-4" />
            Connect
          </Button>
        </div>
      </div>
    </header>
  );
}
