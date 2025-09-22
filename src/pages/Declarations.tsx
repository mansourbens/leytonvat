import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { FileText, Calendar, MapPin, Plus } from "lucide-react";

interface Declaration {
  id: string;
  name: string;
  country: string;
  period: string;
  type: "monthly" | "quarterly";
  declarationType: "ECL" | "VAT Return" | "Intrastat";
  deadline: string;
  status: "pending" | "progress" | "review" | "approved" | "submitted" | "closed";
}

const mockDeclarations: Declaration[] = [
  {
    id: "1",
    name: "ECL-SPAIN-M8-2025",
    country: "Spain",
    period: "August 2025",
    type: "monthly",
    declarationType: "ECL",
    deadline: "2025-09-20",
    status: "progress",
  },
  {
    id: "2", 
    name: "VATReturn-POLAND-Q3-2025",
    country: "Poland",
    period: "Q3 2025",
    type: "quarterly",
    declarationType: "VAT Return",
    deadline: "2025-10-25",
    status: "progress",
  },
  {
    id: "3",
    name: "Intrastat-GERMANY-M9-2025",
    country: "Germany", 
    period: "September 2025",
    type: "monthly",
    declarationType: "Intrastat",
    deadline: "2025-10-19",
    status: "pending",
  },
  {
    id: "4",
    name: "VATReturn-FRANCE-Q3-2025",
    country: "France",
    period: "Q3 2025", 
    type: "quarterly",
    declarationType: "VAT Return",
    deadline: "2025-10-31",
    status: "review",
  },
];

export default function Declarations() {
  const [declarations] = useState<Declaration[]>(mockDeclarations);
  const navigate = useNavigate();

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Data Pending";
      case "progress": return "In Progress";
      case "review": return "Under Review";
      case "approved": return "Approved";
      case "submitted": return "Submitted";
      case "closed": return "Closed";
      default: return status;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "monthly": return "default";
      case "quarterly": return "secondary";
      default: return "outline";
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Active Declarations</h1>
            <p className="text-muted-foreground">
              Manage your VAT declarations and compliance obligations
            </p>
          </div>
          <Button className="gap-2 bg-gradient-primary">
            <Plus className="h-4 w-4" />
            New Declaration
          </Button>
        </div>

        {/* Declarations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {declarations.map((declaration) => {
            const daysLeft = getDaysUntilDeadline(declaration.deadline);
            const isUrgent = daysLeft <= 7;
            
            return (
              <Card 
                key={declaration.id} 
                className="bg-gradient-card border shadow-soft hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate(`/declarations/${declaration.id}`)}
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold">
                      {declaration.name}
                    </CardTitle>
                    <StatusBadge variant={declaration.status as any}>
                      {getStatusText(declaration.status)}
                    </StatusBadge>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {declaration.declarationType}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{declaration.country}</span>
                    <Badge variant={getTypeColor(declaration.type) as any}>
                      {declaration.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{declaration.period}</span>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Deadline:</span>
                      <span className={`text-sm font-medium ${isUrgent ? 'text-destructive' : ''}`}>
                        {new Date(declaration.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-muted-foreground">Days left:</span>
                      <Badge 
                        variant={isUrgent ? "destructive" : "default"}
                        className="text-xs"
                      >
                        {daysLeft} days
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}