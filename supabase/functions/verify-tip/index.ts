import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const EXPECTED_WALLET = "8akGLGMFwBcYTnPHXMbNMJxdZLfQvRCqa3FvUgzGsEPj";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    const anonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
    const supabaseUser = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { tx_signature, post_id, recipient_id, amount_sol } = await req.json();
    if (!tx_signature || !post_id || !recipient_id || !amount_sol) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const expectedLamports = Math.round(amount_sol * 1_000_000_000);

    // Verify on Solana
    const rpcRes = await fetch("https://solana-mainnet.g.alchemy.com/v2/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0", id: 1,
        method: "getTransaction",
        params: [tx_signature, { encoding: "jsonParsed", maxSupportedTransactionVersion: 0 }],
      }),
    });

    const rpcData = await rpcRes.json();
    const tx = rpcData?.result;

    if (!tx) {
      return new Response(JSON.stringify({ error: "Transaction not found. Try again shortly." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (tx.meta?.err) {
      return new Response(JSON.stringify({ error: "Transaction failed on-chain" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const instructions = tx.transaction?.message?.instructions || [];
    let verified = false;
    for (const ix of instructions) {
      if (ix.parsed?.type === "transfer" && ix.program === "system") {
        const info = ix.parsed.info;
        if (info.destination === EXPECTED_WALLET && Number(info.lamports) >= expectedLamports) {
          verified = true;
          break;
        }
      }
    }

    if (!verified) {
      return new Response(JSON.stringify({ error: "Transaction does not contain a valid transfer" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check duplicate
    const { data: existing } = await supabaseAdmin
      .from("tips")
      .select("id")
      .eq("tx_signature", tx_signature)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ error: "Transaction already used" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Record tip
    await supabaseAdmin.from("tips").insert({
      post_id,
      tipper_id: user.id,
      recipient_id,
      amount_sol,
      tx_signature,
    });

    // Send notification
    await supabaseAdmin.from("notifications").insert({
      user_id: recipient_id,
      actor_id: user.id,
      type: "tip",
      post_id,
    });

    return new Response(JSON.stringify({ success: true, message: "Tip verified!" }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
