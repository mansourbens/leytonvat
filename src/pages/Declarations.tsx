import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { FileText, Calendar, MapPin, Plus, Table as TableIcon, LayoutGrid } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Declaration {
  id: string;
  name: string;
  country: string;
  countryCode?: string;
  period: string;
  type: "monthly" | "quarterly";
  declarationType: "ECL" | "VAT Return" | "Intrastat";
  deadline: string;
  status: "pending" | "progress" | "review" | "approved" | "submitted" | "closed";
  priority?: "high" | "normal";
  registration?: string;
  lastUpdated?: string;
}

const mockDeclarations: Declaration[] = [
  {
    id: "1",
    name: "ECL-SPAIN-M8-2025",
    country: "Spain",
    countryCode: "ES",
    period: "August 2025",
    type: "monthly",
    declarationType: "ECL",
    deadline: "2025-09-20",
    status: "progress",
    priority: "high",
    registration: "ESB12345678",
    lastUpdated: "2025-09-10",
  },
  {
    id: "2",
    name: "VATReturn-POLAND-Q3-2025",
    country: "Poland",
    countryCode: "PL",
    period: "Q3 2025",
    type: "quarterly",
    declarationType: "VAT Return",
    deadline: "2025-10-25",
    status: "progress",
    priority: "normal",
    registration: "PL1234567890",
    lastUpdated: "2025-09-08",
  },
  {
    id: "3",
    name: "Intrastat-GERMANY-M9-2025",
    country: "Germany",
    countryCode: "DE",
    period: "September 2025",
    type: "monthly",
    declarationType: "Intrastat",
    deadline: "2025-10-19",
    status: "pending",
    priority: "normal",
    registration: "DE123456789",
    lastUpdated: "2025-09-05",
  },
  {
    id: "4",
    name: "VATReturn-FRANCE-Q3-2025",
    country: "France",
    countryCode: "FR",
    period: "Q3 2025",
    type: "quarterly",
    declarationType: "VAT Return",
    deadline: "2025-10-31",
    status: "review",
    priority: "high",
    registration: "FR12345678901",
    lastUpdated: "2025-09-12",
  },
  {
    id: "5",
    name: "VATReturn-GERMANY-Q3-2025",
    country: "Germany",
    countryCode: "DE",
    period: "Q3 2025",
    type: "quarterly",
    declarationType: "VAT Return",
    deadline: "2025-10-25",
    status: "pending",
    priority: "normal",
    registration: "DE998877665",
    lastUpdated: "2025-09-04",
  },
  {
    id: "6",
    name: "Intrastat-NETHERLANDS-M9-2025",
    country: "Netherlands",
    countryCode: "NL",
    period: "September 2025",
    type: "monthly",
    declarationType: "Intrastat",
    deadline: "2025-10-15",
    status: "progress",
    priority: "normal",
    registration: "NL123456789B01",
    lastUpdated: "2025-09-11",
  },
  {
    id: "7",
    name: "ECL-ITALY-M9-2025",
    country: "Italy",
    countryCode: "IT",
    period: "September 2025",
    type: "monthly",
    declarationType: "ECL",
    deadline: "2025-10-18",
    status: "submitted",
    priority: "normal",
    registration: "IT12345678901",
    lastUpdated: "2025-09-09",
  },
  {
    id: "8",
    name: "VATReturn-SPAIN-Q3-2025",
    country: "Spain",
    countryCode: "ES",
    period: "Q3 2025",
    type: "quarterly",
    declarationType: "VAT Return",
    deadline: "2025-10-30",
    status: "approved",
    priority: "high",
    registration: "ESX11223344",
    lastUpdated: "2025-09-07",
  },
  {
    id: "9",
    name: "VATReturn-PORUGAL-Q3-2025",
    country: "Portugal",
    countryCode: "PT",
    period: "Q3 2025",
    type: "quarterly",
    declarationType: "VAT Return",
    deadline: "2025-10-25",
    status: "pending",
    priority: "normal",
    registration: "PT123456789",
    lastUpdated: "2025-09-03",
  },
  {
    id: "10",
    name: "Intrastat-POLAND-M9-2025",
    country: "Poland",
    countryCode: "PL",
    period: "September 2025",
    type: "monthly",
    declarationType: "Intrastat",
    deadline: "2025-10-14",
    status: "progress",
    priority: "normal",
    registration: "PL5566778899",
    lastUpdated: "2025-09-10",
  },
  {
    id: "11",
    name: "VATReturn-IRELAND-Q3-2025",
    country: "Ireland",
    countryCode: "IE",
    period: "Q3 2025",
    type: "quarterly",
    declarationType: "VAT Return",
    deadline: "2025-11-01",
    status: "pending",
    priority: "normal",
    registration: "IE1234567A",
    lastUpdated: "2025-09-06",
  },
  {
    id: "12",
    name: "ECL-FRANCE-M9-2025",
    country: "France",
    countryCode: "FR",
    period: "September 2025",
    type: "monthly",
    declarationType: "ECL",
    deadline: "2025-10-17",
    status: "progress",
    priority: "normal",
    registration: "FR99887766554",
    lastUpdated: "2025-09-13",
  },
  {
    id: "13",
    name: "VATReturn-AUSTRIA-Q3-2025",
    country: "Austria",
    countryCode: "AT",
    period: "Q3 2025",
    type: "quarterly",
    declarationType: "VAT Return",
    deadline: "2025-10-28",
    status: "review",
    priority: "high",
    registration: "ATU12345678",
    lastUpdated: "2025-09-12",
  },
  {
    id: "14",
    name: "Intrastat-BELGIUM-M9-2025",
    country: "Belgium",
    countryCode: "BE",
    period: "September 2025",
    type: "monthly",
    declarationType: "Intrastat",
    deadline: "2025-10-13",
    status: "pending",
    priority: "normal",
    registration: "BE0123456789",
    lastUpdated: "2025-09-08",
  },
  {
    id: "15",
    name: "VATReturn-ITALY-Q3-2025",
    country: "Italy",
    countryCode: "IT",
    period: "Q3 2025",
    type: "quarterly",
    declarationType: "VAT Return",
    deadline: "2025-10-27",
    status: "submitted",
    priority: "normal",
    registration: "IT98765432109",
    lastUpdated: "2025-09-02",
  },
];

