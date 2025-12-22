import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { UploadBox } from "@/components/UploadBox";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ClipboardList, Loader2, Download, ChevronDown, ChevronRight, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Topic {
  id: string;
  name: string;
  completed: boolean;
}

interface Unit {
  id: string;
  name: string;
  topics: Topic[];
  isExpanded: boolean;
}

export default function Syllabus() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [showChecklist, setShowChecklist] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { toast } = useToast();

  const handleExtract = () => {
    if (!file) return;

    if (validationError) {
      toast({
        title: "Invalid File",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate processing - ready for backend integration
    setTimeout(() => {
      setIsProcessing(false);
      setShowChecklist(true);
      toast({
        title: "Ready for Processing",
        description: "Connect a backend to extract syllabus topics.",
      });
    }, 1500);
  };

  const toggleUnit = (unitId: string) => {
    setUnits(units.map(unit => 
      unit.id === unitId ? { ...unit, isExpanded: !unit.isExpanded } : unit
    ));
  };

  const toggleTopic = (unitId: string, topicId: string) => {
    setUnits(units.map(unit => 
      unit.id === unitId 
        ? {
            ...unit,
            topics: unit.topics.map(topic =>
              topic.id === topicId ? { ...topic, completed: !topic.completed } : topic
            ),
          }
        : unit
    ));
  };

  const totalTopics = units.reduce((sum, unit) => sum + unit.topics.length, 0);
  const completedTopics = units.reduce(
    (sum, unit) => sum + unit.topics.filter((t) => t.completed).length,
    0
  );
  const progressPercent = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  const isSubmitDisabled = !file || isProcessing || !!validationError;

  const resetForm = () => {
    setFile(null);
    setShowChecklist(false);
    setUnits([]);
    setValidationError(null);
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="container max-w-3xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 text-secondary">
              <ClipboardList className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-3">Syllabus Checklist</h1>
            <p className="text-muted-foreground">
              Convert long syllabus PDFs into trackable checklists for smart study planning.
            </p>
          </div>

          {!showChecklist ? (
            <>
              {/* Upload Section */}
              <div className="mb-8">
                <UploadBox 
                  validationType="syllabus"
                  onFileSelect={setFile}
                  onValidationError={setValidationError}
                />
              </div>

              {/* Action Button */}
              <div className="text-center">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleExtract}
                  disabled={isSubmitDisabled}
                  className="min-w-[200px]"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    "Extract Syllabus"
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              {units.length > 0 ? (
                <>
                  {/* Progress Section */}
                  <div className="mb-8 p-6 bg-card rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-primary">Overall Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {completedTopics} / {totalTopics} topics
                      </span>
                    </div>
                    <Progress value={progressPercent} className="h-3" />
                    <p className="text-sm text-muted-foreground mt-2">
                      {progressPercent.toFixed(0)}% complete
                    </p>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-4 mb-8">
                    {units.map((unit) => (
                      <div key={unit.id} className="bg-card rounded-xl border border-border overflow-hidden">
                        <button
                          className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                          onClick={() => toggleUnit(unit.id)}
                        >
                          <span className="font-medium text-primary">{unit.name}</span>
                          {unit.isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          )}
                        </button>
                        {unit.isExpanded && (
                          <div className="border-t border-border">
                            {unit.topics.map((topic) => (
                              <label
                                key={topic.id}
                                className="flex items-center gap-3 p-4 hover:bg-muted/30 cursor-pointer transition-colors"
                              >
                                <Checkbox
                                  checked={topic.completed}
                                  onCheckedChange={() => toggleTopic(unit.id, topic.id)}
                                />
                                <span className={topic.completed ? "line-through text-muted-foreground" : "text-foreground"}>
                                  {topic.name}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Export Button */}
                  <div className="text-center">
                    <Button variant="outline" size="lg">
                      <Download className="w-4 h-4" />
                      Export Checklist
                    </Button>
                  </div>
                </>
              ) : (
                /* Empty State - Ready for backend connection */
                <div className="text-center p-8 bg-card rounded-xl border border-border">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">File Selected</h3>
                  <p className="text-muted-foreground mb-6">
                    Your syllabus file is ready. Connect a backend service to extract and display topics from the PDF.
                  </p>
                  <Button variant="outline" onClick={resetForm}>
                    Select Another File
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
