import React from "react";

interface HighlightTextProps {
  text: string;
  query: string;
  className?: string;
}

const HighlightText = ({ text, query, className = "" }: HighlightTextProps) => {
  if (!query.trim()) return <span className={className}>{text}</span>;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-primary/30 text-inherit rounded-sm px-0.5">{part}</mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </span>
  );
};

export default HighlightText;
