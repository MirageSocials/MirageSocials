import { useState, useCallback, useMemo } from "react";
import { Check, Copy } from "lucide-react";
import React from "react";

interface CodeBlockProps {
  code: string;
  className?: string;
  language?: "json" | "bash" | "typescript" | "text";
  children?: React.ReactNode;
}

function tokenize(code: string, language: string): React.ReactNode[] {
  if (language === "text") return [code];

  const lines = code.split("\n");
  return lines.map((line, i) => {
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let key = 0;

    const push = (text: string, cls: string) => {
      parts.push(<span key={key++} className={cls}>{text}</span>);
    };

    if (language === "bash") {
      if (remaining.startsWith("$") || remaining.startsWith("#")) {
        push(remaining.charAt(0), "text-[#999]");
        remaining = remaining.slice(1);
        push(remaining, "text-[#1a1a1a]");
      } else if (remaining.startsWith("✓") || remaining.startsWith("◉")) {
        push(remaining, "text-primary");
      } else {
        push(remaining, "text-[#666]");
      }
    } else if (language === "json") {
      const jsonRegex = /("(?:\\.|[^"\\])*")\s*:|("(?:\\.|[^"\\])*")|(\b\d+\.?\d*\b)|(\btrue\b|\bfalse\b|\bnull\b)|([\[\]{}:,])|(\.\.\.)|(\/\/.*$)/g;
      let lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = jsonRegex.exec(remaining)) !== null) {
        if (match.index > lastIndex) push(remaining.slice(lastIndex, match.index), "text-[#1a1a1a]");
        if (match[1]) push(match[0], "text-primary font-medium");
        else if (match[2]) push(match[2], "text-emerald-600");
        else if (match[3]) push(match[3], "text-amber-600");
        else if (match[4]) push(match[4], "text-amber-600");
        else if (match[5]) push(match[5], "text-[#999]");
        else if (match[6]) push(match[6], "text-[#999]");
        else if (match[7]) push(match[7], "text-[#999] italic");
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < remaining.length) push(remaining.slice(lastIndex), "text-[#1a1a1a]");
    } else {
      const tsRegex = /(\/\/.*$)|(import|from|const|let|var|function|return|export|type|interface|class|new|if|else)\b|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+\.?\d*\b)|([\[\]{}():,;=><|&.]+)/g;
      let lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = tsRegex.exec(remaining)) !== null) {
        if (match.index > lastIndex) push(remaining.slice(lastIndex, match.index), "text-[#1a1a1a]");
        if (match[1]) push(match[1], "text-[#999] italic");
        else if (match[2]) push(match[2], "text-primary font-semibold");
        else if (match[3]) push(match[3], "text-emerald-600");
        else if (match[4]) push(match[4], "text-amber-600");
        else if (match[5]) push(match[5], "text-[#999]");
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < remaining.length) push(remaining.slice(lastIndex), "text-[#1a1a1a]");
    }

    return (
      <div key={i} className="leading-relaxed">
        {parts.length > 0 ? parts : "\u00A0"}
      </div>
    );
  });
}

function detectLanguage(code: string): "json" | "bash" | "typescript" | "text" {
  const trimmed = code.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) return "json";
  if (trimmed.startsWith("$") || trimmed.startsWith("curl") || trimmed.startsWith("Verify")) return "bash";
  if (trimmed.includes("import ") || trimmed.includes("const ") || trimmed.includes("//")) return "typescript";
  return "text";
}

const CodeBlock = ({ code, className = "", language, children }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const lang = language || detectLanguage(code);
  const highlighted = useMemo(() => tokenize(code, lang), [code, lang]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div className={`relative group bg-[#f5f6f8] border border-[#e8eaed] rounded-2xl p-5 font-mono text-xs overflow-x-auto ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] uppercase tracking-widest text-[#bbb] font-mono">{lang}</span>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg bg-white/60 border border-[#e8eaed] text-[#999] hover:text-[#1a1a1a] hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Copy to clipboard"
        >
          {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
        </button>
      </div>
      {children || highlighted}
    </div>
  );
};

export default CodeBlock;
