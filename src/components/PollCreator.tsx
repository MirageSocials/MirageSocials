import { useState } from "react";
import { X, Plus } from "lucide-react";

interface PollCreatorProps {
  options: string[];
  onChange: (options: string[]) => void;
  onRemove: () => void;
}

const PollCreator = ({ options, onChange, onRemove }: PollCreatorProps) => {
  const updateOption = (index: number, value: string) => {
    const next = [...options];
    next[index] = value;
    onChange(next);
  };

  const addOption = () => {
    if (options.length < 4) onChange([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    onChange(options.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-2 border border-border rounded-xl p-3 bg-secondary/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-foreground">Poll</span>
        <button onClick={onRemove} className="p-1 hover:bg-secondary rounded-md transition-colors">
          <X className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
              placeholder={`Option ${i + 1}`}
              maxLength={50}
              className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {options.length > 2 && (
              <button onClick={() => removeOption(i)} className="p-1 hover:bg-secondary rounded-md transition-colors">
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </div>
        ))}
      </div>
      {options.length < 4 && (
        <button
          onClick={addOption}
          className="flex items-center gap-1 mt-2 text-primary text-xs font-medium hover:bg-primary/10 px-2 py-1 rounded-md transition-colors"
        >
          <Plus className="h-3 w-3" />
          Add option
        </button>
      )}
    </div>
  );
};

export default PollCreator;
