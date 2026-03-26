import { useState, useCallback } from "react";
import { Play, ChevronDown, ChevronUp, Copy, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ApiPlaygroundProps {
  method: string;
  path: string;
  desc: string;
  sampleBody?: string;
  sampleResponse?: string;
}

const methodColors: Record<string, string> = {
  GET: "bg-blue-500/10 text-blue-400",
  POST: "bg-emerald-500/10 text-emerald-400",
  PATCH: "bg-amber-500/10 text-amber-400",
  DELETE: "bg-red-500/10 text-red-400",
  PUT: "bg-purple-500/10 text-purple-400",
};

const ApiPlayground = ({ method, path, desc, sampleBody, sampleResponse }: ApiPlaygroundProps) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [copied, setCopied] = useState<"curl" | "response" | null>(null);
  const [bodyValue, setBodyValue] = useState(sampleBody || "");

  const curlCommand = `curl -X ${method} https://api.lunaagent.io${path} \\
  -H "Authorization: Bearer luna_sk_..." \\
  -H "Content-Type: application/json"${bodyValue ? ` \\
  -d '${bodyValue}'` : ""}`;

  const handleTryIt = useCallback(() => {
    setLoading(true);
    setShowResponse(false);
    setTimeout(() => {
      setLoading(false);
      setShowResponse(true);
    }, 800 + Math.random() * 600);
  }, []);

  const handleCopy = useCallback((text: string, type: "curl" | "response") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    });
  }, []);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden transition-all">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-accent/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${methodColors[method] || methodColors.GET}`}>
            {method}
          </span>
          <code className="text-xs text-foreground font-mono">{path}</code>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-primary font-mono hidden sm:inline">Try it</span>
          {expanded ? (
            <ChevronUp className="h-3 w-3 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          )}
        </div>
      </button>
      <p className="text-xs text-muted-foreground px-4 pb-3 -mt-1">{desc}</p>

      {/* Expanded playground */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border p-4 space-y-4">
              {/* Request body editor (for POST/PATCH/PUT) */}
              {(method === "POST" || method === "PATCH" || method === "PUT") && sampleBody && (
                <div>
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2 block">
                    Request Body
                  </label>
                  <textarea
                    value={bodyValue}
                    onChange={(e) => setBodyValue(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg p-3 font-mono text-xs text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/30 transition-all"
                    rows={bodyValue.split("\n").length + 1}
                    spellCheck={false}
                  />
                </div>
              )}

              {/* cURL preview */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                    cURL
                  </label>
                  <button
                    onClick={() => handleCopy(curlCommand, "curl")}
                    className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copied === "curl" ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <div className="bg-background border border-border rounded-lg p-3 font-mono text-xs text-muted-foreground whitespace-pre-wrap break-all">
                  {curlCommand}
                </div>
              </div>

              {/* Send button */}
              <button
                onClick={handleTryIt}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-mono font-semibold hover:bg-primary/20 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
                {loading ? "Sending..." : "Send Request"}
              </button>

              {/* Mock response */}
              <AnimatePresence>
                {showResponse && sampleResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                          Response
                        </label>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          200 OK
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(sampleResponse, "response")}
                        className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {copied === "response" ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                    <div className="bg-background border border-border rounded-lg p-3 font-mono text-xs text-primary whitespace-pre-wrap">
                      {sampleResponse}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApiPlayground;
