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
  orientation?: "vertical" | "horizontal";
}

export function WorkflowProgress({ steps, className, orientation = "vertical" }: WorkflowProgressProps) {
  if (orientation === "horizontal") {
    return (
      <div className={cn("w-full", className)}>
        <div className="flex items-center">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            const icon = step.status === "completed" ? (
              <CheckCircle2 className="h-5 w-5 text-accent" />
            ) : step.status === "current" ? (
              <Clock className="h-5 w-5 text-primary animate-pulse" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            );

            return (
              <div key={step.id} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center text-center px-3">
                  {icon}
                  <div className={cn(
                    "mt-1 text-xs font-medium whitespace-normal break-words",
                    step.status === "completed" ? "text-accent" : step.status === "current" ? "text-primary" : "text-muted-foreground"
                  )}>
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="mt-0.5 text-[11px] text-muted-foreground whitespace-normal break-words">
                      {step.description}
                    </div>
                  )}
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "flex-1 h-[2px] mx-2",
                      step.status === "completed" ? "bg-accent" : "bg-border"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // vertical fallback (original)
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