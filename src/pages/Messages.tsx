import { useEffect, useState, useCallback, useRef } from "react";
import { ArrowLeft, Send, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import Navbar from "@/components/Navbar";

interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

interface Profile {
  user_id: string;
  display_name: string | null;
  username: string | null;
}

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [activeConvo, setActiveConvo] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showNewDM, setShowNewDM] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (data) {
      setConversations(data as Conversation[]);
      const otherIds = data.map((c: any) => c.user1_id === user.id ? c.user2_id : c.user1_id);
      if (otherIds.length > 0) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("user_id, display_name, username")
          .in("user_id", otherIds);
        if (profileData) {
          const map: Record<string, Profile> = {};
          profileData.forEach((p: any) => { map[p.user_id] = p; });
          setProfiles(map);
        }
      }
    }
    setLoading(false);
  }, [user]);

  const fetchMessages = useCallback(async (convoId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", convoId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data as Message[]);
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  useEffect(() => {
    if (!activeConvo) return;
    fetchMessages(activeConvo.id);
    const channel = supabase
      .channel(`msgs-${activeConvo.id}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "messages",
        filter: `conversation_id=eq.${activeConvo.id}`
      }, () => { fetchMessages(activeConvo.id); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeConvo, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !activeConvo) return;
    await supabase.from("messages").insert({
      conversation_id: activeConvo.id,
      sender_id: user.id,
      content: newMessage.trim(),
    } as any);
    setNewMessage("");
  };

  const searchUsers = async (q: string) => {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults([]); return; }
    const { data } = await supabase
      .from("profiles")
      .select("user_id, display_name, username")
      .or(`display_name.ilike.%${q}%,username.ilike.%${q}%`)
      .neq("user_id", user?.id || "")
      .limit(10);
    setSearchResults((data as Profile[]) || []);
  };

  const startConversation = async (otherUserId: string) => {
    if (!user) return;
    // Check if conversation exists
    const { data: existing } = await supabase
      .from("conversations")
      .select("*")
      .or(`and(user1_id.eq.${user.id},user2_id.eq.${otherUserId}),and(user1_id.eq.${otherUserId},user2_id.eq.${user.id})`)
      .maybeSingle();

    if (existing) {
      setActiveConvo(existing as Conversation);
    } else {
      const { data: newConvo } = await supabase
        .from("conversations")
        .insert({ user1_id: user.id, user2_id: otherUserId } as any)
        .select()
        .single();
      if (newConvo) {
        setActiveConvo(newConvo as Conversation);
        fetchConversations();
      }
    }
    // Ensure profile is in map
    if (!profiles[otherUserId]) {
      const found = searchResults.find(p => p.user_id === otherUserId);
      if (found) setProfiles(prev => ({ ...prev, [otherUserId]: found }));
    }
    setShowNewDM(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const getOtherId = (c: Conversation) => c.user1_id === user?.id ? c.user2_id : c.user1_id;

  // Chat view
  if (activeConvo && user) {
    const otherId = getOtherId(activeConvo);
    const otherProfile = profiles[otherId];
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="container max-w-xl mx-auto flex flex-col flex-1">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <button onClick={() => setActiveConvo(null)} className="text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <p className="font-bold text-foreground text-sm">{otherProfile?.display_name || "User"}</p>
              <p className="text-xs text-muted-foreground">@{otherProfile?.username || otherId.slice(0, 8)}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ maxHeight: "calc(100vh - 180px)" }}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                  msg.sender_id === user.id
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary text-foreground rounded-bl-md"
                }`}>
                  <p>{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${msg.sender_id === user.id ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border px-4 py-3 flex items-center gap-2">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
              placeholder="Start a new message"
              className="flex-1 bg-secondary text-foreground rounded-full px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Conversations list
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-xl mx-auto">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h1 className="text-xl font-bold text-foreground">Messages</h1>
          <button
            onClick={() => setShowNewDM(!showNewDM)}
            className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {showNewDM && (
          <div className="border-b border-border p-4">
            <input
              value={searchQuery}
              onChange={(e) => searchUsers(e.target.value)}
              placeholder="Search people..."
              className="w-full bg-secondary text-foreground rounded-full px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {searchResults.map((p) => (
              <button
                key={p.user_id}
                onClick={() => startConversation(p.user_id)}
                className="flex items-center gap-3 w-full px-2 py-2 hover:bg-secondary/50 rounded-lg transition-colors mt-1"
              >
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">
                  {(p.display_name || "U")[0].toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground">{p.display_name || "User"}</p>
                  <p className="text-xs text-muted-foreground">@{p.username || p.user_id.slice(0, 8)}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-bold text-foreground mb-1">No messages yet</p>
            <p className="text-sm">Start a conversation by tapping the + button.</p>
          </div>
        ) : (
          conversations.map((c) => {
            const otherId = getOtherId(c);
            const other = profiles[otherId];
            return (
              <button
                key={c.id}
                onClick={() => setActiveConvo(c)}
                className="flex items-center gap-3 w-full px-4 py-3 border-b border-border hover:bg-secondary/30 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                  {(other?.display_name || "U")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground text-sm truncate">{other?.display_name || "User"}</p>
                  <p className="text-xs text-muted-foreground truncate">@{other?.username || otherId.slice(0, 8)}</p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Messages;
