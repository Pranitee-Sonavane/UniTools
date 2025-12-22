import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mail, MessageSquare, Lightbulb, Bug, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [type, setType] = useState("feedback");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "Message sent!",
        description: "Thank you for your feedback. We'll get back to you soon.",
      });
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <Layout>
        <div className="py-20">
          <div className="container max-w-lg text-center">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 text-success">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-4">Thank You!</h1>
            <p className="text-muted-foreground mb-8">
              Your message has been received. We'll review it and get back to you 
              if needed. Your feedback helps us improve UniTools for everyone.
            </p>
            <Button variant="outline" onClick={() => setIsSubmitted(false)}>
              Send Another Message
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-16">
        <div className="container max-w-xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 text-secondary">
              <Mail className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-3">Contact Us</h1>
            <p className="text-muted-foreground">
              Have feedback, found a bug, or want to suggest a feature? We'd love to hear from you.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Message Type */}
            <div>
              <Label className="mb-3 block">What's this about?</Label>
              <RadioGroup
                value={type}
                onValueChange={setType}
                className="grid grid-cols-3 gap-3"
              >
                <label 
                  className={`flex flex-col items-center p-4 rounded-xl border cursor-pointer transition-colors ${
                    type === "feedback" ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/50"
                  }`}
                >
                  <RadioGroupItem value="feedback" className="sr-only" />
                  <MessageSquare className={`w-5 h-5 mb-2 ${type === "feedback" ? "text-secondary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${type === "feedback" ? "text-secondary" : "text-foreground"}`}>Feedback</span>
                </label>
                <label 
                  className={`flex flex-col items-center p-4 rounded-xl border cursor-pointer transition-colors ${
                    type === "feature" ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/50"
                  }`}
                >
                  <RadioGroupItem value="feature" className="sr-only" />
                  <Lightbulb className={`w-5 h-5 mb-2 ${type === "feature" ? "text-secondary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${type === "feature" ? "text-secondary" : "text-foreground"}`}>Feature</span>
                </label>
                <label 
                  className={`flex flex-col items-center p-4 rounded-xl border cursor-pointer transition-colors ${
                    type === "bug" ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/50"
                  }`}
                >
                  <RadioGroupItem value="bug" className="sr-only" />
                  <Bug className={`w-5 h-5 mb-2 ${type === "bug" ? "text-secondary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${type === "bug" ? "text-secondary" : "text-foreground"}`}>Bug Report</span>
                </label>
              </RadioGroup>
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name" className="mb-2 block">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="mb-2 block">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message" className="mb-2 block">Your Message</Label>
              <Textarea
                id="message"
                placeholder="Tell us what's on your mind..."
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </Button>
          </form>

          {/* Direct Contact */}
          <div className="mt-10 text-center pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Or email us directly at{" "}
              <a href="mailto:hello@unitools.edu" className="text-secondary hover:underline">
                hello@unitools.edu
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
