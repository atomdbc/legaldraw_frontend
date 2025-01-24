// src/components/documentation/SearchDialog.tsx
'use client';

import { Suspense } from 'react';
import { Search, Home, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchResults: Array<{ section: string; title: string }>;
  onSearch: (query: string) => void;
  onSelect: (section: string) => void;
}

export function SearchDialog({
  open,
  onOpenChange,
  searchResults,
  onSearch,
  onSelect
}: SearchDialogProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Search Documentation</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            placeholder="Search documentation..."
            onValueChange={onSearch}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              <CommandItem
                onSelect={() => {
                  router.push('/dashboard');
                  onOpenChange(false);
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  onSelect('introduction');
                  onOpenChange(false);
                }}
              >
                <Home className="mr-2 h-4 w-4" />
                Documentation Home
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            {searchResults.length > 0 && (
              <CommandGroup heading="Search Results">
                {searchResults.map((result) => (
                  <CommandItem
                    key={result.section}
                    onSelect={() => {
                      onSelect(result.section);
                      onOpenChange(false);
                    }}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    {result.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            <CommandSeparator />

            <CommandGroup heading="Quick Links">
              <CommandItem
                onSelect={() => {
                  onSelect('quick-start');
                  onOpenChange(false);
                }}
              >
                <Search className="mr-2 h-4 w-4" />
                Quick Start Guide
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  onSelect('document-creation');
                  onOpenChange(false);
                }}
              >
                <Search className="mr-2 h-4 w-4" />
                Create Documents
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}