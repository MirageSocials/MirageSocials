import React from "react";
import { useNavigate } from "react-router-dom";

export function extractHashtags(text: string): string[] {
  const matches = text.match(/#[\w]+/g);
  return matches ? [...new Set(matches.map((t) => t.toLowerCase()))] : [];
}

export function renderContentWithHashtags(content: string): React.ReactNode[] {
  const parts = content.split(/(#[\w]+)/g);
  return parts.map((part, i) => {
    if (/^#[\w]+$/.test(part)) {
      return (
        <HashtagLink key={i} tag={part} />
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function HashtagLink({ tag }: { tag: string }) {
  const navigate = useNavigate();
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/hashtag/${tag.slice(1).toLowerCase()}`);
      }}
      className="text-primary hover:underline cursor-pointer font-medium"
    >
      {tag}
    </span>
  );
}