export default function Declarations() {
  const [declarations, setDeclarations] = useState<Declaration[]>(mockDeclarations);
  const [viewMode, setViewMode] = useState<"cards" | "table">("table");
  const [search, setSearch] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterFrequency, setFilterFrequency] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortKey, setSortKey] = useState<string>("deadline");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [openCreate, setOpenCreate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Sync persisted statuses from validation view
    setDeclarations((prev) =>
      prev.map((d) => {
        try {
          const stored = localStorage.getItem(`declaration:${d.id}:status`);
          if (stored && stored !== d.status) {
            return { ...d, status: stored as Declaration["status"] };
          }
        } catch (_) {
          // ignore
        }
        return d;
      })
    );
  }, []);

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Data pending";
      case "progress":
        return "In preparation";
      case "review":
        return "Awaiting remark validation";
      case "approved":
        return "Awaiting Approval and payment";
      case "submitted":
        return "Awaiting submission";
      case "closed":
        return "Closed";
      default:
        return status;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "monthly":
        return "default";
      case "quarterly":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredSorted = declarations
    .filter((d) => (filterCountry === "all" || d.countryCode === filterCountry))
    .filter((d) => (filterType === "all" || d.declarationType === filterType))
    .filter((d) => (filterStatus === "all" || d.status === filterStatus))
    .filter((d) => (filterFrequency === "all" || d.type === filterFrequency))
    .filter((d) => (filterPriority === "all" || (d.priority || "normal") === filterPriority))
    .filter((d) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.period.toLowerCase().includes(q) ||
        d.declarationType.toLowerCase().includes(q) ||
        (d.registration || "").toLowerCase().includes(q) ||
        d.status.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "deadline") return (new Date(a.deadline).getTime() - new Date(b.deadline).getTime()) * dir;
      const av = (a as any)[sortKey] || "";
      const bv = (b as any)[sortKey] || "";
      return String(av).localeCompare(String(bv)) * dir;
    });

  const setSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="sticky top-0 h-screen w-64 shrink-0 z-20">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Active Declarations</h1>
              <p className="text-muted-foreground">Manage your VAT declarations and compliance obligations</p>
            </div>
          </div>

          {/* Filters */}
          <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}
                title={viewMode === "table" ? "Switch to Cards" : "Switch to Table"}
              >
                {viewMode === "table" ? <LayoutGrid className="h-4 w-4" /> : <TableIcon className="h-4 w-4" />}
              </Button>
          {viewMode === "table" && (
            <div className="flex items-center gap-2">
              <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
              <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Country" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All countries</SelectItem>
                  <SelectItem value="ES">Spain</SelectItem>
                  <SelectItem value="PL">Poland</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                  <SelectItem value="FR">France</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-44"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="VAT Return">VAT Return</SelectItem>
                  <SelectItem value="ECL">ECL</SelectItem>
                  <SelectItem value="Intrastat">Intrastat</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterFrequency} onValueChange={setFilterFrequency}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Frequency" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="pending">Data Pending</SelectItem>
                  <SelectItem value="progress">In Progress</SelectItem>
                  <SelectItem value="review">En cours de vérification</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="ml-auto" onClick={() => { setSearch(""); setFilterCountry("all"); setFilterType("all"); setFilterStatus("all"); setFilterFrequency("all"); setFilterPriority("all"); }}>Clear</Button>
            </div>
          )}

          {viewMode === "cards" ? (
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
                        <CardTitle className="text-lg font-semibold">{declaration.name}</CardTitle>
                        <StatusBadge variant={declaration.status as any}>{getStatusText(declaration.status)}</StatusBadge>
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
                        <Badge variant={getTypeColor(declaration.type) as any}>{declaration.type}</Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{declaration.period}</span>
                      </div>

                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Deadline:</span>
                          <span className={`text-sm font-medium ${isUrgent ? "text-destructive" : ""}`}>
                            {new Date(declaration.deadline).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-muted-foreground">Days left:</span>
                          <Badge variant={isUrgent ? "destructive" : "default"} className="text-xs">
                            {daysLeft} days
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="bg-gradient-card border shadow-soft">
              <CardHeader>
                <CardTitle>Active Declarations</CardTitle>
                <CardDescription>All ongoing declarations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto max-h-[60vh] rounded-md">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        {[
                          { key: "name", label: "Declaration" },
                          { key: "country", label: "Country" },
                          { key: "registration", label: "VAT Reg." },
                          { key: "declarationType", label: "Type" },
                          { key: "type", label: "Freq." },
                          { key: "period", label: "Period" },
                          { key: "deadline", label: "Deadline" },
                          { key: "status", label: "Status" },
                          { key: "priority", label: "Priority" },
                          { key: "lastUpdated", label: "Last Updated" },
                          { key: "actions", label: "Actions" },
                        ].map((c) => (
                          <th key={c.key} className="text-left px-3 py-2 select-none cursor-pointer" onClick={() => c.key !== 'actions' && setSort(c.key)}>
                            <div className="flex items-center gap-1">
                              <span>{c.label}</span>
                              {sortKey === c.key && <span className="text-xs">{sortDir === 'asc' ? '▲' : '▼'}</span>}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSorted.map((d, idx) => (
                        <tr key={d.id} className={`${idx % 2 === 0 ? 'bg-muted/30' : 'bg-muted/60'} hover:bg-primary/10 transition-colors`}>
                          <td className="px-3 py-2 font-medium">{d.name}</td>
                          <td className="px-3 py-2">{d.country}</td>
                          <td className="px-3 py-2">{d.registration || '-'}</td>
                          <td className="px-3 py-2">{d.declarationType}</td>
                          <td className="px-3 py-2">{d.type}</td>
                          <td className="px-3 py-2">{d.period}</td>
                          <td className="px-3 py-2">{new Date(d.deadline).toLocaleDateString()}</td>
                          <td className="px-3 py-2"><StatusBadge variant={d.status as any}>{getStatusText(d.status)}</StatusBadge></td>
                          <td className="px-3 py-2">{d.priority === 'high' ? <Badge variant="destructive">High</Badge> : <Badge>Normal</Badge>}</td>
                          <td className="px-3 py-2">{d.lastUpdated || '-'}</td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" onClick={() => navigate(`/declarations/${d.id}`)}>Open</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}