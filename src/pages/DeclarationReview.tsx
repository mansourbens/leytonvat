import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkflowProgress } from "@/components/ui/workflow-progress";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function DeclarationReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openSubmit, setOpenSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const assignTaxCode = (line: number, amount: string): string => {
    const net = parseFloat(amount || "0");
    // deterministic assignment by line number
    const codes = ["A5", "B", "C1", "C2", "STD"] as const;
    const base = codes[(line - 1) % codes.length];
    // purchases negative default to C1/C2
    if (net < 0) return line % 2 === 0 ? "C1" : "C2";
    return base;
  };

  type TaxAggregate = { taxCode: string; transactions: number; totalNet: number; totalVAT: number; totalGross: number };
  const byTaxCode = useMemo<TaxAggregate[]>(() => {
    const map = new Map<string, TaxAggregate>();
    for (const row of mockLedgerData) {
      const net = parseFloat(row.amount || "0");
      const vat = parseFloat(row.vat || "0");
      const gross = net + vat;
      const code = assignTaxCode(row.line, row.amount);
      const current = map.get(code) || { taxCode: code, transactions: 0, totalNet: 0, totalVAT: 0, totalGross: 0 };
      current.transactions += 1;
      current.totalNet += net;
      current.totalVAT += vat;
      current.totalGross += gross;
      map.set(code, current);
    }
    return Array.from(map.values()).sort((a, b) => a.taxCode.localeCompare(b.taxCode));
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/declarations/${id}/validation`)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Validation
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">Review & Submit</h1>
              <p className="text-muted-foreground">Recap of your uploaded data and validation results</p>
            </div>
          </div>

          <Card className="bg-gradient-card border shadow-soft">
            <CardContent className="pt-6">
              <WorkflowProgress
                steps={[
                  { id: "1", title: "Upload", description: "Files provided", status: "completed" },
                  { id: "2", title: "Automatic Validation", description: "Checks done", status: "completed" },
                  { id: "3", title: "Review & Resubmit", description: "Final recap", status: "current" },
                  { id: "4", title: "Verification", description: "Team verification", status: "pending" },
                ]}
                orientation="horizontal"
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-card border shadow-soft">
              <CardHeader>
                <CardTitle>Submission Recap</CardTitle>
                <CardDescription>Aggregated by tax code</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-background sticky top-0">
                      <tr className="border-b">
                        <th className="text-left px-3 py-2">Tax Code</th>
                        <th className="text-right px-3 py-2">Transactions</th>
                        <th className="text-right px-3 py-2">Total Net</th>
                        <th className="text-right px-3 py-2">Total VAT</th>
                        <th className="text-right px-3 py-2">Total Gross</th>
                      </tr>
                    </thead>
                    <tbody>
                      {byTaxCode.map((g, idx) => (
                        <tr key={g.taxCode} className={idx % 2 === 0 ? "bg-muted/10" : "bg-muted/20"}>
                          <td className="px-3 py-2 font-medium">{g.taxCode}</td>
                          <td className="px-3 py-2 text-right">{g.transactions}</td>
                          <td className="px-3 py-2 text-right">{g.totalNet.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right">{g.totalVAT.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right">{g.totalGross.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border shadow-soft">
              <CardHeader>
                <CardTitle>Detailed Recap</CardTitle>
                <CardDescription>All declaration lines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto border rounded-lg max-h-[520px]">
                  <table className="w-full text-sm">
                    <thead className="bg-background sticky top-0">
                      <tr className="border-b">
                        <th className="text-left px-3 py-2">Line</th>
                        <th className="text-left px-3 py-2">Date</th>
                        <th className="text-left px-3 py-2">Description</th>
                        <th className="text-right px-3 py-2">Amount</th>
                        <th className="text-right px-3 py-2">VAT</th>
                        <th className="text-left px-3 py-2">Country</th>
                        <th className="text-left px-3 py-2">Tax Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockLedgerData.map((row, idx) => {
                        const code = assignTaxCode(row.line, row.amount);
                        return (
                          <tr key={row.id} className={idx % 2 === 0 ? "bg-muted/10" : "bg-muted/20"}>
                            <td className="px-3 py-2">{row.line}</td>
                            <td className="px-3 py-2">{row.date}</td>
                            <td className="px-3 py-2">{row.description}</td>
                            <td className="px-3 py-2 text-right">{row.amount}</td>
                            <td className="px-3 py-2 text-right">{row.vat || "0.00"}</td>
                            <td className="px-3 py-2">{row.country}</td>
                            <td className="px-3 py-2 font-medium">{code}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-card border shadow-soft">
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>Send to verification</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="gap-2 bg-gradient-primary"
                onClick={() => {
                  setOpenSubmit(true);
                  setIsSubmitting(true);
                  setSubmitSuccess(false);
                  setTimeout(() => {
                    try {
                      if (id) localStorage.setItem(`declaration:${id}:status`, 'review');
                    } catch (_) {}
                    setIsSubmitting(false);
                    setSubmitSuccess(true);
                  }, 2000);
                }}
              >
                <CheckCircle2 className="h-4 w-4" />
                Submit to Verification
              </Button>
            </CardContent>
          </Card>

          <Dialog open={openSubmit} onOpenChange={setOpenSubmit}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isSubmitting ? 'Submitting Declaration…' : 'Declaration Submitted'}</DialogTitle>
                <DialogDescription>
                  {isSubmitting
                    ? 'We are sending your data for verification. This may take a moment.'
                    : 'Your data has been sent successfully and is awaiting team verification.'}
                </DialogDescription>
              </DialogHeader>
              <div className="py-2">
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-b-transparent" />
                    <span className="text-sm text-muted-foreground">Uploading and validating…</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                    <span className="text-sm">Data sent successfully.</span>
                  </div>
                )}
              </div>
              {!isSubmitting && submitSuccess && (
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setOpenSubmit(false)}>Close</Button>
                  <Button className="bg-gradient-primary" onClick={() => { setOpenSubmit(false); navigate('/declarations'); }}>Go to Declarations</Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}


