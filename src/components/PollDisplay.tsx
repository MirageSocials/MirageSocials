import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

interface PollOption {
  id: string;
  option_text: string;
  position: number;
}

interface PollDisplayProps {
  postId: string;
  expiresAt?: string | null;
}

const PollDisplay = ({ postId, expiresAt }: PollDisplayProps) => {
  const { user } = useAuth();
  const [options, setOptions] = useState<PollOption[]>([]);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [userVote, setUserVote] = useState<string | null>(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);

  const isExpired = expiresAt ? new Date(expiresAt) < new Date() : false;

  useEffect(() => {
    const fetchPoll = async () => {
      const { data: opts } = await supabase
        .from("poll_options")
        .select("id, option_text, position")
        .eq("post_id", postId)
        .order("position");

      if (!opts || opts.length === 0) { setLoading(false); return; }
      setOptions(opts);

      const { data: allVotes } = await supabase
        .from("poll_votes")
        .select("poll_option_id, user_id")
        .eq("post_id", postId);

      const voteCounts: Record<string, number> = {};
      let myVote: string | null = null;
      (allVotes || []).forEach((v: any) => {
        voteCounts[v.poll_option_id] = (voteCounts[v.poll_option_id] || 0) + 1;
        if (user && v.user_id === user.id) myVote = v.poll_option_id;
      });
      setVotes(voteCounts);
      setUserVote(myVote);
      setTotalVotes(allVotes?.length || 0);
      setLoading(false);
    };
    fetchPoll();
  }, [postId, user]);

  const handleVote = async (optionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || userVote || isExpired) return;

    await supabase.from("poll_votes").insert({
      poll_option_id: optionId,
      user_id: user.id,
      post_id: postId,
    } as any);

    setVotes((prev) => ({ ...prev, [optionId]: (prev[optionId] || 0) + 1 }));
    setUserVote(optionId);
    setTotalVotes((t) => t + 1);
  };

  if (loading || options.length === 0) return null;

  const hasVoted = !!userVote;
  const showResults = hasVoted || isExpired;

  return (
    <div className="mt-3 space-y-1.5">
      {options.map((opt) => {
        const count = votes[opt.id] || 0;
        const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
        const isMyVote = userVote === opt.id;

        return (
          <button
            key={opt.id}
            onClick={(e) => handleVote(opt.id, e)}
            disabled={showResults}
            className={`w-full relative rounded-lg border text-left text-sm px-3 py-2 transition-all overflow-hidden ${
              showResults
                ? isMyVote
                  ? "border-primary/50 bg-primary/5"
                  : "border-border bg-secondary/10"
                : "border-border hover:border-primary/40 hover:bg-primary/5 cursor-pointer"
            }`}
          >
            {showResults && (
              <div
                className="absolute inset-y-0 left-0 bg-primary/10 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            )}
            <div className="relative flex items-center justify-between">
              <span className={`text-foreground text-[13px] ${isMyVote ? "font-semibold" : ""}`}>
                {opt.option_text}
                {isMyVote && <span className="ml-1 text-primary">✓</span>}
              </span>
              {showResults && (
                <span className="text-xs text-muted-foreground font-mono ml-2">{pct}%</span>
              )}
            </div>
          </button>
        );
      })}
      <div className="flex items-center gap-2">
        <p className="text-[11px] text-muted-foreground font-mono">{totalVotes} vote{totalVotes !== 1 ? "s" : ""}</p>
        {expiresAt && (
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
            <Clock className="h-2.5 w-2.5" />
            {isExpired ? (
              <span className="text-destructive">Closed</span>
            ) : (
              <span>{formatDistanceToNow(new Date(expiresAt))} left</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PollDisplay;
