import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { WorkflowProgress } from "@/components/ui/workflow-progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Upload,
  Eye,
  MoreHorizontal,
} from "lucide-react";

// Mock data for demonstration
const workflowSteps = [
  {
    id: "1",
    title: "Data Upload",
    description: "Client uploads VAT data files",
    status: "completed" as const,
  },
  {
    id: "2",
    title: "Compliance Controls",
    description: "Automated validation and VIES checks",
    status: "completed" as const,
  },
  {
    id: "3",
    title: "Team Review",
    description: "Internal validation by VAT specialists",
    status: "current" as const,
  },
  {
    id: "4",
    title: "Draft Validation",
    description: "Client approval of prepared declaration",
    status: "pending" as const,
  },
  {
    id: "5",
    title: "Submission Approval",
    description: "Final approval and payment confirmation",
    status: "pending" as const,
  },
  {
    id: "6",
    title: "Archive & Completion",
    description: "Declaration filed and archived",
    status: "pending" as const,
  },
];

const recentObligations = [
  {
    id: "1",
    country: "Germany",
    type: "VAT Return",
    period: "Q3 2024",
    deadline: "2024-10-31",
    status: "review" as const,
    client: "TechCorp GmbH",
  },
  {
    id: "2",
    country: "France",
    type: "Intrastat",
    period: "September 2024",
    deadline: "2024-10-19",
    status: "approved" as const,
    client: "InnovateSAS",
  },
  {
    id: "3",
    country: "Netherlands",
    type: "VAT Return",
    period: "Q3 2024",
    deadline: "2024-10-31",
    status: "pending" as const,
    client: "Global Trading B.V.",
  },
  {
    id: "4",
    country: "Spain",
    type: "ECL",
    period: "Q3 2024",
    deadline: "2024-11-30",
    status: "progress" as const,
    client: "Iberian Solutions S.L.",
  },
];

const upcomingDeadlines = [
  { date: "Oct 19", country: "FR", type: "Intrastat", urgent: true },
  { date: "Oct 31", country: "DE", type: "VAT Return", urgent: false },
  { date: "Oct 31", country: "NL", type: "VAT Return", urgent: false },
  { date: "Nov 15", country: "IT", type: "VAT Return", urgent: false },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">VAT Compliance Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage VAT obligations across multiple EU countries
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            View Calendar
          </Button>
          <Button className="gap-2 bg-gradient-primary">
            <Upload className="h-4 w-4" />
            Upload Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Pending Obligations"
          value="12"
          description="Requiring immediate attention"
          icon={Clock}
          trend={{ value: 8, label: "from last month", direction: "down" }}
        />
        <MetricCard
          title="In Progress"
          value="28"
          description="Currently being processed"
          icon={FileText}
          trend={{ value: 15, label: "from last month", direction: "up" }}
        />
        <MetricCard
          title="Completed This Month"
          value="45"
          description="Successfully submitted"
          icon={CheckCircle2}
          trend={{ value: 22, label: "from last month", direction: "up" }}
        />
        <MetricCard
          title="Alerts"
          value="3"
          description="Issues requiring review"
          icon={AlertTriangle}
          trend={{ value: 50, label: "from last week", direction: "down" }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Workflow Status */}
        <Card className="bg-gradient-card border shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Current Workflow: Germany VAT Q3 2024
            </CardTitle>
            <CardDescription>
              TechCorp GmbH • Deadline: October 31, 2024
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WorkflowProgress steps={workflowSteps} />
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="bg-gradient-card border shadow-soft">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>
              Critical dates requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingDeadlines.map((deadline, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      deadline.urgent ? "bg-destructive" : "bg-warning"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium">{deadline.date}</p>
                    <p className="text-xs text-muted-foreground">
                      {deadline.country} • {deadline.type}
                    </p>
                  </div>
                </div>
                {deadline.urgent && (
                  <Badge variant="destructive" className="text-xs">
                    Urgent
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent VAT Obligations */}
      <Card className="bg-gradient-card border shadow-soft">
        <CardHeader>
          <CardTitle>Recent VAT Obligations</CardTitle>
          <CardDescription>
            Overview of current and recent submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentObligations.map((obligation) => (
              <div
                key={obligation.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-background/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <StatusBadge variant={obligation.status}>
                      {obligation.status === "pending" && "Data Pending"}
                      {obligation.status === "progress" && "In Preparation"}
                      {obligation.status === "review" && "Under Review"}
                      {obligation.status === "approved" && "Approved"}
                    </StatusBadge>
                  </div>
                  <div>
                    <p className="font-medium">
                      {obligation.country} • {obligation.type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {obligation.client} • {obligation.period}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      Due: {new Date(obligation.deadline).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Math.ceil(
                        (new Date(obligation.deadline).getTime() - new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days remaining
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}