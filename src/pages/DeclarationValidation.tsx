import { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { ArrowLeft, RefreshCw, CheckCircle2, AlertTriangle, Download, Pencil, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/layout/sidebar";
import { WorkflowProgress } from "@/components/ui/workflow-progress";

interface ValidationError {
  id: string;
  line: number;
  field: string;
  rule: string;
  severity: "error" | "warning" | "info";
  message: string;
  suggestedFix?: string;
}

const mockLedgerData = [
  { id: "1", line: 1, date: "2025-08-01", description: "Sale to Customer A", amount: "1000.00", vat: "200.00", country: "ES" },
  { id: "2", line: 2, date: "2025-08-02", description: "Purchase from Supplier B", amount: "-500.00", vat: "", country: "DE" },
  { id: "3", line: 3, date: "2025-08-03", description: "Service Revenue", amount: "750.00", vat: "-157.50", country: "ES" },
  { id: "4", line: 4, date: "2025-08-04", description: "Equipment Purchase", amount: "-1200.00", vat: "-252.00", country: "FR" },
  { id: "5", line: 5, date: "2025-08-05", description: "Consulting Service", amount: "2000.00", vat: "420.00", country: "ES" },
  { id: "6", line: 6, date: "2025-08-06", description: "Export Sale", amount: "3400.00", vat: "0.00", country: "PT" },
  { id: "7", line: 7, date: "2025-08-07", description: "Office Rent", amount: "-900.00", vat: "-189.00", country: "ES" },
  { id: "8", line: 8, date: "2025-08-08", description: "Software Subscription", amount: "-120.00", vat: "-25.20", country: "NL" },
  { id: "9", line: 9, date: "2025-08-09", description: "Sale to Customer C", amount: "1500.00", vat: "315.00", country: "ES" },
  { id: "10", line: 10, date: "2025-08-10", description: "Travel Expenses", amount: "-300.00", vat: "-63.00", country: "ES" },
  { id: "11", line: 11, date: "2025-08-11", description: "Consultancy Income", amount: "800.00", vat: "168.00", country: "ES" },
  { id: "12", line: 12, date: "2025-08-12", description: "Asset Purchase", amount: "-2400.00", vat: "-504.00", country: "DE" },
  { id: "13", line: 13, date: "2025-08-13", description: "Training", amount: "-200.00", vat: "-42.00", country: "FR" },
  { id: "14", line: 14, date: "2025-08-14", description: "Service Revenue EU", amount: "1000.00", vat: "", country: "IT" },
  { id: "15", line: 15, date: "2025-08-15", description: "Misc Expense", amount: "-50.00", vat: "-10.50", country: "ES" },
];

// NOTE: errors randomness should be generated once per mount; no global ledger state here

// Build a mock set of errors based on provided business rules, randomly applied to lines
function generateMockErrors(lines: { line: number }[]): ValidationError[] {
  const lineNumbers = lines.map(l => l.line);
  // Reserve 5 random clean lines (no errors of any kind)
  const shuffledAll = [...lineNumbers].sort(() => Math.random() - 0.5);
  const cleanLines = new Set<number>(shuffledAll.slice(0, Math.min(5, shuffledAll.length)));

  const pickSome = (count: number) => {
    const candidates = lineNumbers.filter(ln => !cleanLines.has(ln));
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  };

  let idCounter = 1;
  const nextId = () => String(idCounter++);

  const errors: ValidationError[] = [];

  // CRITICAL (severity: error)
  const crit1Lines = pickSome(2);
  if (crit1Lines.length) {
    crit1Lines.forEach((ln) => {
      errors.push({
        id: nextId(),
        line: ln,
        field: "mandatory",
        rule: "MANDATORY_FIELDS_MISSING",
        severity: "error",
        message: `We have identified that mandatory fields in line ${ln} have not been completed. Please ensure that the data is completed before uploading.`,
      });
    });
  }

  const crit2Lines = pickSome(2);
  if (crit2Lines.length) {
    crit2Lines.forEach((ln) => {
      errors.push({
        id: nextId(),
        line: ln,
        field: "vatNumber",
        rule: "IC_VAT_NUMBER_MISSING",
        severity: "error",
        message: `IC transaction in line ${ln} does not include a VAT number. Please include the mandatory information. Otherwise VAT exemption cannot be applied.`,
      });
    });
  }

  const crit3Lines = pickSome(1);
  if (crit3Lines.length) {
    crit3Lines.forEach((ln) => {
      errors.push({
        id: nextId(),
        line: ln,
        field: "vat",
        rule: "IC_VAT_ZERO",
        severity: "error",
        message: `IC transaction in line ${ln} does not include VAT rate/amount. VAT exemption will still be applied.`,
      });
    });
  }

  const crit4Lines = pickSome(2);
  crit4Lines.forEach((ln) => {
    errors.push({
      id: nextId(),
      line: ln,
      field: "totals",
      rule: "NET_VAT_GROSS_MISMATCH",
      severity: "error",
      message: `Total Net + Total VAT != Total Gross in line ${ln}. Please review before uploading.`,
    });
  });

  const crit5Lines = pickSome(1);
  crit5Lines.forEach((ln) => {
    errors.push({
      id: nextId(),
      line: ln,
      field: "vat",
      rule: "VAT_CALCULATION_INCORRECT",
      severity: "error",
      message: `The VAT amount has not been correctly calculated based on the VAT rate (line ${ln}). Please review the data before uploading.`,
    });
  });

  const crit6Lines = pickSome(1);
  crit6Lines.forEach((ln) => {
    errors.push({
      id: nextId(),
      line: ln,
      field: "code",
      rule: "IOSS_INCORRECT_USAGE",
      severity: "error",
      message: `IOSS code appears to be used incorrectly (line ${ln}). Please review before uploading.`,
    });
  });

  const crit7Lines = pickSome(1);
  crit7Lines.forEach((ln) => {
    errors.push({
      id: nextId(),
      line: ln,
      field: "code",
      rule: "OSS_INCORRECT_USAGE",
      severity: "error",
      message: `OSS code appears to be used incorrectly (line ${ln}). Please review before uploading.`,
    });
  });

  const crit8Lines = pickSome(1);
  crit8Lines.forEach((ln) => {
    errors.push({
      id: nextId(),
      line: ln,
      field: "currency",
      rule: "LOCAL_CURRENCY_MISMATCH",
      severity: "error",
      message: `Local currency does not match registration country (line ${ln}). Please review before uploading.`,
    });
  });

  const crit9Lines = pickSome(1);
  crit9Lines.forEach((ln) => {
    errors.push({
      id: nextId(),
      line: ln,
    field: "vat",
      rule: "A5_SHOULD_BE_ZERO",
    severity: "error",
      message: `VAT rate/amount should be 0 for A5 transactions (line ${ln}). Please amend the data uploaded.`,
    });
  });

  // WARNINGS
  const warn1Lines = pickSome(2);
  warn1Lines.forEach((ln) => {
    errors.push({
      id: nextId(),
      line: ln,
      field: "date",
      rule: "PERIOD_MISMATCH",
      severity: "warning",
      message: `Invoice in line ${ln} is dated from a previous fiscal period. Our team will review any potential issues with the tax point.`,
    });
  });

  const warn2Lines = pickSome(1);
  warn2Lines.forEach((ln) => {
    errors.push({
      id: nextId(),
      line: ln,
      field: "credit",
      rule: "CREDIT_NOTE_HIGHER",
      severity: "warning",
      message: `Credit note in line ${ln} credits an amount higher than its original invoice. Please review the data uploaded.`,
    });
  });

  const warn3Lines = pickSome(2);
  warn3Lines.forEach((ln) => {
    errors.push({
      id: nextId(),
      line: ln,
      field: "vatNumber",
      rule: "VIES_INVALID",
      severity: "warning",
      message: `IC transactions in line ${ln} include an invalid VAT number. Please include a valid VAT number or confirm historical validity.`,
    });
  });

  const warn4Lines = pickSome(1);
  warn4Lines.forEach((ln) => {
    errors.push({
      id: nextId(),
      line: ln,
      field: "invoice",
      rule: "INVOICE_DUPLICATED",
      severity: "warning",
      message: `Invoice in line ${ln} appears duplicated in a previous period. Please confirm and amend the data accordingly.`,
    });
  });

  const warn5Lines = pickSome(1);
  warn5Lines.forEach((ln) => {
    errors.push({
      id: nextId(),
      line: ln,
      field: "currency",
      rule: "CONVERSION_INCONSISTENT",
      severity: "warning",
      message: `Conversion indicated but totals are the same in line ${ln}. Please confirm and amend the data uploaded.`,
    });
  });

  const warn6Lines = pickSome(1);
  warn6Lines.forEach((ln) => {
    errors.push({
      id: nextId(),
      line: ln,
      field: "vat",
      rule: "UNKNOWN_VAT_RATE",
      severity: "warning",
      message: `VAT rate used in line ${ln} is not applied in this country. Please confirm and amend.`,
    });
  });

  const warn7Lines = pickSome(1);
  warn7Lines.forEach((ln) => {
    errors.push({
      id: nextId(),
      line: ln,
      field: "export",
      rule: "EXPORT_VAT_AMOUNT_PRESENT",
      severity: "warning",
      message: `Export transaction in line ${ln} includes VAT amount. We will disregard and consider zero unless advised otherwise.`,
    });
  });

  const warn8Lines = pickSome(1);
  warn8Lines.forEach((ln) => {
    errors.push({
      id: nextId(),
      line: ln,
      field: "export",
      rule: "EXPORT_VAT_NUMBER_PRESENT",
    severity: "warning",
      message: `Export transaction in line ${ln} includes a VAT number. We will disregard unless advised otherwise.`,
    });
  });

  // INFO
  const info1Lines = pickSome(2);
  info1Lines.forEach((ln) => {
    errors.push({
      id: nextId(),
      line: ln,
      field: "currency",
      rule: "CONVERSION_USED",
      severity: "info",
      message: `Transactions in line ${ln} have been converted. Contact us if you wish our team to confirm the conversion sources used.`,
    });
  });

  const info2Lines = pickSome(1);
  info2Lines.forEach((ln) => {
    errors.push({
      id: nextId(),
      line: ln,
      field: "credit",
      rule: "CN_EXCHANGE_RATE",
      severity: "info",
      message: `Converted credit note in line ${ln}. Please ensure it uses the same exchange rate as the original invoice.`,
    });
  });

  const info3Lines = pickSome(1);
  info3Lines.forEach((ln) => {
    errors.push({
      id: nextId(),
      line: ln,
      field: "name",
      rule: "VIES_NAME_MISMATCH",
      severity: "info",
      message: `Name in IC transaction (line ${ln}) does not match VIES. We can adjust if you wish.`,
    });
  });

  const info4Lines = pickSome(1);
  info4Lines.forEach((ln) => {
    errors.push({
      id: nextId(),
      line: ln,
      field: "taxCode",
      rule: "NEW_TAX_CODE",
      severity: "info",
      message: `New tax code detected in line ${ln}. We can review the transaction as an additional service.`,
    });
  });

  const info5Lines = pickSome(1);
  info5Lines.forEach((ln) => {
    errors.push({
      id: nextId(),
      line: ln,
      field: "vat",
      rule: "REDUCED_VAT_RATE",
    severity: "info", 
      message: `Reduced VAT rate reported in line ${ln}. We can confirm correct application if needed.`,
    });
  });

  return errors;
}

const ledgerColumns = [
  { key: "line", label: "Line" },
  { key: "date", label: "Date" },
  { key: "description", label: "Description" },
  { key: "amount", label: "Amount" },
  { key: "vat", label: "VAT" },
  { key: "country", label: "Country" }
];

const errorColumns = [
  { key: "line", label: "Line" },
  { key: "field", label: "Field" },
  { key: "rule", label: "Rule" },
  { key: "severity", label: "Severity" },
  { key: "message", label: "Message" }
];

export default function DeclarationValidation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<"all" | "error" | "warning" | "info">("all");
  const [rowTab, setRowTab] = useState<"all" | "clean" | "issues">("all");
  const [editingCell, setEditingCell] = useState<{line: number, field: string} | null>(null);
  const [editValue, setEditValue] = useState("");
  const [ledgerData, setLedgerData] = useState(mockLedgerData);
  const rowRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  // Generate errors only once to avoid re-randomization on edits
  const [errors, setErrors] = useState<ValidationError[]>(() => generateMockErrors(mockLedgerData));

  // Determine highest-severity issue for a given line/field (error > warning > info)
  const getCellIssueSeverity = (line: number, field: string): "error" | "warning" | "info" | null => {
    const issues = errors.filter(e => e.line === line && e.field === field);
    if (issues.some(i => i.severity === "error")) return "error";
    if (issues.some(i => i.severity === "warning")) return "warning";
    if (issues.some(i => i.severity === "info")) return "info";
    return null;
  };

  const handleLineSelect = (line: number) => {
    setSelectedLine(line);
  };

  const scrollToLine = (line: number) => {
    setSelectedLine(line);
    // Scroll into view after selection state updates
    setTimeout(() => {
      const el = rowRefs.current.get(line);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  };

  const startEdit = (line: number, field: string, currentValue: string) => {
    setEditingCell({ line, field });
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (!editingCell) return;
    
    setLedgerData(prev => 
      prev.map(row => {
        if (row.line === editingCell.line) {
          return { ...row, [editingCell.field]: editValue };
        }
        return row;
      })
    );
    
    // Mark any errors for this line+field as resolved
    setErrors(prev => prev.filter(e => !(e.line === editingCell.line && e.field === editingCell.field)));

    setEditingCell(null);
    setEditValue("");
    
    toast({
      title: "Field Updated",
      description: `Updated ${editingCell.field} for line ${editingCell.line}`,
    });
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const handleResubmit = () => {
    setIsResubmitting(true);
    setTimeout(() => {
      setIsResubmitting(false);
      toast({
        title: "Declaration Resubmitted", 
        description: "Your corrected declaration has been resubmitted for validation",
      });
    }, 2000);
  };

  const handleContinue = () => {
    // Allow user to proceed without blocking; move to recap review
    navigate(`/declarations/${id}/review`);
  };

  const getErrorsForLine = (line: number) => {
    return errors.filter(error => error.line === line);
  };

  const getDisplayedErrors = () => {
    let list = selectedLine ? getErrorsForLine(selectedLine) : errors;
    if (severityFilter !== "all") {
      list = list.filter((e) => e.severity === severityFilter);
    }
    return list;
  };

  const getSeverityColor = (severity: string) => {
    // Map: info=green, warning=yellow, critical(red)=error
    switch (severity) {
      case "error":
        return "destructive"; // red critical
      case "warning":
        return "warning"; // yellow
      case "info":
        return "accent"; // green
      default:
        return "outline";
    }
  };

  const errorCount = errors.filter(e => e.severity === "error").length;
  const warningCount = errors.filter(e => e.severity === "warning").length;
  const validPercent = Math.round(((ledgerData.length - errorCount) / ledgerData.length) * 100);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm" 
            onClick={() => navigate(`/declarations/${id}`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Declaration
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">Automatic Validation</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-muted-foreground mr-3">
                ECL-SPAIN-M8-2025 • Review validation results and fix errors
              </p>
              <Badge variant="outline" className="text-[11px]">Total: {ledgerData.length}</Badge>
              <Badge variant="destructive" className="text-[11px]">Errors: {errorCount}</Badge>
              <Badge variant="warning" className="text-[11px]">Warnings: {warningCount}</Badge>
              <Badge variant="accent" className="text-[11px]">Valid: {validPercent}%</Badge>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <Card className="bg-gradient-card border shadow-soft">
          <CardContent className="pt-6">
            <WorkflowProgress
              steps={[
                { id: "1", title: "Upload", description: "Files provided", status: "completed" },
                { id: "2", title: "Automatic Validation", description: `${errorCount} errors, ${warningCount} warnings`, status: "current" },
                { id: "3", title: "Review & Resubmit", description: "Fix and resubmit", status: "pending" },
                { id: "4", title: "Verification", description: "Team verification", status: "pending" },
              ]}
              orientation="horizontal"
            />
          </CardContent>
        </Card>

        {/* Removed summary cards to save vertical space; indicators moved into title */}

        {/* Dual Panel View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Ledger Data */}
          <Card className="bg-gradient-card border shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
              <CardTitle>Ledger Data</CardTitle>
              <CardDescription>
                    Click a row to filter; click again to show all
              </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={rowTab === "all" ? "default" : "outline"}
                    onClick={() => setRowTab("all")}
                  >
                    All rows
                  </Button>
                  <Button
                    size="sm"
                    variant={rowTab === "clean" ? "default" : "outline"}
                    onClick={() => setRowTab("clean")}
                  >
                    Clean rows
                  </Button>
                  <Button
                    size="sm"
                    variant={rowTab === "issues" ? "default" : "outline"}
                    onClick={() => setRowTab("issues")}
                  >
                    Rows with issues
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-80 overflow-auto border rounded-lg">
                <table className="w-full text-[12px]">
                  <thead className="sticky top-0 bg-background">
                    <tr className="border-b">
                      <th className="text-left px-3 py-2">Line</th>
                      <th className="text-left px-3 py-2">Date</th>
                      <th className="text-left px-3 py-2">Description</th>
                      <th className="text-right px-3 py-2">Amount</th>
                      <th className="text-right px-3 py-2">VAT</th>
                      <th className="text-left px-3 py-2">Country</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledgerData
                      .filter((row) => {
                        const hasErr = getErrorsForLine(row.line).length > 0;
                        if (rowTab === "clean") return !hasErr;
                        if (rowTab === "issues") return hasErr;
                        return true;
                      })
                      .map((row) => {
                  const hasErrors = getErrorsForLine(row.line).length > 0;
                  const isSelected = selectedLine === row.line;
                  const isEditing = editingCell?.line === row.line;
                  return (
                        <tr
                      key={row.id}
                          ref={(el) => {
                            if (el) rowRefs.current.set(row.line, el as unknown as HTMLDivElement);
                            else rowRefs.current.delete(row.line);
                          }}
                          onClick={() => {
                            if (isEditing) return; // Don't select when editing
                            if (selectedLine === row.line) {
                              setSelectedLine(null);
                            } else {
                              handleLineSelect(row.line);
                            }
                          }}
                          className={`group ${
                        isSelected 
                              ? "bg-primary/10 border-2 border-primary"
                              : "hover:bg-muted/30 border-b"
                          } cursor-pointer transition-colors`}
                        >
                          <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[10px] px-1 py-0">{row.line}</Badge>
                              {hasErrors && <AlertTriangle className="h-3 w-3 text-destructive" />}
                        </div>
                          </td>
                          <td
                            className={`px-3 py-2 whitespace-nowrap ${(() => {
                              const sev = getCellIssueSeverity(row.line, 'date');
                              if (!sev) return '';
                              return 'bg-destructive/15 border border-destructive';
                            })()}`}
                          >
                            {isEditing && editingCell?.field === 'date' ? (
                              <div className="flex items-center gap-1">
                                <Input 
                                  value={editValue} 
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="h-6 text-[12px] w-24"
                                  autoFocus
                                />
                                <Button size="sm" variant="ghost" onClick={saveEdit} className="h-4 w-4 p-0">
                                  ✓
                                </Button>
                                <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-4 w-4 p-0">
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <span>{row.date}</span>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEdit(row.line, 'date', row.date);
                                  }}
                                  className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </td>
                          <td
                            className={`px-3 py-2 ${(() => {
                              const sev = getCellIssueSeverity(row.line, 'description');
                              if (!sev) return '';
                              return 'bg-destructive/15 border border-destructive';
                            })()}`}
                          >
                            {isEditing && editingCell?.field === 'description' ? (
                              <div className="flex items-center gap-1">
                                <Input 
                                  value={editValue} 
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="h-6 text-[12px]"
                                  autoFocus
                                />
                                <Button size="sm" variant="ghost" onClick={saveEdit} className="h-4 w-4 p-0">
                                  ✓
                                </Button>
                                <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-4 w-4 p-0">
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <span>{row.description}</span>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEdit(row.line, 'description', row.description);
                                  }}
                                  className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </td>
                          <td
                            className={`px-3 py-2 text-right ${(() => {
                              const sev = getCellIssueSeverity(row.line, 'amount');
                              if (!sev) return '';
                              return 'bg-destructive/15 border border-destructive';
                            })()}`}
                          >
                            {isEditing && editingCell?.field === 'amount' ? (
                              <div className="flex items-center gap-1">
                                <Input 
                                  value={editValue} 
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="h-6 text-[12px] w-20"
                                  autoFocus
                                />
                                <Button size="sm" variant="ghost" onClick={saveEdit} className="h-4 w-4 p-0">
                                  ✓
                                </Button>
                                <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-4 w-4 p-0">
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 justify-end">
                                <span>{row.amount} €</span>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEdit(row.line, 'amount', row.amount);
                                  }}
                                  className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </td>
                          <td
                            className={`px-3 py-2 text-right ${(() => {
                              const sev = getCellIssueSeverity(row.line, 'vat');
                              if (!sev) return '';
                              return 'bg-destructive/15 border border-destructive';
                            })()}`}
                          >
                            {isEditing && editingCell?.field === 'vat' ? (
                              <div className="flex items-center gap-1">
                                <Input 
                                  value={editValue} 
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="h-6 text-[12px] w-16"
                                  autoFocus
                                />
                                <Button size="sm" variant="ghost" onClick={saveEdit} className="h-4 w-4 p-0">
                                  ✓
                                </Button>
                                <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-4 w-4 p-0">
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 justify-end">
                                <span>{row.vat}</span>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEdit(row.line, 'vat', row.vat);
                                  }}
                                  className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </td>
                          <td
                            className={`px-3 py-2 whitespace-nowrap ${(() => {
                              const sev = getCellIssueSeverity(row.line, 'country');
                              if (!sev) return '';
                              return 'bg-destructive/15 border border-destructive';
                            })()}`}
                          >
                            {isEditing && editingCell?.field === 'country' ? (
                              <div className="flex items-center gap-1">
                                <Input 
                                  value={editValue} 
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="h-6 text-[12px] w-12"
                                  autoFocus
                                />
                                <Button size="sm" variant="ghost" onClick={saveEdit} className="h-4 w-4 p-0">
                                  ✓
                                </Button>
                                <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-4 w-4 p-0">
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <span>{row.country}</span>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEdit(row.line, 'country', row.country);
                                  }}
                                  className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                  );
                })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Right Panel - Validation Errors */}
          <Card className="bg-gradient-card border shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
              <CardTitle>Validation Errors</CardTitle>
              <CardDescription>
                    {selectedLine ? `Showing errors for Line ${selectedLine}` : "All detected issues"}
              </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => setSeverityFilter("error")}
                  >
                    Errors
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-warning text-warning-foreground hover:bg-warning/90"
                    onClick={() => setSeverityFilter("warning")}
                  >
                    Warnings
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={() => setSeverityFilter("info")}
                  >
                    Info
                  </Button>
                  {(selectedLine !== null || severityFilter !== "all") && (
                    <Button
                      size="sm"
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => {
                        setSelectedLine(null);
                        setSeverityFilter("all");
                      }}
                    >
                      Show all
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-80 overflow-auto">
                {selectedLine ? (
                  getDisplayedErrors().length > 0 ? (
                    getDisplayedErrors().map((error, idx) => (
                      <div key={error.id} className={`p-2 rounded-md border ${idx % 2 === 0 ? 'bg-muted/10' : 'bg-muted/20'}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={getSeverityColor(error.severity) as any}>
                                {error.severity.toUpperCase()}
                              </Badge>
                              <span className="text-[13px] font-medium">{error.rule}</span>
                            </div>
                            <p className="text-[12px] text-muted-foreground mb-1">
                              Field: <span className="font-medium">{error.field}</span>
                            </p>
                            <p className="text-[13px]">{error.message}</p>
                            {error.suggestedFix && (
                              <div className="mt-1 p-2 bg-accent/10 rounded border-l-2 border-accent">
                                <p className="text-[11px] text-muted-foreground">Suggested fix:</p>
                                <p className="text-[13px]">{error.suggestedFix}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle2 className="h-6 w-6 mx-auto mb-1 text-accent" />
                      <p>No errors found for this line</p>
                    </div>
                  )
                ) : (
                  getDisplayedErrors().map((error, idx) => (
                    <div 
                      key={error.id} 
                      className={`p-2 rounded-md border cursor-pointer hover:bg-muted/40 ${idx % 2 === 0 ? 'bg-amber-50' : 'bg-amber-50/40'}`}
                      onClick={() => scrollToLine(error.line)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-[10px] px-1 py-0">
                              Line {error.line}
                            </Badge>
                            <Badge variant={getSeverityColor(error.severity) as any}>
                              {error.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-[13px]">{error.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Error Report
          </Button>
          
          <div className="flex items-center gap-3">
              <Button
                onClick={handleResubmit}
              disabled={isResubmitting || errorCount > 0}
                className="gap-2"
                variant="outline"
              >
                {isResubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                    Resubmitting...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Resubmit After Corrections
                  </>
                )}
              </Button>
            <Button
              onClick={handleContinue}
              className="gap-2 bg-gradient-primary"
            >
                <CheckCircle2 className="h-4 w-4" />
              Continue to Review
              </Button>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}