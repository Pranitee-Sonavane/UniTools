import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Mail,
  MessageSquare,
  Lightbulb,
  Bug,
  Send,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const { toast } = useToast();

  const [type, setType] = useState("feedback");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

    const readableType =
      type === "feedback"
        ? "Feedback"
        : type === "feature"
        ? "Feature Request"
        : "Bug Report";

    try {
      await emailjs.send(
        "service_0pajgnf",
        "template_veulrre", // ✅ ONLY THIS TEMPLATE
        {
          user_name: name,
          user_email: email,
          message: message,
          message_type: readableType,
        },
        "3F-ABXIkSaKd6O4kM" // public key
      );

      setIsSubmitted(true);
      toast({
        title: "Message sent!",
        description: "Thanks for reaching out 💙",
      });
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Layout>
        <div className="py-20">
          <div className="container max-w-lg text-center">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 text-success">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-4">
              Thank You!
            </h1>
            <p className="text-muted-foreground mb-8">
              Your message has been received 💌
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
            <h1 className="text-3xl font-bold text-primary mb-3">
              Contact Us
            </h1>
            <p className="text-muted-foreground">
              Have feedback, found a bug, or want to suggest a feature?
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
                {[
                  { value: "feedback", icon: MessageSquare, label: "Feedback" },
                  { value: "feature", icon: Lightbulb, label: "Feature" },
                  { value: "bug", icon: Bug, label: "Bug" },
                ].map(({ value, icon: Icon, label }) => (
                  <label
                    key={value}
                    className={`flex flex-col items-center p-4 rounded-xl border cursor-pointer transition-colors ${
                      type === value
                        ? "border-secondary bg-secondary/5"
                        : "border-border hover:border-secondary/50"
                    }`}
                  >
                    <RadioGroupItem value={value} className="sr-only" />
                    <Icon className="w-5 h-5 mb-2" />
                    <span className="text-sm font-medium">{label}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            {/* Name */}
            <div>
              <Label>Your Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div>
              <Label>Email Address</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
              />
            </div>

            {/* Message */}
            <div>
              <Label>Your Message</Label>
              <Textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind..."
              />
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </Button>
          </form>

          <div className="mt-10 text-center pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Or email us at{" "}
              <a
                href="mailto:unitools2922@gmail.com"
                className="text-secondary hover:underline"
              >
                unitools2922@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
