import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex w-full items-center gap-2" aria-label="Progress">
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={step} className="flex min-w-0 flex-1 items-center gap-2">
            <span
              className={cn(
                "grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs font-medium transition-colors",
                done && "border-primary bg-primary text-primary-foreground",
                active && "border-primary text-primary",
                !done && !active && "border-border text-muted-foreground",
              )}
              aria-current={active ? "step" : undefined}
            >
              {done ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : index + 1}
            </span>
            <span
              className={cn(
                "hidden truncate text-sm sm:block",
                active ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              {step}
            </span>
            {index < steps.length - 1 ? (
              <span className={cn("h-px flex-1 bg-border", done && "bg-primary/50")} aria-hidden="true" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
