// src/app/documentation/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, Menu, Home, ArrowLeft } from 'lucide-react';

// Components
import { DocNavigation } from '@/components/documentation/DocNavigation';
import { SearchDialog } from '@/components/documentation/sections/SearchDialog';
import { IntroductionSection } from '@/components/documentation/sections/Introduction';
import { QuickStartSection } from '@/components/documentation/sections/QuickStart';
import { DocumentCreationSection } from '@/components/documentation/sections/DocumentCreation';
import { PartyManagementSection } from '@/components/documentation/sections/PartyManagement';
import { AIFeaturesSection } from '@/components/documentation/sections/AIFeatures';
import { UpcomingFeaturesSection } from '@/components/documentation/sections/UpcomingFeatures';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState('introduction');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{section: string, title: string}>>([]);

  useEffect(() => {
    const section = searchParams?.get('section');
    if (section && sections[section]) {
      setActiveSection(section);
    }
  }, [searchParams]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleNavigation = (section: string) => {
    setActiveSection(section);
    setMobileOpen(false);
    router.push(`/documentation?section=${section}`);
  };

  const handleSearch = (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    const results = Object.entries(sections)
      .filter(([key, section]) => {
        const searchText = [
          section.title.toLowerCase(),
          ...(section.keywords || []).map(k => k.toLowerCase())
        ].join(' ');
        return searchText.includes(query.toLowerCase());
      })
      .map(([key, section]) => ({
        section: key,
        title: section.title
      }));

    setSearchResults(results);
  };

  const ActiveSection = sections[activeSection]?.component || sections.introduction.component;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Navigation */}
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
        {/* Header */}
        <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between px-4">
            {/* Left: Breadcrumb */}
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

            {/* Right: Search & Dashboard */}
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
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="hidden md:flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Button>
            </div>
          </div>
        </header>

        {/* Search Dialog */}
        <SearchDialog 
          open={searchOpen}
          onOpenChange={setSearchOpen}
          searchResults={searchResults}
          onSearch={handleSearch}
          onSelect={handleNavigation}
        />

        {/* Content */}
        <main className="container py-6">
          <div className="mx-auto max-w-4xl">
            <ActiveSection />
          </div>
        </main>
      </div>
    </div>
  );
}