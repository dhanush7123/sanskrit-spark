import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { word } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("API key not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a Sanskrit Scholar. When given a word, provide: 1. Devanagari spelling 2. Etymology (Root/Dhatu) 3. Cultural significance 4. A simple usage sentence. Keep responses concise and beautiful." },
          { role: "user", content: `Explain the Sanskrit connection for: ${word}` }
        ],
      }),
    });

    if (!response.ok) throw new Error("AI request failed");
    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "No wisdom found.";

    return new Response(JSON.stringify({ result }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("Oracle error:", e);
    return new Response(JSON.stringify({ error: "The Oracle is meditating..." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
