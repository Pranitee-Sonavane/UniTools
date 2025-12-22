import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { UploadBox } from "@/components/UploadBox";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ClipboardList, Loader2, Download, ChevronDown, ChevronRight } from "lucide-react";

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

const mockUnits: Unit[] = [
  {
    id: "1",
    name: "Unit 1: Introduction to Data Structures",
    isExpanded: true,
    topics: [
      { id: "1-1", name: "Arrays and their operations", completed: false },
      { id: "1-2", name: "Linked Lists (Singly, Doubly)", completed: false },
      { id: "1-3", name: "Stacks and Queues", completed: false },
      { id: "1-4", name: "Time and Space Complexity", completed: false },
    ],
  },
  {
    id: "2",
    name: "Unit 2: Trees and Graphs",
    isExpanded: false,
    topics: [
      { id: "2-1", name: "Binary Trees", completed: false },
      { id: "2-2", name: "Binary Search Trees", completed: false },
      { id: "2-3", name: "AVL Trees", completed: false },
      { id: "2-4", name: "Graph representation", completed: false },
      { id: "2-5", name: "BFS and DFS", completed: false },
    ],
  },
  {
    id: "3",
    name: "Unit 3: Sorting and Searching",
    isExpanded: false,
    topics: [
      { id: "3-1", name: "Bubble, Selection, Insertion Sort", completed: false },
      { id: "3-2", name: "Merge Sort", completed: false },
      { id: "3-3", name: "Quick Sort", completed: false },
      { id: "3-4", name: "Linear and Binary Search", completed: false },
    ],
  },
  {
    id: "4",
    name: "Unit 4: Advanced Topics",
    isExpanded: false,
    topics: [
      { id: "4-1", name: "Hashing techniques", completed: false },
      { id: "4-2", name: "Heaps and Priority Queues", completed: false },
      { id: "4-3", name: "Dynamic Programming basics", completed: false },
    ],
  },
];

export default function Syllabus() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [showChecklist, setShowChecklist] = useState(false);

  const handleExtract = () => {
    if (!file) return;
    setIsProcessing(true);
    setTimeout(() => {
      setUnits(mockUnits);
      setIsProcessing(false);
      setShowChecklist(true);
    }, 2000);
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
                  onFileSelect={setFile} 
                  acceptedFormats={["PDF"]}
                />
              </div>

              {/* Action Button */}
              <div className="text-center">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleExtract}
                  disabled={!file || isProcessing}
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
          )}
        </div>
      </div>
    </Layout>
  );
}
