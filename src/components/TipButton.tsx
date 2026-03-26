import { useState } from "react";
import { DollarSign, Copy, Check, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const RECEIVING_WALLET = "8akGLGrkuwYfCuPHvq2G3RiJecD6eFVrNScArQUvTnTf";

interface TipButtonProps {
  postId: string;
  recipientId: string;
}

const TipButton = ({ postId, recipientId }: TipButtonProps) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("0.05");
  const [txSig, setTxSig] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tipCount, setTipCount] = useState(0);

  // Don't show tip button for own posts
  if (user?.id === recipientId) return null;

  const copyWallet = () => {
    navigator.clipboard.writeText(RECEIVING_WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submitTip = async () => {
    if (!user || !txSig.trim() || !amount) return;
    setSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("verify-tip", {
        body: {
          tx_signature: txSig.trim(),
          post_id: postId,
          recipient_id: recipientId,
          amount_sol: parseFloat(amount),
        },
      });

      if (error || data?.error) {
        toast.error(data?.error || "Verification failed");
      } else {
        toast.success(`Tipped ${amount} SOL! 🎉`);
        setShowModal(false);
        setTxSig("");
        setTipCount((c) => c + 1);
      }
    } catch {
      toast.error("Verification service unavailable");
    }
    setSubmitting(false);
  };

  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); if (user) setShowModal(true); }}
        className="flex items-center gap-1 text-muted-foreground hover:text-amber-500 transition-colors group"
      >
        <div className="p-1.5 rounded-lg group-hover:bg-amber-500/10 transition-colors">
          <DollarSign className="h-[15px] w-[15px]" />
        </div>
        {tipCount > 0 && <span className="text-[11px] font-mono">{tipCount}</span>}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-card border border-border rounded-xl w-full max-w-sm p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-amber-500" />
                Send Tip
              </h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Amount (SOL)</label>
                <div className="flex gap-2">
                  {["0.01", "0.05", "0.10", "0.50"].map((a) => (
                    <button
                      key={a}
                      onClick={() => setAmount(a)}
                      className={`flex-1 py-1.5 text-xs font-mono rounded-lg transition-colors ${
                        amount === a ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full mt-2 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground">Send {amount} SOL to:</p>
                <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
                  <code className="text-[10px] text-foreground flex-1 break-all font-mono">{RECEIVING_WALLET}</code>
                  <button onClick={copyWallet} className="shrink-0 p-1 hover:bg-secondary rounded transition-colors">
                    {copied ? <Check className="h-3.5 w-3.5 text-positive" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Paste transaction signature:</p>
                <input
                  value={txSig}
                  onChange={(e) => setTxSig(e.target.value)}
                  placeholder="Solana tx signature..."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <button
                onClick={submitTip}
                disabled={!txSig.trim() || submitting}
                className="w-full bg-amber-500 text-white font-bold text-sm py-2.5 rounded-lg hover:bg-amber-600 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {submitting ? "Verifying..." : `Tip ${amount} SOL`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TipButton;
