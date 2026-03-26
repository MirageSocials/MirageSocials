import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const EXPECTED_WALLET = "8akGLGMFwBcYTnPHXMbNMJxdZLfQvRCqa3FvUgzGsEPj";
const EXPECTED_LAMPORTS = 100_000_000; // 0.10 SOL in lamports

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    // Get user from JWT
    const anonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
    const supabaseUser = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { tx_signature, desired_username } = await req.json();
    if (!tx_signature || !desired_username) {
      return new Response(JSON.stringify({ error: "Missing tx_signature or desired_username" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify transaction on Solana mainnet
    const rpcRes = await fetch("https://api.mainnet-beta.solana.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTransaction",
        params: [tx_signature, { encoding: "jsonParsed", maxSupportedTransactionVersion: 0 }],
      }),
    });

    const rpcData = await rpcRes.json();
    const tx = rpcData?.result;

    if (!tx) {
      return new Response(JSON.stringify({ error: "Transaction not found. It may still be confirming — try again in a moment." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (tx.meta?.err) {
      return new Response(JSON.stringify({ error: "Transaction failed on-chain" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check that the transaction includes a transfer to the expected wallet of at least the expected amount
    const instructions = tx.transaction?.message?.instructions || [];
    let verified = false;

    for (const ix of instructions) {
      if (ix.parsed?.type === "transfer" && ix.program === "system") {
        const info = ix.parsed.info;
        if (
          info.destination === EXPECTED_WALLET &&
          Number(info.lamports) >= EXPECTED_LAMPORTS
        ) {
          verified = true;
          break;
        }
      }
    }

    if (!verified) {
      return new Response(JSON.stringify({ error: "Transaction does not contain a valid 0.10 SOL transfer to the expected wallet" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check for duplicate tx_signature usage
    const { data: existing } = await supabaseAdmin
      .from("username_reservations")
      .select("id")
      .eq("tx_signature", tx_signature)
      .eq("status", "approved")
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ error: "This transaction has already been used" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Approve reservation and update username
    await supabaseAdmin
      .from("username_reservations")
      .update({ status: "approved" })
      .eq("user_id", user.id)
      .eq("desired_username", desired_username)
      .eq("tx_signature", tx_signature);

    // Update the user's profile username
    await supabaseAdmin
      .from("profiles")
      .update({ username: desired_username })
      .eq("user_id", user.id);

    return new Response(JSON.stringify({ success: true, message: "Username reserved successfully!" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
