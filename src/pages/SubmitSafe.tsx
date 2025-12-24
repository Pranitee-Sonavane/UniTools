import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { UploadBox } from "@/components/UploadBox";
import { Button } from "@/components/ui/button";
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface CheckItem {
  id: string;
  label: string;
  status: "pass" | "fail" | "warning" | null;
}

const INITIAL_CHECKS: CheckItem[] = [
  { id: "font", label: "Font: Times New Roman", status: null },
  { id: "size", label: "Font Size 11-16pt", status: null },
  { id: "spacing", label: "Line Spacing 1.5", status: null },
  { id: "keywords", label: "Intro & Conclusion", status: null },
  { id: "margins", label: "Margins ~1 inch", status: null },
];

export default function SubmitSafe() {
  const [file, setFile] = useState<File | null>(null);
  const [checks, setChecks] = useState<CheckItem[]>(INITIAL_CHECKS);
  const [isChecking, setIsChecking] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  /* ================= RUN CHECK ================= */
  const runChecks = async () => {
    if (!file) return;

    setIsChecking(true);
    setIsComplete(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/check", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      // Maps backend IDs to your local checklist IDs
      setChecks(
        INITIAL_CHECKS.map((check) => {
          const match = data.results.find(
            (r: CheckItem) => r.id === check.id
          );
          return match ? match : check;
        })
      );

      setIsComplete(true);
    } catch (err) {
      console.error(err);
      alert("Failed to connect to backend server.");
    } finally {
      setIsChecking(false);
    }
  };

  /* ================= HELPERS ================= */
  const getIcon = (status: CheckItem["status"]) => {
    if (status === "pass")
      return <CheckCircle className="w-5 h-5 text-success" />;
    if (status === "fail")
      return <XCircle className="w-5 h-5 text-destructive" />;
    if (status === "warning")
      return <AlertCircle className="w-5 h-5 text-amber-500" />;

    return <div className="w-5 h-5 rounded-full bg-muted" />;
  };

  const passCount = checks.filter((c) => c.status === "pass").length;
  const warningCount = checks.filter((c) => c.status === "warning").length;
  const failCount = checks.filter((c) => c.status === "fail").length;

  const overallStatus =
    isComplete && failCount === 0
      ? warningCount > 0
        ? "warning"
        : "pass"
      : isComplete
      ? "fail"
      : null;

  /* ================= UI ================= */
  return (
    <Layout>
      <div className="py-12">
        <div className="container max-w-3xl">

          {/* HEADER */}
          <div className="text-center mb-10">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 text-secondary">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-3">
              SubmitSafe
            </h1>
            <p className="text-muted-foreground">
              Check assignments before you submit — no surprises.
            </p>
          </div>

          {/* UPLOAD */}
          <div className="mb-8">
            <UploadBox
              onFileSelect={(f) => {
                setFile(f);
                setChecks(INITIAL_CHECKS);
                setIsComplete(false);
              }}
            />
          </div>

          {/* BUTTON */}
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
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                "Run Safety Check"
              )}
            </Button>
          </div>

          {/* CHECKLIST */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30">
              <h2 className="font-semibold text-primary">
                Submission Checklist
              </h2>
            </div>

            <div className="divide-y divide-border">
              {checks.map((check) => (
                <div
                  key={check.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {getIcon(check.status)}
                    <span className="font-medium">
                      {check.label}
                    </span>
                  </div>

                  {check.status && (
                    <span className="text-sm capitalize text-muted-foreground">
                      {check.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SUMMARY */}
          {isComplete && (
            <div
              className={`mt-6 p-6 rounded-xl border ${
                overallStatus === "pass"
                  ? "bg-success/10 border-success/30"
                  : overallStatus === "warning"
                  ? "bg-amber-50 border-amber-200"
                  : "bg-destructive/10 border-destructive/30"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {overallStatus === "pass" && (
                  <CheckCircle className="w-6 h-6 text-success" />
                )}
                {overallStatus === "warning" && (
                  <AlertCircle className="w-6 h-6 text-amber-500" />
                )}
                {overallStatus === "fail" && (
                  <XCircle className="w-6 h-6 text-destructive" />
                )}

                <h3 className="font-semibold text-lg">
                  {overallStatus === "pass" && "Safe to Submit!"}
                  {overallStatus === "warning" && "Review Recommended"}
                  {overallStatus === "fail" && "Fix Issues Before Submitting"}
                </h3>
              </div>

              <p className="text-sm text-muted-foreground">
                {passCount} passed • {warningCount} warnings • {failCount} failed
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}