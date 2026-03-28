import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const INVIDIOUS_INSTANCES = [
  "https://invidious.materialio.us",
  "https://yewtu.be",
  "https://vid.puffyan.us",
  "https://inv.nadeko.net",
  "https://invidious.nerdvpn.de",
];

async function tryInstances(path: string): Promise<Response> {
  let lastErr = "";
  for (const base of INVIDIOUS_INSTANCES) {
    try {
      const url = `${base}/api/v1${path}`;
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
      });
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("json")) {
        lastErr = `${base} returned non-JSON`;
        continue;
      }
      const data = await res.json();
      if (Array.isArray(data) || (data && typeof data === "object")) {
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      lastErr = `${base} returned unexpected shape`;
    } catch (e) {
      lastErr = `${base}: ${e.message}`;
    }
  }
  return new Response(JSON.stringify({ error: "All instances failed", detail: lastErr }), {
    status: 502,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.searchParams.get("path") || "/trending?region=US";
  return tryInstances(path);
});
