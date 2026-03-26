import { useState, useEffect } from "react";
import { Settings as SettingsIcon, User, Lock, Bell, ArrowLeft, Copy, Check, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import AppLayout from "@/components/AppLayout";

const USERNAME_REGEX = /^[a-z]+$/;
const RECEIVING_WALLET = "8akGLGrkuwYfCuPHvq2G3RiJecD6eFVrNScArQUvTnTf";
const RESERVATION_FEE_SOL = 0.10;

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"account" | "password" | "notifications">("account");

  // Account state
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [showReservation, setShowReservation] = useState(false);
  const [txSignature, setTxSignature] = useState("");
  const [submittingReservation, setSubmittingReservation] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savingAccount, setSavingAccount] = useState(false);

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // Notification preferences (local for now)
  const [notifLikes, setNotifLikes] = useState(true);
  const [notifReplies, setNotifReplies] = useState(true);
  const [notifFollows, setNotifFollows] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (data) {
        setDisplayName(data.display_name || "");
        setUsername((data as any).username || "");
        setBio((data as any).bio || "");
      }
      // Load notification prefs from localStorage
      const prefs = localStorage.getItem("notif_prefs");
      if (prefs) {
        const p = JSON.parse(prefs);
        setNotifLikes(p.likes ?? true);
        setNotifReplies(p.replies ?? true);
        setNotifFollows(p.follows ?? true);
        setNotifMessages(p.messages ?? true);
      }
    };
    load();
  }, [user]);

  const validateUsername = (val: string) => {
    if (!val) {
      setUsernameError("");
      return true;
    }
    if (!USERNAME_REGEX.test(val)) {
      setUsernameError("Username can only contain lowercase letters (a-z)");
      return false;
    }
    if (val.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return false;
    }
    if (val.length > 20) {
      setUsernameError("Username must be 20 characters or less");
      return false;
    }
    setUsernameError("");
    return true;
  };

  const saveAccount = async () => {
    if (!user) return;
    if (username && !validateUsername(username)) return;

    setSavingAccount(true);

    // Check username uniqueness
    if (username) {
      const { data: existing } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("username", username)
        .neq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        setUsernameError("Username is taken — reserve it for $0.10 SOL");
        setUsernameTaken(true);
        setShowReservation(true);
        setSavingAccount(false);
        return;
      } else {
        setUsernameTaken(false);
        setShowReservation(false);
      }
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        username: username || null,
        bio,
      } as any)
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to save profile");
    } else {
      toast.success("Profile updated!");
    }
    setSavingAccount(false);
  };

  const copyWallet = () => {
    navigator.clipboard.writeText(RECEIVING_WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submitReservation = async () => {
    if (!user || !txSignature.trim()) return;
    setSubmittingReservation(true);

    // First insert the reservation record
    const { error: insertErr } = await supabase
      .from("username_reservations")
      .insert({
        user_id: user.id,
        desired_username: username,
        tx_signature: txSignature.trim(),
        status: "pending",
      } as any);

    if (insertErr) {
      toast.error("Failed to submit reservation");
      setSubmittingReservation(false);
      return;
    }

    // Call edge function to verify on-chain and auto-approve
    try {
      const { data, error } = await supabase.functions.invoke("verify-solana-tx", {
        body: { tx_signature: txSignature.trim(), desired_username: username },
      });

      if (error || data?.error) {
        toast.error(data?.error || "Verification failed. Please check your transaction and try again.");
      } else {
        toast.success("Username reserved and verified! Your profile has been updated.");
        setShowReservation(false);
        setTxSignature("");
        setUsernameTaken(false);
        setUsernameError("");
      }
    } catch {
      toast.error("Verification service unavailable. Your reservation is saved and will be reviewed.");
    }
    setSubmittingReservation(false);
  };

  const changePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated!");
      setNewPassword("");
      setConfirmPassword("");
    }
    setSavingPassword(false);
  };

  const saveNotifPrefs = () => {
    localStorage.setItem("notif_prefs", JSON.stringify({
      likes: notifLikes,
      replies: notifReplies,
      follows: notifFollows,
      messages: notifMessages,
    }));
    toast.success("Notification preferences saved!");
  };

  const tabs = [
    { id: "account" as const, label: "Account", icon: User },
    { id: "password" as const, label: "Password", icon: Lock },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
  ];

  return (
    <AppLayout>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-foreground" />
            <h1 className="text-lg font-bold text-foreground">Settings</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {activeTab === "account" && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Display Name</label>
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    maxLength={50}
                    className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your display name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Username
                    <span className="text-xs text-muted-foreground ml-2">lowercase letters only (a-z)</span>
                  </label>
                  <div className="flex items-center">
                    <span className="text-muted-foreground text-sm mr-1">@</span>
                    <input
                      value={username}
                      onChange={(e) => {
                        const val = e.target.value.toLowerCase();
                        setUsername(val);
                        validateUsername(val);
                        setUsernameTaken(false);
                        setShowReservation(false);
                      }}
                      maxLength={20}
                      className="flex-1 bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="username"
                    />
                  </div>
                  {usernameError && (
                    <p className={`text-xs mt-1 ${usernameTaken ? "text-amber-500" : "text-destructive"}`}>{usernameError}</p>
                  )}
                  {showReservation && usernameTaken && (
                    <div className="mt-3 p-4 bg-secondary/50 border border-border rounded-lg space-y-3">
                      <p className="text-sm font-medium text-foreground">
                        Reserve <span className="text-primary">@{username}</span> for {RESERVATION_FEE_SOL} SOL
                      </p>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Send exactly {RESERVATION_FEE_SOL} SOL to:</p>
                        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
                          <code className="text-xs text-foreground flex-1 break-all font-mono">{RECEIVING_WALLET}</code>
                          <button onClick={copyWallet} className="shrink-0 p-1 hover:bg-secondary rounded transition-colors">
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">After sending, paste your transaction signature:</p>
                        <input
                          value={txSignature}
                          onChange={(e) => setTxSignature(e.target.value)}
                          placeholder="Paste Solana tx signature..."
                          className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <button
                        onClick={submitReservation}
                        disabled={!txSignature.trim() || submittingReservation}
                        className="w-full bg-primary text-primary-foreground font-bold text-xs py-2 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                      >
                        {submittingReservation && <Loader2 className="h-3 w-3 animate-spin" />}
                        {submittingReservation ? "Submitting..." : "Submit Reservation"}
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={160}
                    rows={3}
                    className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Tell the world about yourself"
                  />
                  <p className="text-xs text-muted-foreground text-right">{bio.length}/160</p>
                </div>

                <div className="text-xs text-muted-foreground">
                  Email: {user?.email}
                </div>
              </div>

              <button
                onClick={saveAccount}
                disabled={savingAccount || (!!usernameError && !usernameTaken)}
                className="w-full bg-primary text-primary-foreground font-bold text-sm py-2.5 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-40"
              >
                {savingAccount ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}

          {activeTab === "password" && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="At least 6 characters"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Confirm your new password"
                  />
                </div>
              </div>
              <button
                onClick={changePassword}
                disabled={savingPassword || !newPassword}
                className="w-full bg-primary text-primary-foreground font-bold text-sm py-2.5 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-40"
              >
                {savingPassword ? "Updating..." : "Update Password"}
              </button>
            </>
          )}

          {activeTab === "notifications" && (
            <>
              <div className="space-y-4">
                {[
                  { label: "Likes", desc: "When someone likes your post", value: notifLikes, set: setNotifLikes },
                  { label: "Replies", desc: "When someone replies to your post", value: notifReplies, set: setNotifReplies },
                  { label: "Follows", desc: "When someone follows you", value: notifFollows, set: setNotifFollows },
                  { label: "Messages", desc: "When you receive a new message", value: notifMessages, set: setNotifMessages },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => item.set(!item.value)}
                      className={`w-11 h-6 rounded-full transition-colors relative ${
                        item.value ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        item.value ? "left-[22px]" : "left-0.5"
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={saveNotifPrefs}
                className="w-full bg-primary text-primary-foreground font-bold text-sm py-2.5 rounded-full hover:bg-primary/90 transition-colors"
              >
                Save Preferences
              </button>
            </>
          )}
        </div>
    </AppLayout>
  );
};

export default Settings;
