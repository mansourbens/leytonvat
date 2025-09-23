import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Download, FileText, Filter, Grid, LayoutGrid, ListFilter, Printer, Search, User } from "lucide-react";

type ViewMode = "month" | "quarter" | "year";

interface Obligation {
  id: string;
  date: string; // ISO string
  country: "ES" | "DE" | "FR" | "PL" | "IT" | "NL";
  type: "VAT" | "Intrastat" | "ECL" | "Corrective";
  status: "pending" | "progress" | "review" | "approved" | "submitted";
  period: string; // M08 2025, Q3 2025 etc
  title: string;
  priority?: "high" | "normal";
}

const countryBorder: Record<Obligation["country"], string> = {
  ES: "border-l-red-500",
  DE: "border-l-yellow-500",
  FR: "border-l-blue-500",
  PL: "border-l-rose-500",
  IT: "border-l-green-600",
  NL: "border-l-orange-500",
};

const typeBadge: Record<Obligation["type"], { label: string; className: string }> = {
  VAT: { label: "VAT Return", className: "bg-blue-500 text-white" },
  Intrastat: { label: "Intrastat", className: "bg-orange-500 text-white" },
  ECL: { label: "ECL", className: "bg-green-500 text-white" },
  Corrective: { label: "Corrective", className: "bg-red-500 text-white" },
};

const statusBadge: Record<Obligation["status"], { label: string; variant: any }> = {
  pending: { label: "Data Pending", variant: "outline" },
  progress: { label: "In Preparation", variant: "warning" },
  review: { label: "Review Required", variant: "secondary" },
  approved: { label: "Awaiting Approval", variant: "default" },
  submitted: { label: "Submitted", variant: "accent" },
};

const mockObligations: Obligation[] = [
  { id: "1", date: new Date().toISOString(), country: "ES", type: "VAT", status: "progress", period: "M09 2025", title: "ES VAT M09/2025", priority: "high" },
  { id: "2", date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), country: "DE", type: "Intrastat", status: "pending", period: "M09 2025", title: "DE Intrastat M09/2025" },
  { id: "3", date: new Date(new Date().setDate(new Date().getDate() + 6)).toISOString(), country: "FR", type: "ECL", status: "review", period: "M09 2025", title: "FR ECL M09/2025" },
  { id: "4", date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), country: "PL", type: "VAT", status: "approved", period: "Q3 2025", title: "PL VAT Q3/2025" },
  { id: "5", date: new Date(new Date().setDate(new Date().getDate() + 12)).toISOString(), country: "IT", type: "Corrective", status: "progress", period: "M09 2025", title: "IT Corrective" },
  { id: "6", date: new Date(new Date().setDate(new Date().getDate() + 18)).toISOString(), country: "NL", type: "VAT", status: "submitted", period: "M09 2025", title: "NL VAT M09/2025" },
];

function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }
function addMonths(d: Date, n: number) { return new Date(d.getFullYear(), d.getMonth() + n, 1); }

function monthGrid(current: Date) {
  const start = startOfMonth(current);
  const end = endOfMonth(current);
  const startDay = (start.getDay() + 6) % 7; // Mon=0
  const days: Date[] = [];
  for (let i = 0; i < startDay; i++) days.push(new Date(start.getTime() - (startDay - i) * 86400000));
  for (let d = 1; d <= end.getDate(); d++) days.push(new Date(current.getFullYear(), current.getMonth(), d));
  while (days.length % 7 !== 0) days.push(new Date(days[days.length - 1].getTime() + 86400000));
  return days;
}

