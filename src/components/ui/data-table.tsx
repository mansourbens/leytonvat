import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, MoreHorizontal, AlertCircle, CheckCircle2 } from "lucide-react";

interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

interface DataTableRow {
  id: string;
  [key: string]: any;
}

interface DataTableProps {
  title: string;
  description?: string;
  columns: DataTableColumn[];
  data: DataTableRow[];
  onRowAction?: (action: string, row: DataTableRow) => void;
  className?: string;
}

export function DataTable({
  title,
  description,
  columns,
  data,
  onRowAction,
  className,
}: DataTableProps) {
  const renderCellContent = (row: DataTableRow, column: DataTableColumn) => {
    const value = row[column.key];
    
    // Special rendering for certain column types
    if (column.key === "status" && typeof value === "string") {
      return (
        <StatusBadge variant={value as any}>
          {value === "pending" && "Data Pending"}
          {value === "progress" && "In Preparation"}
          {value === "review" && "Under Review"}
          {value === "approved" && "Approved"}
          {value === "submitted" && "Submitted"}
          {value === "closed" && "Closed"}
        </StatusBadge>
      );
    }
    
    if (column.key === "priority" && typeof value === "string") {
      return (
        <Badge variant={value === "high" ? "destructive" : value === "medium" ? "default" : "secondary"}>
          {value}
        </Badge>
      );
    }
    
    if (column.key === "alerts" && typeof value === "number") {
      return (
        <div className="flex items-center gap-1">
          {value > 0 ? (
            <AlertCircle className="h-4 w-4 text-destructive" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-accent" />
          )}
          <span className={value > 0 ? "text-destructive" : "text-accent"}>
            {value === 0 ? "Clean" : `${value} issue${value > 1 ? "s" : ""}`}
          </span>
        </div>
      );
    }
    
    // Format dates
    if (column.key.includes("date") || column.key.includes("deadline")) {
      return new Date(value).toLocaleDateString();
    }
    
    return value;
  };

  return (
    <Card className={cn("bg-gradient-card border shadow-soft", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="text-left py-3 px-4 font-medium text-sm text-muted-foreground"
                  >
                    {column.label}
                  </th>
                ))}
                <th className="text-right py-3 px-4 font-medium text-sm text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-border/50 hover:bg-muted/50 transition-colors",
                    index % 2 === 0 && "bg-muted/20"
                  )}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="py-4 px-4 text-sm">
                      {renderCellContent(row, column)}
                    </td>
                  ))}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRowAction?.("view", row)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRowAction?.("download", row)}
                        className="h-8 w-8 p-0"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRowAction?.("menu", row)}
                        className="h-8 w-8 p-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {data.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}