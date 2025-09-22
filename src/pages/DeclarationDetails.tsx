import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { FileUpload } from "@/components/ui/file-upload";
import { ArrowLeft, FileSpreadsheet, FileText, Send, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadedFileInfo {
  type: "ledger" | "invoice";
  files: File[];
}

export default function DeclarationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileInfo[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock declaration data - in real app, fetch based on ID
  const declaration = {
    id: id,
    name: `ECL-SPAIN-M8-2025`,
    country: "Spain",
    period: "August 2025", 
    type: "monthly",
    declarationType: "ECL",
    deadline: "2025-09-20",
    status: "progress",
  };

  const handleLedgerUpload = (files: File[]) => {
    setUploadedFiles(prev => {
      const filtered = prev.filter(item => item.type !== "ledger");
      return [...filtered, { type: "ledger", files }];
    });
    
    toast({
      title: "Ledger Files Uploaded",
      description: `${files.length} file(s) uploaded successfully`,
    });
  };

  const handleInvoiceUpload = (files: File[]) => {
    setUploadedFiles(prev => {
      const filtered = prev.filter(item => item.type !== "invoice");  
      return [...filtered, { type: "invoice", files }];
    });
    
    toast({
      title: "Invoice Files Uploaded", 
      description: `${files.length} file(s) uploaded successfully`,
    });
  };

  const handleSubmit = () => {
    const hasLedgers = uploadedFiles.some(item => item.type === "ledger" && item.files.length > 0);
    
    if (!hasLedgers) {
      toast({
        title: "Missing Files",
        description: "Please upload at least one ledger file before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Declaration Submitted",
        description: "Your declaration has been submitted for validation",
      });
      
      // Navigate to validation view
      navigate(`/declarations/${id}/validation`);
    }, 2000);
  };

  const ledgerFiles = uploadedFiles.find(item => item.type === "ledger")?.files || [];
  const invoiceFiles = uploadedFiles.find(item => item.type === "invoice")?.files || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/declarations")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Declarations
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{declaration.name}</h1>
            <p className="text-muted-foreground">
              {declaration.country} • {declaration.period} • {declaration.declarationType}
            </p>
          </div>
          <StatusBadge variant={declaration.status as any}>
            In Progress
          </StatusBadge>
        </div>

        {/* Declaration Info */}
        <Card className="bg-gradient-card border shadow-soft">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Country</p>
                <p className="font-medium">{declaration.country}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Period</p>
                <p className="font-medium">{declaration.period}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <Badge variant="default">{declaration.type}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Deadline</p>
                <p className="font-medium">{new Date(declaration.deadline).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ledgers Folder */}
          <Card className="bg-gradient-card border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-accent" />
                Ledgers
                {ledgerFiles.length > 0 && (
                  <Badge variant="default" className="ml-2">
                    {ledgerFiles.length} file(s)
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Upload Excel or CSV files containing your accounting ledger data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                acceptedTypes={[".xlsx", ".xls", ".csv"]}
                maxSize={10 * 1024 * 1024}
                multiple={true}
                onFilesUpload={handleLedgerUpload}
              />
            </CardContent>
          </Card>

          {/* Invoices Folder */}
          <Card className="bg-gradient-card border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Invoices
                {invoiceFiles.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {invoiceFiles.length} file(s)
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Upload PDF files or ZIP archives containing supporting invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                acceptedTypes={[".pdf", ".zip"]}
                maxSize={20 * 1024 * 1024}
                multiple={true}
                onFilesUpload={handleInvoiceUpload}
              />
            </CardContent>
          </Card>
        </div>

        {/* Submission Requirements */}
        <Card className="border-l-4 border-l-warning bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <h3 className="font-medium">Submission Requirements</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  At least one ledger file is required to proceed with submission. 
                  Invoice files are optional but recommended for comprehensive validation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || ledgerFiles.length === 0}
            className="gap-2 bg-gradient-primary min-w-[140px]"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit for Review
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}