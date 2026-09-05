'use client';

import { useState } from "react";
import { Search, Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { VoiceInputButton } from "./VoiceInputButton";
import { cn } from "@/lib/utils";

export function AiSearchBar({
  value,
  onChange,
  onSubmit,
  aiMode,
  onAiModeChange,
  className,
  placeholder = "Search fabrics, suppliers, compositions…",
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  aiMode: boolean;
  onAiModeChange: (value: boolean) => void;
  className?: string;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={cn("w-full", className)}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(value);
        }}
        className={cn(
          "flex items-center gap-2 rounded-2xl border bg-card p-1.5 pl-3 transition-shadow",
          focused && "border-primary/50 shadow-soft",
        )}
      >
        {aiMode ? (
          <Sparkle className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        ) : (
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        )}
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={aiMode ? "Describe what you need in plain language…" : placeholder}
          aria-label="Search the marketplace"
          className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
        <VoiceInputButton
          onTranscript={(text) => {
            onChange(text);
            onSubmit(text);
          }}
        />
        <Button type="submit" className="h-9 rounded-xl px-4">
          Search
        </Button>
      </form>

      <div className="mt-2.5 flex items-center gap-2.5 pl-1">
        <Switch id="ai-mode" checked={aiMode} onCheckedChange={onAiModeChange} />
        <Label htmlFor="ai-mode" className="text-xs font-normal text-muted-foreground">
          Natural language search — ask the way you&apos;d brief a sourcing agent
        </Label>
      </div>
    </div>
  );
}
