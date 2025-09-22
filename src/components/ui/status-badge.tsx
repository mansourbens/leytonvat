import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        pending: "bg-status-pending text-status-pending-foreground",
        progress: "bg-status-progress text-status-progress-foreground",
        review: "bg-status-review text-status-review-foreground",
        approved: "bg-status-approved text-status-approved-foreground",
        submitted: "bg-status-submitted text-status-submitted-foreground",
        closed: "bg-status-closed text-status-closed-foreground",
      },
    },
    defaultVariants: {
      variant: "pending",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
}

function StatusBadge({ className, variant, children, ...props }: StatusBadgeProps) {
  return (
    <div className={cn(statusBadgeVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
}

export { StatusBadge, statusBadgeVariants };