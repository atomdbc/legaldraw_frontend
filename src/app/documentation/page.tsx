// src/app/documentation/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { DocNavigation } from '@/components/documentation/DocNavigation';
import { IntroductionSection } from '@/components/documentation/sections/Introduction';
import { QuickStartSection } from '@/components/documentation/sections/QuickStart';
import { DocumentCreationSection } from '@/components/documentation/sections/DocumentCreation';
import { PartyManagementSection } from '@/components/documentation/sections/PartyManagement';
import { AIFeaturesSection } from '@/components/documentation/sections/AIFeatures';
import { UpcomingFeaturesSection } from '@/components/documentation/sections/UpcomingFeatures';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, Home } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";

const sections = {
  'introduction': {
    component: IntroductionSection,
    title: 'Introduction',
    keywords: ['getting started', 'overview', 'introduction', 'basics']
  },
  'quick-start': {
    component: QuickStartSection,
    title: 'Quick Start',
    keywords: ['tutorial', 'guide', 'start', 'begin', 'first document']
  },
  'document-creation': {
    component: DocumentCreationSection,
    title: 'Document Creation',
    keywords: ['create', 'new document', 'generate', 'draft']
  },
  'party-management': {
    component: PartyManagementSection,
    title: 'Party Management',
    keywords: ['parties', 'users', 'members', 'roles']
  },
  'ai-features': {
    component: AIFeaturesSection,
    title: 'AI Features',
    keywords: ['ai', 'artificial intelligence', 'smart features', 'automation']
  },
  'upcoming-features': {
    component: UpcomingFeaturesSection,
    title: 'Upcoming Features',
    keywords: ['coming soon', 'roadmap', 'future', 'planned']
  }
};

export default function DocumentationPage() {
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState('introduction');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{section: string, title: string}>>([]);

  useEffect(() => {
    const section = searchParams.get('section');
    if (section && sections[section]) {
      setActiveSection(section);
    }
  }, [searchParams]);

  const ActiveSection = sections[activeSection]?.component || sections.introduction.component;

  const handleNavigation = (section: string) => {
    setActiveSection(section);
    setMobileOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.set('section', section);
    window.history.pushState({}, '', url);
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    const results = Object.entries(sections)
      .filter(([key, section]) => {
        const searchTerms = [...section.keywords, section.title.toLowerCase()];
        return searchTerms.some(term => 
          term.toLowerCase().includes(query.toLowerCase())
        );
      })
      .map(([key, section]) => ({
        section: key,
        title: section.title
      }));

    setSearchResults(results);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Navigation Trigger */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 top-4 z-40 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <DocNavigation 
            onSelect={handleNavigation}
            currentSection={activeSection}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <div className="hidden lg:block w-80 border-r shrink-0">
        <DocNavigation 
          onSelect={handleNavigation}
          currentSection={activeSection}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Search Header */}
        <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between px-4">
            {/* Left side: Breadcrumb */}
            <nav className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex items-center gap-2"
                onClick={() => handleNavigation('introduction')}
              >
                <Home className="h-4 w-4" />
                <span>Documentation</span>
              </Button>
              <div className="flex items-center text-sm">
                <span className="text-muted-foreground hidden md:inline">/</span>
                <span className="ml-2 font-medium">{sections[activeSection]?.title}</span>
              </div>
            </nav>

            {/* Right side: Search */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="w-full md:w-60 justify-start text-muted-foreground"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="mr-2 h-4 w-4" />
                <span>Search docs...</span>
                <kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
              </Button>
            </div>
          </div>
        </header>

        {/* Search Dialog */}
        <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
          <CommandInput 
            placeholder="Search documentation..."
            onValueChange={handleSearch}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Results">
              {searchResults.map((result) => (
                <CommandItem
                  key={result.section}
                  onSelect={() => {
                    handleNavigation(result.section);
                    setSearchOpen(false);
                  }}
                >
                  <Search className="mr-2 h-4 w-4" />
                  {result.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>

        {/* Content Area */}
        <main className="container py-6">
          <div className="mx-auto max-w-4xl">
            <ActiveSection />
          </div>
        </main>
      </div>
    </div>
  );
}