import { useState } from "react";
import { X, Plus, Clock } from "lucide-react";

interface PollCreatorProps {
  options: string[];
  onChange: (options: string[]) => void;
  onRemove: () => void;
  duration: number | null;
  onDurationChange: (minutes: number | null) => void;
}

const presetDurations = [
  { label: "1h", minutes: 60 },
  { label: "6h", minutes: 360 },
  { label: "24h", minutes: 1440 },
  { label: "3d", minutes: 4320 },
  { label: "7d", minutes: 10080 },
];

const PollCreator = ({ options, onChange, onRemove, duration, onDurationChange }: PollCreatorProps) => {
  const [customHours, setCustomHours] = useState("");
  const [showCustom, setShowCustom] = useState(false);

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

  const handleCustomDuration = () => {
    const hours = parseFloat(customHours);
    if (hours > 0 && hours <= 168) {
      onDurationChange(Math.round(hours * 60));
      setShowCustom(false);
    }
  };

  const activeDuration = presetDurations.find((p) => p.minutes === duration);

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

      {/* Duration picker */}
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5 mb-2">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground font-medium">Poll duration</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {presetDurations.map((p) => (
            <button
              key={p.label}
              onClick={() => onDurationChange(duration === p.minutes ? null : p.minutes)}
              className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-colors ${
                duration === p.minutes
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => setShowCustom(!showCustom)}
            className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-colors ${
              duration && !activeDuration
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            {duration && !activeDuration ? `${Math.round(duration / 60)}h` : "Custom"}
          </button>
        </div>
        {showCustom && (
          <div className="flex items-center gap-2 mt-2">
            <input
              value={customHours}
              onChange={(e) => setCustomHours(e.target.value)}
              placeholder="Hours (max 168)"
              type="number"
              min="0.5"
              max="168"
              step="0.5"
              className="w-32 bg-background border border-border rounded-lg px-2.5 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleCustomDuration}
              className="text-[11px] font-medium text-primary hover:bg-primary/10 px-2 py-1 rounded-md transition-colors"
            >
              Set
            </button>
          </div>
        )}
        {!duration && (
          <p className="text-[10px] text-muted-foreground mt-1.5">No expiry — poll stays open forever</p>
        )}
      </div>
    </div>
  );
};

export default PollCreator;
