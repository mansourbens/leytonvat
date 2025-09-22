import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    direction: "up" | "down" | "neutral";
  };
  className?: string;
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("bg-gradient-card border shadow-soft", className)}>
      <CardHeader className="pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && (
          <CardDescription className="text-xs mt-1">
            {description}
          </CardDescription>
        )}
        {trend && (
          <div
            className={cn(
              "text-xs mt-2 flex items-center gap-1",
              trend.direction === "up"
                ? "text-accent"
                : trend.direction === "down"
                ? "text-destructive"
                : "text-muted-foreground"
            )}
          >
            <span
              className={cn(
                "font-medium",
                trend.direction === "up" && "text-accent",
                trend.direction === "down" && "text-destructive"
              )}
            >
              {trend.direction === "up" ? "+" : trend.direction === "down" ? "-" : ""}
              {Math.abs(trend.value)}%
            </span>
            <span>{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}