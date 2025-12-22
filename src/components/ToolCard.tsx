import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

export function ToolCard({ icon: Icon, title, description, href }: ToolCardProps) {
  return (
    <div className="group relative bg-card rounded-xl border border-border p-6 hover:border-secondary/50 hover:shadow-lg transition-all duration-300">
      <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors duration-300">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>
      <Link to={href}>
        <Button variant="outline" size="sm" className="group-hover:bg-secondary group-hover:text-secondary-foreground group-hover:border-secondary transition-colors">
          Open Tool
        </Button>
      </Link>
    </div>
  );
}
