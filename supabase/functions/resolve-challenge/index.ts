// Lovable AI challenge verifier. Inspects proof and returns a verdict.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `You are a challenge verifier for pumpme.tech. Real SOL is at stake.
Verify if the creator genuinely completed their stated challenge based on the proof provided.
Be strict. If proof is missing or weak, recommend NEEDS_MORE_INFO or REJECT.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { challengeId, handle, title, description, proofUrl, proofContent } = await req.json();
    if (!challengeId || !handle || !title) {
      return new Response(JSON.stringify({ error: "challengeId, handle, title required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const userPrompt = `Creator: @${handle}
Challenge: "${title}"
Criteria: "${description ?? "(none)"}"
Proof URL: ${proofUrl ?? "(none)"}
Proof content / notes: ${proofContent ?? "(none)"}

Return your verdict via the verify_challenge tool.`;

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
            name: "verify_challenge",
            description: "Return the challenge verification verdict.",
            parameters: {
              type: "object",
              properties: {
                verified: { type: "boolean" },
                confidence: { type: "integer", minimum: 0, maximum: 100 },
                reasoning: { type: "string" },
                recommendation: { type: "string", enum: ["APPROVE", "REJECT", "NEEDS_MORE_INFO"] },
              },
              required: ["verified", "confidence", "reasoning", "recommendation"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "verify_challenge" } },
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

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const newStatus = verdict.verified && verdict.confidence >= 70
      ? "completed"
      : verdict.recommendation === "REJECT" ? "failed" : "active";

    await supabase.from("challenges").update({
      ai_confidence: verdict.confidence,
      ai_reasoning: verdict.reasoning,
      ai_recommendation: verdict.recommendation,
      proof_url: proofUrl ?? null,
      status: newStatus,
      resolved_at: newStatus !== "active" ? new Date().toISOString() : null,
    }).eq("id", challengeId);

    return new Response(JSON.stringify({ ...verdict, status: newStatus }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
