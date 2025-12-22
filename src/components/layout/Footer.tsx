import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const toolLinks = [
  { href: "/uniformat", label: "UniFormat" },
  { href: "/submitsafe", label: "SubmitSafe" },
  { href: "/syllabus", label: "Syllabus Checklist" },
  { href: "/pyq", label: "PYQ Organizer" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-secondary" />
              <span className="text-xl font-bold text-primary">UniTools</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Academic utilities that format, organize, and protect your marks. 
              Built for students, by students.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-semibold text-primary mb-4">Tools</h4>
            <ul className="space-y-2">
              {toolLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-primary mb-4">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="mailto:hello@unitools.edu"
                  className="text-sm text-muted-foreground hover:text-secondary transition-colors"
                >
                  hello@unitools.edu
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} UniTools. All rights reserved. 
            UniTools is a student utility platform. Always verify university-specific rules.
          </p>
        </div>
      </div>
    </footer>
  );
}
