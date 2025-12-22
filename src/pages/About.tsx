import { Layout } from "@/components/layout/Layout";
import { GraduationCap, Target, Users, Heart } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Purpose-Driven",
    description: "Every feature we build solves a real problem students face with assignments and exam prep.",
  },
  {
    icon: Users,
    title: "Student-First",
    description: "Designed with input from students across universities to ensure we meet actual needs.",
  },
  {
    icon: Heart,
    title: "Stress-Free",
    description: "We believe academic tools should reduce anxiety, not add to it. Simple, calm, effective.",
  },
];

export default function About() {
  return (
    <Layout>
      <div className="py-16">
        <div className="container max-w-3xl">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/10 text-secondary">
              <GraduationCap className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold text-primary mb-4">About UniTools</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Academic utilities that format, organize, and protect your marks.
            </p>
          </div>

          {/* Story */}
          <div className="prose prose-lg max-w-none mb-16">
            <div className="bg-card rounded-xl border border-border p-8 mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Why We Built This</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every semester, thousands of students lose marks not because of their knowledge, 
                but because of formatting errors, wrong file names, or missing sections. 
                We've been there — the panic of realizing your assignment font isn't Times New Roman, 
                or that you forgot the cover page five minutes before the deadline.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                UniTools was born from frustration and built with care. We wanted to create 
                a set of simple, reliable tools that handle the tedious parts of academic 
                submissions so you can focus on what actually matters: learning.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                No logins required. No complicated interfaces. Just upload, process, and submit 
                with confidence.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-primary text-center mb-8">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((value) => (
                <div key={value.title} className="text-center p-6">
                  <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary/10 text-secondary">
                    <value.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-semibold text-primary mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="text-center bg-muted/30 rounded-xl p-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Built for Students, by Students</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              UniTools is maintained by a small team of developers who understand the 
              struggles of academic life. We're constantly improving based on student 
              feedback and university requirements.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
