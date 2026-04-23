// Lovable AI momentum oracle. Scores a creator 0-100 from social signals.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `You are an on-chain reputation oracle for pumpme.tech.
Score creator momentum 0-100. 80-100 = viral + daily + milestones.
60-79 = consistent. 40-59 = moderate. 20-39 = inconsistent.
0-19 = ghost / failures. Quality > quantity.`;

function tierFromScore(score: number, isGraduated: boolean) {
  if (isGraduated || score >= 100) return "Graduate";
  if (score >= 81) return "Platinum";
  if (score >= 61) return "Gold";
  if (score >= 31) return "Silver";
  return "Bronze";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { handle, signals } = await req.json();
    if (!handle) {
      return new Response(JSON.stringify({ error: "handle required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const userPrompt = `Score @${handle}.
Signals: posts_7d=${signals?.posts_7d ?? 0}, impressions_7d=${signals?.impressions_7d ?? 0}, follower_delta_7d=${signals?.follower_delta_7d ?? 0}, hours_since_last=${signals?.hours_since_last ?? 999}, best_post_impressions=${signals?.best_post_impressions ?? 0}, challenges_done=${signals?.challenges_done ?? 0}, viral=${signals?.viral ?? false}.
Return your verdict via the score_creator tool.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "score_creator",
            description: "Return creator momentum verdict.",
            parameters: {
              type: "object",
              properties: {
                score: { type: "integer", minimum: 0, maximum: 100 },
                trend: { type: "string", enum: ["rising", "stable", "falling"] },
                reasoning: { type: "string" },
                key_signal: { type: "string" },
              },
              required: ["score", "trend", "reasoning", "key_signal"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "score_creator" } },
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in Lovable workspace." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResp.text();
      console.error("AI gateway error", aiResp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiResp.json();
    const call = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) throw new Error("No tool call returned");
    const verdict = JSON.parse(call.function.arguments);

    // Persist
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: existing } = await supabase
      .from("creators").select("is_graduated").eq("handle", handle).maybeSingle();
    const tier = tierFromScore(verdict.score, existing?.is_graduated ?? false);

    const { error } = await supabase.from("creators").update({
      momentum_score: verdict.score,
      momentum_trend: verdict.trend,
      momentum_reasoning: verdict.reasoning,
      badge_tier: tier,
      last_scored_at: new Date().toISOString(),
    }).eq("handle", handle);
    if (error) console.error("update error", error);

    return new Response(JSON.stringify({ ...verdict, tier }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
