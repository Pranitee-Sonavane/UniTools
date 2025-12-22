import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/ToolCard";
import { 
  FileText, 
  Shield, 
  ClipboardList, 
  BookOpen, 
  Upload, 
  Sparkles, 
  Download,
  CheckCircle,
  AlertTriangle,
  Target,
  Lightbulb
} from "lucide-react";

const tools = [
  {
    icon: FileText,
    title: "UniFormat",
    description: "Automatically format assignments using university presets or custom rules.",
    href: "/uniformat",
  },
  {
    icon: Shield,
    title: "SubmitSafe",
    description: "Check assignments for naming, structure, and submission mistakes.",
    href: "/submitsafe",
  },
  {
    icon: ClipboardList,
    title: "Syllabus Checklist",
    description: "Convert long syllabus PDFs into trackable checklists.",
    href: "/syllabus",
  },
  {
    icon: BookOpen,
    title: "PYQ Organizer",
    description: "Group previous year questions topic-wise for smart revision.",
    href: "/pyq",
  },
];

const steps = [
  {
    icon: Upload,
    title: "Upload Document",
    description: "Drag and drop your file or browse to select",
  },
  {
    icon: Sparkles,
    title: "UniTools Processes",
    description: "Our tools analyze and transform your document",
  },
  {
    icon: CheckCircle,
    title: "Review Output",
    description: "Check the results and make any adjustments",
  },
  {
    icon: Download,
    title: "Download Ready",
    description: "Get your submission-ready file instantly",
  },
];

const tips = [
  {
    icon: AlertTriangle,
    title: "Avoid Assignment Rejection",
    description: "Always check file naming conventions, page margins, and required sections before submission.",
  },
  {
    icon: Target,
    title: "Common Submission Mistakes",
    description: "Missing cover pages, wrong file formats, and incorrect headers are the top reasons for rejection.",
  },
  {
    icon: Lightbulb,
    title: "Read Syllabus Effectively",
    description: "Break down topics into weekly goals and track your progress to avoid last-minute cramming.",
  },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 animate-fade-in">
              UniTools
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Academic utilities that format, organize, and protect your marks.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Link to="/uniformat">
                <Button variant="hero" size="xl">
                  Format Assignment
                </Button>
              </Link>
              <Link to="#tools">
                <Button variant="heroOutline" size="xl">
                  Explore Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
              Academic Tools for Every Need
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Four essential utilities designed to help you submit perfect assignments every time.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
              How UniTools Helps
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A simple four-step process from upload to download.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="text-center relative">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 text-secondary">
                  <step.icon className="w-8 h-8" />
                </div>
                <div className="absolute top-8 left-1/2 w-full h-0.5 bg-border -z-10 hidden lg:block last:hidden" 
                     style={{ display: index === 3 ? 'none' : undefined }} />
                <h3 className="font-semibold text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
              Student Success Tips
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Quick tips to help you avoid common academic pitfalls.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tips.map((tip) => (
              <div key={tip.title} className="bg-card rounded-xl border border-border p-6">
                <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/10 text-secondary">
                  <tip.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-primary mb-2">{tip.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
              Ready to Submit with Confidence?
            </h2>
            <p className="text-muted-foreground mb-8">
              Start formatting your assignment now. No login required.
            </p>
            <Link to="/uniformat">
              <Button variant="hero" size="lg">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
