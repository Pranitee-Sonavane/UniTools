import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { UploadBox } from "@/components/UploadBox";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

interface CheckItem {
  id: string;
  label: string;
  status: "pass" | "fail" | "warning" | null;
  message?: string;
}

const initialChecks: CheckItem[] = [
  { id: "naming", label: "File Naming Convention", status: null },
  { id: "format", label: "File Format Valid", status: null },
  { id: "coverpage", label: "Cover Page Present", status: null },
  { id: "sections", label: "Required Sections", status: null },
  { id: "pageorder", label: "Page Order Correct", status: null },
  { id: "margins", label: "Margin Guidelines", status: null },
  { id: "fonts", label: "Font Consistency", status: null },
  { id: "plagiarism", label: "Basic Plagiarism Scan", status: null },
];

export default function SubmitSafe() {
  const [file, setFile] = useState<File | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [checks, setChecks] = useState<CheckItem[]>(initialChecks);
  const [isComplete, setIsComplete] = useState(false);

  const runChecks = () => {
    if (!file) return;
    setIsChecking(true);

    // Simulate checking process
    const simulatedResults: CheckItem[] = [
      { id: "naming", label: "File Naming Convention", status: "pass", message: "Follows standard naming pattern" },
      { id: "format", label: "File Format Valid", status: "pass", message: "PDF format accepted" },
      { id: "coverpage", label: "Cover Page Present", status: "pass", message: "Cover page detected" },
      { id: "sections", label: "Required Sections", status: "warning", message: "References section may be incomplete" },
      { id: "pageorder", label: "Page Order Correct", status: "pass", message: "Pages in correct sequence" },
      { id: "margins", label: "Margin Guidelines", status: "pass", message: "1-inch margins detected" },
      { id: "fonts", label: "Font Consistency", status: "pass", message: "Consistent font usage" },
      { id: "plagiarism", label: "Basic Plagiarism Scan", status: "pass", message: "No obvious duplications found" },
    ];

    setTimeout(() => {
      setChecks(simulatedResults);
      setIsChecking(false);
      setIsComplete(true);
    }, 2500);
  };

  const getStatusIcon = (status: CheckItem["status"]) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "fail":
        return <XCircle className="w-5 h-5 text-destructive" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      default:
        return <div className="w-5 h-5 rounded-full bg-muted" />;
    }
  };

  const passCount = checks.filter((c) => c.status === "pass").length;
  const warningCount = checks.filter((c) => c.status === "warning").length;
  const failCount = checks.filter((c) => c.status === "fail").length;

  const overallStatus = isComplete
    ? failCount > 0
      ? "fail"
      : warningCount > 0
      ? "warning"
      : "pass"
    : null;

  return (
    <Layout>
      <div className="py-12">
        <div className="container max-w-3xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 text-secondary">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-3">SubmitSafe</h1>
            <p className="text-muted-foreground">
              Check assignments for naming, structure, and submission mistakes before you submit.
            </p>
          </div>

          {/* Upload Section */}
          <div className="mb-8">
            <UploadBox onFileSelect={setFile} />
          </div>

          {/* Action Button */}
          {!isComplete && (
            <div className="text-center mb-8">
              <Button
                variant="hero"
                size="lg"
                onClick={runChecks}
                disabled={!file || isChecking}
                className="min-w-[200px]"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Run Safety Check"
                )}
              </Button>
            </div>
          )}

          {/* Checklist */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30">
              <h2 className="font-semibold text-primary">Submission Checklist</h2>
            </div>
            <div className="divide-y divide-border">
              {checks.map((check) => (
                <div key={check.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(check.status)}
                    <span className="font-medium text-foreground">{check.label}</span>
                  </div>
                  {check.message && (
                    <span className="text-sm text-muted-foreground">{check.message}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Result Panel */}
          {isComplete && (
            <div className={`mt-6 p-6 rounded-xl border ${
              overallStatus === "pass" 
                ? "bg-success/10 border-success/30" 
                : overallStatus === "warning"
                ? "bg-amber-50 border-amber-200"
                : "bg-destructive/10 border-destructive/30"
            }`}>
              <div className="flex items-center gap-3 mb-2">
                {overallStatus === "pass" && <CheckCircle className="w-6 h-6 text-success" />}
                {overallStatus === "warning" && <AlertCircle className="w-6 h-6 text-amber-500" />}
                {overallStatus === "fail" && <XCircle className="w-6 h-6 text-destructive" />}
                <h3 className="font-semibold text-lg">
                  {overallStatus === "pass" && "Safe to Submit!"}
                  {overallStatus === "warning" && "Review Recommended"}
                  {overallStatus === "fail" && "Fix Issues Before Submitting"}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {passCount} passed • {warningCount} warnings • {failCount} failed
              </p>
              
              <div className="mt-4">
                <Button variant="outline" size="sm" onClick={handleDownloadReport}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Report & Clear
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
