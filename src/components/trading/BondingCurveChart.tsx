import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function BondingCurveChart({ history }: { history: number[] }) {
  const data = history.map((p, i) => ({ t: i, p }));
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(270 100% 64%)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="hsl(270 100% 64%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="t" hide />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{
              background: "hsl(0 0% 10%)",
              border: "1px solid hsl(0 0% 100% / 0.08)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelFormatter={() => ""}
            formatter={(v: number) => [`${v.toFixed(6)} SOL`, "Price"]}
          />
          <Area
            type="monotone"
            dataKey="p"
            stroke="hsl(270 100% 64%)"
            strokeWidth={2}
            fill="url(#curveFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
