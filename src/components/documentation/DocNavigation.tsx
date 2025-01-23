// src/components/documentation/DocNavigation.tsx
'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Book, 
  FileText, 
  Users, 
  Bot, 
  Sparkles, 
  Flag, 
  Settings,
  HelpCircle,
  Rocket,
  Code,
  FileSearch,
  MessageSquare,
  Plug,
  ChevronRight
} from "lucide-react";

export const docNavItems = [
  {
    title: "Getting Started",
    icon: Book,
    items: [
      { title: "Introduction", href: "introduction" },
      { title: "Quick Start", href: "quick-start" },
    ]
  },
  {
    title: "Core Features",
    icon: FileText,
    items: [
      { title: "Document Creation", href: "document-creation" },
      { title: "Party Management", href: "party-management" },
      { title: "AI Features", href: "ai-features" },
    ]
  },
  {
    title: "Coming Soon",
    icon: Rocket,
    items: [
      { title: "Upcoming Features", href: "upcoming-features" },
      { 
        title: "Team Collaboration", 
        href: "team-collaboration",
        badge: "Soon"
      },
      { 
        title: "API Access", 
        href: "api-access",
        badge: "Soon"
      }
    ]
  },
  {
    title: "Resources",
    icon: HelpCircle,
    items: [
      { 
        title: "API Documentation", 
        href: "api-documentation",
        badge: "Coming Soon"
      },
      { 
        title: "Example Templates", 
        href: "templates",
        badge: "Coming Soon"
      }
    ]
  }
];

interface DocNavigationProps {
  className?: string;
  onSelect?: (href: string) => void;
  currentSection?: string;
}

export function DocNavigation({ 
  className, 
  onSelect, 
  currentSection = 'introduction' 
}: DocNavigationProps) {
  return (
    <ScrollArea className={cn("h-[calc(100vh-4rem)] py-6 pr-6", className)}>
      <div className="mb-4 px-4">
        <h2 className="text-lg font-semibold">Documentation</h2>
        <p className="text-sm text-muted-foreground">
          Learn how to use LegalDraw
        </p>
      </div>
      
      <div className="space-y-6 px-2">
        {docNavItems.map((section, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center gap-2 px-2">
              <section.icon className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-medium">{section.title}</h4>
            </div>
            
            <div className="grid gap-1">
              {section.items.map((item, j) => (
                <Button
                  key={j}
                  variant={currentSection === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-between text-sm",
                    currentSection === item.href && "bg-secondary"
                  )}
                  onClick={() => onSelect?.(item.href)}
                >
                  <span className="truncate">{item.title}</span>
                  {item.badge ? (
                    <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      {item.badge}
                    </span>
                  ) : (
                    currentSection === item.href && (
                      <ChevronRight className="h-4 w-4" />
                    )
                  )}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}