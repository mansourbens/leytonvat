import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "current" | "pending";
}

interface WorkflowProgressProps {
  steps: WorkflowStep[];
  className?: string;
}

export function WorkflowProgress({ steps, className }: WorkflowProgressProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {step.status === "completed" ? (
              <CheckCircle2 className="h-5 w-5 text-accent" />
            ) : step.status === "current" ? (
              <Clock className="h-5 w-5 text-primary animate-pulse" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "text-sm font-medium",
                step.status === "completed"
                  ? "text-accent"
                  : step.status === "current"
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {step.title}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {step.description}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div className="absolute left-2 mt-8 w-px h-8 bg-border" />
          )}
        </div>
      ))}
    </div>
  );
}