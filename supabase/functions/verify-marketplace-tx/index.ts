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

    const { tx_signature, listing_id, expected_lamports } = await req.json();
    if (!tx_signature || !listing_id || !expected_lamports) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get listing
    const { data: listing } = await supabaseAdmin
      .from("marketplace_listings")
      .select("*")
      .eq("id", listing_id)
      .eq("status", "active")
      .single();

    if (!listing) {
      return new Response(JSON.stringify({ error: "Listing not found or already sold" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify transaction on Solana
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
      return new Response(JSON.stringify({ error: "Transaction not found. Try again in a moment." }), {
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
        if (info.destination === EXPECTED_WALLET && Number(info.lamports) >= expected_lamports) {
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
      .from("marketplace_transactions")
      .select("id")
      .eq("tx_signature", tx_signature)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ error: "Transaction already used" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Record transaction
    await supabaseAdmin.from("marketplace_transactions").insert({
      listing_id: listing.id,
      buyer_id: user.id,
      seller_id: listing.seller_id,
      type: listing.type,
      amount_sol: listing.price_sol,
      tx_signature,
    });

    // Mark listing as sold
    await supabaseAdmin.from("marketplace_listings").update({ status: "sold" }).eq("id", listing.id);

    // If username sale, transfer username to buyer
    if (listing.type === "username" && listing.username_for_sale) {
      await supabaseAdmin.from("profiles").update({ username: listing.username_for_sale }).eq("user_id", user.id);
      // Remove username from seller
      await supabaseAdmin.from("profiles").update({ username: null }).eq("user_id", listing.seller_id);
    }

    return new Response(JSON.stringify({ success: true, message: "Purchase verified!" }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