export default function CalendarPage() {
  const [view, setView] = useState<ViewMode>("month");
  const [cursor, setCursor] = useState<Date>(new Date());
  const [country, setCountry] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState<Obligation | null>(null);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return mockObligations.filter(o =>
      (country === "all" || o.country === country) &&
      (type === "all" || o.type === type) &&
      (status === "all" || o.status === status) &&
      (search.trim() === "" || o.title.toLowerCase().includes(search.toLowerCase()))
    );
  }, [country, type, status, search]);

  const days = useMemo(() => monthGrid(cursor), [cursor]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-5 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setCursor(addMonths(cursor, -1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-lg font-semibold">
                {cursor.toLocaleString(undefined, { month: "long", year: "numeric" })}
              </div>
              <Button variant="outline" size="icon" onClick={() => setCursor(addMonths(cursor, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="ml-3 flex items-center gap-2">
                <Button variant={view === "month" ? "default" : "outline"} size="sm" onClick={() => setView("month")}>Month</Button>
                <Button variant={view === "quarter" ? "default" : "outline"} size="sm" onClick={() => setView("quarter")}>Quarter</Button>
                <Button variant={view === "year" ? "default" : "outline"} size="sm" onClick={() => setView("year")}>Year</Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input placeholder="Search obligations" value={search} onChange={(e) => setSearch(e.target.value)} className="w-56" />
              <Button variant="outline" size="icon"><FileText className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon"><Printer className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon"><User className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Country" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All countries</SelectItem>
                <SelectItem value="ES">Spain</SelectItem>
                <SelectItem value="DE">Germany</SelectItem>
                <SelectItem value="FR">France</SelectItem>
                <SelectItem value="PL">Poland</SelectItem>
                <SelectItem value="IT">Italy</SelectItem>
                <SelectItem value="NL">Netherlands</SelectItem>
              </SelectContent>
            </Select>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="VAT">VAT Return</SelectItem>
                <SelectItem value="Intrastat">Intrastat</SelectItem>
                <SelectItem value="ECL">ECL</SelectItem>
                <SelectItem value="Corrective">Corrective</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="pending">Data Pending</SelectItem>
                <SelectItem value="progress">In Preparation</SelectItem>
                <SelectItem value="review">Review Required</SelectItem>
                <SelectItem value="approved">Awaiting Approval</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="ml-auto gap-2"><ListFilter className="h-4 w-4" /> Advanced</Button>
          </div>

          {/* Month view grid */}
          {view === "month" && (
            <Card className="bg-gradient-card border shadow-soft">
              <CardContent className="pt-4">
                <div className="grid grid-cols-7 gap-2">
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
                    <div key={d} className="text-[12px] font-medium text-muted-foreground px-2">{d}</div>
                  ))}
                  {days.map((day, idx) => {
                    const isToday = new Date().toDateString() === day.toDateString();
                    const isCurrentMonth = day.getMonth() === cursor.getMonth();
                    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                    const dayObls = filtered.filter(o => new Date(o.date).toDateString() === day.toDateString());
                    return (
                      <div key={idx} className={`min-h-[120px] rounded-md border p-2.5 ${isWeekend ? 'bg-muted/40' : 'bg-background/60'} ${!isCurrentMonth ? 'opacity-50' : ''} ${isToday ? 'ring-2 ring-primary' : ''}`}>
                        <div className="text-[12px] font-semibold mb-1">{day.getDate()}</div>
                        <div className="space-y-1.5">
                          {dayObls.map((o) => (
                            <div
                              key={o.id}
                              onClick={() => setOpen(o)}
                              className={`border-l-4 ${countryBorder[o.country]} bg-background/70 rounded-md p-2 cursor-pointer hover:bg-muted/50 transition`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[12px] font-medium truncate">{o.title}</span>
                                {o.priority === 'high' && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                              </div>
                              <div className="mt-1 flex items-center gap-1.5">
                                <span className={`text-[11px] px-1.5 py-0.5 rounded ${typeBadge[o.type].className}`}>{typeBadge[o.type].label}</span>
                                <Badge variant={statusBadge[o.status].variant as any} className="text-[11px]">
                                  {statusBadge[o.status].label}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quarter view (simplified) */}
          {view === "quarter" && (
            <Card className="bg-gradient-card border shadow-soft">
              <CardContent className="pt-3">
                <div className="grid grid-cols-3 gap-3">
                  {[0,1,2].map((i) => {
                    const monthDate = addMonths(cursor, i);
                    const label = monthDate.toLocaleString(undefined, { month: 'long', year: 'numeric' });
                    const monthObls = filtered.filter(o => new Date(o.date).getMonth() === monthDate.getMonth());
                    return (
                      <div key={i} className="rounded-md border p-2 cursor-pointer hover:bg-muted/40" onClick={() => { setCursor(monthDate); setView('month'); }}>
                        <div className="font-semibold mb-1 text-sm">{label}</div>
                        <div className="space-y-1">
                          {monthObls.slice(0,5).map(o => (
                            <div key={o.id} className={`border-l-4 ${countryBorder[o.country]} bg-background/70 rounded-md p-1.5`} onClick={(e) => { e.stopPropagation(); setOpen(o); }}>
                              <div className="flex items-center justify-between text-xs">
                                <span className="truncate">{o.title}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${typeBadge[o.type].className}`}>{typeBadge[o.type].label}</span>
                              </div>
                            </div>
                          ))}
                          {monthObls.length === 0 && (
                            <div className="text-[11px] text-muted-foreground">No critical obligations</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Year view (simplified heat-map like density) */}
          {view === "year" && (
            <Card className="bg-gradient-card border shadow-soft">
              <CardContent className="pt-3">
                <div className="grid grid-cols-4 gap-3">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const monthDate = new Date(cursor.getFullYear(), i, 1);
                    const count = filtered.filter(o => new Date(o.date).getMonth() === i).length;
                    const intensity = count >= 5 ? 'bg-blue-500/30' : count >= 3 ? 'bg-blue-500/20' : count >= 1 ? 'bg-blue-500/10' : 'bg-muted/40';
                    return (
                      <div key={i} className={`rounded-md border p-2 ${intensity} cursor-pointer hover:brightness-95`} onClick={() => { setCursor(monthDate); setView('month'); }}>
                        <div className="font-medium text-sm">{monthDate.toLocaleString(undefined, { month: 'long' })}</div>
                        <div className="text-[11px] text-muted-foreground">{count} obligations</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Right details panel */}
      <Sheet open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <SheetContent className="w-[420px] sm:w-[540px] overflow-auto">
          {open && (
            <div className="space-y-4">
              <SheetHeader>
                <SheetTitle>{open.title}</SheetTitle>
                <SheetDescription>
                  {open.country} • {open.period}
                </SheetDescription>
              </SheetHeader>

              <div className="grid grid-cols-3 gap-3">
                <Card>
                  <CardContent className="pt-4 text-center">
                    <div className="text-xs text-muted-foreground">Data Deadline</div>
                    <div className="text-sm font-medium">{new Date(open.date).toLocaleDateString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <div className="text-xs text-muted-foreground">Payment Deadline</div>
                    <div className="text-sm font-medium">{new Date(open.date).toLocaleDateString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <div className="text-xs text-muted-foreground">Filing Deadline</div>
                    <div className="text-sm font-medium">{new Date(open.date).toLocaleDateString()}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${typeBadge[open.type].className}`}>{typeBadge[open.type].label}</span>
                <Badge variant={statusBadge[open.status].variant as any}>{statusBadge[open.status].label}</Badge>
                {open.priority === 'high' && <Badge variant="destructive">High</Badge>}
              </div>

              <div className="flex items-center gap-2">
                <Button className="bg-gradient-primary flex-1" onClick={() => { if (open) { setOpen(null); navigate(`/declarations/${open.id}`); } }}>Go to declaration</Button>
                <Button variant="outline" className="flex-1">Download Template</Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Comments & Notes</CardTitle>
                  <CardDescription>Add internal notes for this obligation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">(Mock) Conversation thread and attachments go here.</div>
                </CardContent>
              </Card>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}


