import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { UploadBox } from "@/components/UploadBox";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2, Download, ChevronDown, ChevronRight, FileText } from "lucide-react";

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

const mockTopics: Topic[] = [
  {
    id: "1",
    name: "Arrays and Linked Lists",
    isExpanded: true,
    questions: [
      { id: "1-1", text: "Explain the difference between arrays and linked lists with examples.", year: "2023", marks: 10 },
      { id: "1-2", text: "Write a program to reverse a linked list.", year: "2022", marks: 8 },
      { id: "1-3", text: "Compare time complexity of array vs linked list operations.", year: "2021", marks: 6 },
    ],
  },
  {
    id: "2",
    name: "Trees and Binary Search Trees",
    isExpanded: false,
    questions: [
      { id: "2-1", text: "Explain tree traversal methods with examples.", year: "2023", marks: 10 },
      { id: "2-2", text: "Write algorithm for inserting a node in BST.", year: "2022", marks: 8 },
      { id: "2-3", text: "Explain AVL tree rotations.", year: "2021", marks: 12 },
    ],
  },
  {
    id: "3",
    name: "Sorting Algorithms",
    isExpanded: false,
    questions: [
      { id: "3-1", text: "Compare quick sort and merge sort algorithms.", year: "2023", marks: 10 },
      { id: "3-2", text: "Write pseudocode for heap sort.", year: "2022", marks: 10 },
      { id: "3-3", text: "Analyze best, worst, and average case of bubble sort.", year: "2020", marks: 6 },
    ],
  },
  {
    id: "4",
    name: "Graph Algorithms",
    isExpanded: false,
    questions: [
      { id: "4-1", text: "Explain BFS and DFS with examples.", year: "2023", marks: 12 },
      { id: "4-2", text: "Write Dijkstra's algorithm for shortest path.", year: "2022", marks: 15 },
    ],
  },
];

export default function PYQ() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleOrganize = () => {
    if (!file) return;
    setIsProcessing(true);
    setTimeout(() => {
      setTopics(mockTopics);
      setIsProcessing(false);
      setShowResults(true);
    }, 2000);
  };

  const toggleTopic = (topicId: string) => {
    setTopics(topics.map(topic => 
      topic.id === topicId ? { ...topic, isExpanded: !topic.isExpanded } : topic
    ));
  };

  const totalQuestions = topics.reduce((sum, topic) => sum + topic.questions.length, 0);

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
                  onFileSelect={setFile} 
                  acceptedFormats={["PDF"]}
                />
              </div>

              {/* Action Button */}
              <div className="text-center">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleOrganize}
                  disabled={!file || isProcessing}
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
          )}
        </div>
      </div>
    </Layout>
  );
}
