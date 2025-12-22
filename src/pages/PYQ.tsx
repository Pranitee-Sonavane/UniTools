import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { UploadBox } from "@/components/UploadBox";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2, Download, ChevronDown, ChevronRight, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  text: string;
  year: string;
  marks: number;
}

interface Topic {
  id: string;
  name: string;
  questions: Question[];
  isExpanded: boolean;
}

export default function PYQ() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { toast } = useToast();

  const handleOrganize = () => {
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
      setShowResults(true);
      toast({
        title: "Ready for Processing",
        description: "Connect a backend to organize PYQ questions.",
      });
    }, 1500);
  };

  const toggleTopic = (topicId: string) => {
    setTopics(topics.map(topic => 
      topic.id === topicId ? { ...topic, isExpanded: !topic.isExpanded } : topic
    ));
  };

  const totalQuestions = topics.reduce((sum, topic) => sum + topic.questions.length, 0);

  const isSubmitDisabled = !file || isProcessing || !!validationError;

  const resetForm = () => {
    setFile(null);
    setShowResults(false);
    setTopics([]);
    setValidationError(null);
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="container max-w-3xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 text-secondary">
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-3">PYQ Organizer</h1>
            <p className="text-muted-foreground">
              Group previous year questions topic-wise for smart and focused revision.
            </p>
          </div>

          {!showResults ? (
            <>
              {/* Upload Section */}
              <div className="mb-8">
                <UploadBox 
                  validationType="pyq"
                  onFileSelect={setFile}
                  onValidationError={setValidationError}
                />
              </div>

              {/* Action Button */}
              <div className="text-center">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleOrganize}
                  disabled={isSubmitDisabled}
                  className="min-w-[200px]"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Organizing...
                    </>
                  ) : (
                    "Organize PYQs"
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              {topics.length > 0 ? (
                <>
                  {/* Summary */}
                  <div className="mb-8 p-6 bg-card rounded-xl border border-border flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-primary">Questions Organized</h3>
                      <p className="text-sm text-muted-foreground">
                        {totalQuestions} questions across {topics.length} topics
                      </p>
                    </div>
                    <Button variant="outline">
                      <Download className="w-4 h-4" />
                      Download All
                    </Button>
                  </div>

                  {/* Topics List */}
                  <div className="space-y-4">
                    {topics.map((topic) => (
                      <div key={topic.id} className="bg-card rounded-xl border border-border overflow-hidden">
                        <button
                          className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                          onClick={() => toggleTopic(topic.id)}
                        >
                          <div className="flex items-center gap-3">
                            {topic.isExpanded ? (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            )}
                            <span className="font-medium text-primary">{topic.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                            {topic.questions.length} questions
                          </span>
                        </button>
                        {topic.isExpanded && (
                          <div className="border-t border-border divide-y divide-border">
                            {topic.questions.map((question) => (
                              <div key={question.id} className="p-4">
                                <div className="flex items-start gap-3">
                                  <FileText className="w-4 h-4 mt-1 text-secondary shrink-0" />
                                  <div className="flex-1">
                                    <p className="text-foreground mb-2">{question.text}</p>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                      <span className="bg-muted px-2 py-0.5 rounded">{question.year}</span>
                                      <span>{question.marks} marks</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Download Topic-wise */}
                  <div className="mt-8 text-center">
                    <Button variant="hero" size="lg">
                      <Download className="w-4 h-4" />
                      Download Topic-wise PDFs
                    </Button>
                  </div>
                </>
              ) : (
                /* Empty State - Ready for backend connection */
                <div className="text-center p-8 bg-card rounded-xl border border-border">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">File Selected</h3>
                  <p className="text-muted-foreground mb-6">
                    Your PYQ file is ready. Connect a backend service to organize and display questions by topic.
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
