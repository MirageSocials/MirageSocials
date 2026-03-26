import { useState, useEffect } from "react";
import { ArrowLeft, Tag, User, MessageCircle, DollarSign, Plus, X, Loader2, Copy, Check, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import AppLayout from "@/components/AppLayout";

const RECEIVING_WALLET = "8akGLGrkuwYfCuPHvq2G3RiJecD6eFVrNScArQUvTnTf";

interface Listing {
  id: string;
  seller_id: string;
  type: string;
  post_id: string | null;
  username_for_sale: string | null;
  price_sol: number;
  status: string;
  created_at: string;
  seller_profile?: { display_name: string | null; username: string | null; avatar_url: string | null };
}

const Marketplace = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"usernames" | "posts" | "my-listings">("usernames");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createType, setCreateType] = useState<"username" | "post">("username");
  const [createUsername, setCreateUsername] = useState("");
  const [createPrice, setCreatePrice] = useState("");
  const [creating, setCreating] = useState(false);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [txSig, setTxSig] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    fetchListings();
    if (user) fetchWallet();
  }, [tab, user]);

  const fetchWallet = async () => {
    if (!user) return;
    const { data } = await supabase.from("profiles").select("wallet_address").eq("user_id", user.id).single();
    if (data?.wallet_address) setWalletAddress(data.wallet_address);
  };

  const fetchListings = async () => {
    setLoading(true);
    let query = supabase.from("marketplace_listings").select("*").order("created_at", { ascending: false });

    if (tab === "usernames") {
      query = query.eq("type", "username").eq("status", "active");
    } else if (tab === "posts") {
      query = query.eq("type", "post").eq("status", "active");
    } else if (tab === "my-listings" && user) {
      query = query.eq("seller_id", user.id);
    }

    const { data } = await query;
    if (data) {
      const sellerIds = [...new Set(data.map((l: any) => l.seller_id))];
      const { data: profiles } = await supabase.from("profiles").select("user_id, display_name, username, avatar_url").in("user_id", sellerIds);
      const profileMap = Object.fromEntries((profiles || []).map((p) => [p.user_id, p]));
      setListings(data.map((l: any) => ({ ...l, seller_profile: profileMap[l.seller_id] })));
    }
    setLoading(false);
  };

  const createListing = async () => {
    if (!user) return;
    if (!createPrice || parseFloat(createPrice) <= 0) { toast.error("Set a valid price"); return; }
    if (createType === "username" && !createUsername.trim()) { toast.error("Enter a username"); return; }

    setCreating(true);
    const { error } = await supabase.from("marketplace_listings").insert({
      seller_id: user.id,
      type: createType,
      username_for_sale: createType === "username" ? createUsername.toLowerCase() : null,
      price_sol: parseFloat(createPrice),
    } as any);

    if (error) {
      toast.error("Failed to create listing");
    } else {
      toast.success("Listing created!");
      setShowCreate(false);
      setCreateUsername("");
      setCreatePrice("");
      fetchListings();
    }
    setCreating(false);
  };

  const cancelListing = async (id: string) => {
    await supabase.from("marketplace_listings").update({ status: "cancelled" } as any).eq("id", id);
    toast.success("Listing cancelled");
    fetchListings();
  };

  const copyWallet = () => {
    navigator.clipboard.writeText(RECEIVING_WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submitPurchase = async () => {
    if (!user || !buyingId || !txSig.trim()) return;
    setSubmitting(true);

    const listing = listings.find((l) => l.id === buyingId);
    if (!listing) { setSubmitting(false); return; }

    try {
      const { data, error } = await supabase.functions.invoke("verify-marketplace-tx", {
        body: {
          tx_signature: txSig.trim(),
          listing_id: buyingId,
          expected_lamports: Math.round(listing.price_sol * 1_000_000_000),
        },
      });

      if (error || data?.error) {
        toast.error(data?.error || "Verification failed");
      } else {
        toast.success(data?.message || "Purchase verified!");
        setBuyingId(null);
        setTxSig("");
        fetchListings();
      }
    } catch {
      toast.error("Verification service unavailable");
    }
    setSubmitting(false);
  };

  const tabs = [
    { id: "usernames" as const, label: "Usernames", icon: User },
    { id: "posts" as const, label: "Posts", icon: MessageCircle },
    { id: "my-listings" as const, label: "My Listings", icon: Tag },
  ];

  return (
    <AppLayout>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground">Marketplace</h1>
          </div>
        </div>
        {user && (
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-lg hover:brightness-110 transition-all">
            <Plus className="h-3.5 w-3.5" />
            List
          </button>
        )}
      </div>

      {/* Wallet address setting */}
      {user && (
        <div className="px-4 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <input
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Your SOL wallet address (to receive payments)"
              className="flex-1 bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
            />
            <button
              onClick={async () => {
                await supabase.from("profiles").update({ wallet_address: walletAddress } as any).eq("user_id", user.id);
                toast.success("Wallet saved");
              }}
              className="text-xs bg-secondary text-foreground px-3 py-1.5 rounded-lg hover:bg-secondary/80 transition-colors font-medium"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors border-b-2 ${
              tab === t.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Listings */}
      <div className="divide-y divide-border">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No listings yet
          </div>
        ) : (
          listings.map((listing) => (
            <div key={listing.id} className="px-4 py-3 hover:bg-secondary/20 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {listing.seller_profile?.avatar_url ? (
                    <img src={listing.seller_profile.avatar_url} alt="" className="w-9 h-9 rounded-lg object-cover ring-1 ring-border" />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center text-xs font-bold text-primary font-mono">
                      {(listing.seller_profile?.display_name || "U")[0]?.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">
                        {listing.type === "username" ? `@${listing.username_for_sale}` : "Post"}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        listing.status === "active" ? "bg-positive/15 text-positive" :
                        listing.status === "sold" ? "bg-primary/15 text-primary" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {listing.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      by {listing.seller_profile?.display_name || "User"} · {listing.type}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-foreground font-mono">{listing.price_sol} SOL</p>
                  {listing.status === "active" && user && user.id !== listing.seller_id && (
                    <button
                      onClick={() => setBuyingId(listing.id)}
                      className="text-xs bg-primary text-primary-foreground font-bold px-3 py-1 rounded-lg mt-1 hover:brightness-110 transition-all"
                    >
                      Buy
                    </button>
                  )}
                  {listing.status === "active" && user?.id === listing.seller_id && (
                    <button
                      onClick={() => cancelListing(listing.id)}
                      className="text-xs text-destructive hover:underline mt-1"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create listing modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-card border border-border rounded-xl w-full max-w-md p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground">Create Listing</h2>
              <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                {(["username", "post"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setCreateType(t)}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                      createType === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {t === "username" ? "Username" : "Post"}
                  </button>
                ))}
              </div>

              {createType === "username" && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Username to sell</label>
                  <div className="flex items-center">
                    <span className="text-muted-foreground text-sm mr-1">@</span>
                    <input
                      value={createUsername}
                      onChange={(e) => setCreateUsername(e.target.value.toLowerCase())}
                      placeholder="username"
                      className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Price (SOL)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={createPrice}
                  onChange={(e) => setCreatePrice(e.target.value)}
                  placeholder="0.10"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                />
              </div>

              <button
                onClick={createListing}
                disabled={creating}
                className="w-full bg-primary text-primary-foreground font-bold text-sm py-2.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {creating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {creating ? "Creating..." : "Create Listing"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buy modal */}
      {buyingId && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => { setBuyingId(null); setTxSig(""); }}>
          <div className="bg-card border border-border rounded-xl w-full max-w-md p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground">Complete Purchase</h2>
              <button onClick={() => { setBuyingId(null); setTxSig(""); }} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>

            {(() => {
              const listing = listings.find((l) => l.id === buyingId);
              if (!listing) return null;
              return (
                <div className="space-y-4">
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <p className="text-sm text-muted-foreground">You're buying</p>
                    <p className="font-bold text-lg text-foreground mt-1">
                      {listing.type === "username" ? `@${listing.username_for_sale}` : "Post"}
                    </p>
                    <p className="font-mono text-primary font-bold">{listing.price_sol} SOL</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Send exactly {listing.price_sol} SOL to:</p>
                    <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
                      <code className="text-xs text-foreground flex-1 break-all font-mono">{RECEIVING_WALLET}</code>
                      <button onClick={copyWallet} className="shrink-0 p-1 hover:bg-secondary rounded transition-colors">
                        {copied ? <Check className="h-4 w-4 text-positive" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Paste your transaction signature:</p>
                    <input
                      value={txSig}
                      onChange={(e) => setTxSig(e.target.value)}
                      placeholder="Solana tx signature..."
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <button
                    onClick={submitPurchase}
                    disabled={!txSig.trim() || submitting}
                    className="w-full bg-primary text-primary-foreground font-bold text-sm py-2.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {submitting ? "Verifying..." : "Confirm Purchase"}
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default Marketplace;
