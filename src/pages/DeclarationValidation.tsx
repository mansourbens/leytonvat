import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { ArrowLeft, RefreshCw, CheckCircle2, AlertTriangle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  { id: "3", line: 3, date: "2025-08-03", description: "Service Revenue", amount: "750.00", vat: "157.50", country: "ES" },
  { id: "4", line: 4, date: "2025-08-04", description: "Equipment Purchase", amount: "-1200.00", vat: "-252.00", country: "FR" },
  { id: "5", line: 5, date: "2025-08-05", description: "Consulting Service", amount: "2000.00", vat: "420.00", country: "ES" },
];

const mockErrors: ValidationError[] = [
  {
    id: "1",
    line: 2,
    field: "vat",
    rule: "VAT_MISSING",
    severity: "error",
    message: "VAT amount is required for cross-border transactions",
    suggestedFix: "Add VAT amount or mark as exempt"
  },
  {
    id: "2", 
    line: 4,
    field: "country",
    rule: "VIES_VALIDATION",
    severity: "warning",
    message: "VAT number could not be validated via VIES",
    suggestedFix: "Verify VAT number format for France"
  },
  {
    id: "3",
    line: 5,
    field: "amount",
    rule: "AMOUNT_THRESHOLD",
    severity: "info", 
    message: "High value transaction detected",
    suggestedFix: "Consider additional documentation"
  }
];

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

  const handleLineSelect = (line: number) => {
    setSelectedLine(line);
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
    toast({
      title: "Declaration Approved",
      description: "Moving to verification phase",
    });
    navigate(`/declarations`);
  };

  const getErrorsForLine = (line: number) => {
    return mockErrors.filter(error => error.line === line);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error": return "destructive";
      case "warning": return "default";  
      case "info": return "secondary";
      default: return "outline";
    }
  };

  const errorCount = mockErrors.filter(e => e.severity === "error").length;
  const warningCount = mockErrors.filter(e => e.severity === "warning").length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
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
            <p className="text-muted-foreground">
              ECL-SPAIN-M8-2025 • Review validation results and fix errors
            </p>
          </div>
        </div>

        {/* Validation Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-card border shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-2xl font-bold">{mockLedgerData.length}</p>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-2xl font-bold text-destructive">{errorCount}</p>
                  <p className="text-sm text-muted-foreground">Errors</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-2xl font-bold text-warning">{warningCount}</p>
                  <p className="text-sm text-muted-foreground">Warnings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-2xl font-bold text-accent">
                    {Math.round(((mockLedgerData.length - errorCount) / mockLedgerData.length) * 100)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Valid Records</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dual Panel View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Ledger Data */}
          <Card className="bg-gradient-card border shadow-soft">
            <CardHeader>
              <CardTitle>Ledger Data</CardTitle>
              <CardDescription>
                Click on any row to see related validation errors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-auto">
                {mockLedgerData.map((row) => {
                  const hasErrors = getErrorsForLine(row.line).length > 0;
                  const isSelected = selectedLine === row.line;
                  
                  return (
                    <div
                      key={row.id}
                      onClick={() => handleLineSelect(row.line)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        isSelected 
                          ? "border-primary bg-primary/10"
                          : hasErrors 
                          ? "border-destructive/50 bg-destructive/5 hover:bg-destructive/10"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Line {row.line}
                          </Badge>
                          {hasErrors && (
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{row.country}</span>
                      </div>
                      <p className="text-sm font-medium mt-1">{row.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                        <span>{row.date}</span>
                        <span>{row.amount} €</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Right Panel - Validation Errors */}
          <Card className="bg-gradient-card border shadow-soft">
            <CardHeader>
              <CardTitle>Validation Errors</CardTitle>
              <CardDescription>
                {selectedLine ? `Showing errors for Line ${selectedLine}` : "Select a line to view errors"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-auto">
                {selectedLine ? (
                  getErrorsForLine(selectedLine).length > 0 ? (
                    getErrorsForLine(selectedLine).map((error) => (
                      <div key={error.id} className="p-3 rounded-lg border bg-muted/20">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={getSeverityColor(error.severity) as any}>
                                {error.severity.toUpperCase()}
                              </Badge>
                              <span className="text-sm font-medium">{error.rule}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Field: <span className="font-medium">{error.field}</span>
                            </p>
                            <p className="text-sm">{error.message}</p>
                            {error.suggestedFix && (
                              <div className="mt-2 p-2 bg-accent/10 rounded border-l-2 border-accent">
                                <p className="text-xs text-muted-foreground">Suggested fix:</p>
                                <p className="text-sm">{error.suggestedFix}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-accent" />
                      <p>No errors found for this line</p>
                    </div>
                  )
                ) : (
                  mockErrors.map((error) => (
                    <div 
                      key={error.id} 
                      className="p-3 rounded-lg border bg-muted/20 cursor-pointer hover:bg-muted/30"
                      onClick={() => handleLineSelect(error.line)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              Line {error.line}
                            </Badge>
                            <Badge variant={getSeverityColor(error.severity) as any}>
                              {error.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm">{error.message}</p>
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
            {errorCount > 0 ? (
              <Button
                onClick={handleResubmit}
                disabled={isResubmitting}
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
            ) : (
              <Button
                onClick={handleContinue}
                className="gap-2 bg-gradient-primary"
              >
                <CheckCircle2 className="h-4 w-4" />
                Continue to Review
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}