// src/components/documents/preview/DocumentPreviewPanel.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface PageThumbnail {
  id: number;
  title: string;
  selected: boolean;
}

interface DocumentPreviewPanelProps {
  content: string;
  onPageChange?: (pageNumber: number) => void;
  previewIframeRef: React.RefObject<HTMLIFrameElement>;
}

export function DocumentPreviewPanel({
  content,
  onPageChange,
  previewIframeRef
}: DocumentPreviewPanelProps) {
  const [pages, setPages] = useState<PageThumbnail[]>([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const thumbnailIframeRef = useRef<HTMLIFrameElement>(null);

  // Parse content into pages
  useEffect(() => {
    if (!content) return;

    // Create temporary iframe to parse content
    const tempIframe = document.createElement('iframe');
    tempIframe.style.visibility = 'hidden';
    tempIframe.style.position = 'absolute';
    document.body.appendChild(tempIframe);

    // Write content to iframe
    if (tempIframe.contentDocument) {
      tempIframe.contentDocument.write(content);
      tempIframe.contentDocument.close();

      // Find all page divs
      const pageElements = tempIframe.contentDocument.querySelectorAll('.page');
      const newPages: PageThumbnail[] = Array.from(pageElements).map((_, index) => ({
        id: index + 1,
        title: `Page ${index + 1}`,
        selected: index === 0
      }));

      setPages(newPages);

      // Cleanup
      document.body.removeChild(tempIframe);
    }
  }, [content]);

  const handlePageClick = (pageNumber: number) => {
    setSelectedPage(pageNumber);
    onPageChange?.(pageNumber);

    // Scroll the preview to the selected page
    if (previewIframeRef.current?.contentDocument) {
      const pageElement = previewIframeRef.current.contentDocument
        .querySelector(`.page:nth-child(${pageNumber})`);
      pageElement?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Card className="h-full">
      <ScrollArea className="h-full">
        <div className="p-2 space-y-2">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => handlePageClick(page.id)}
              className={cn(
                "w-full text-left p-2 rounded-lg transition-colors",
                "hover:bg-accent group relative",
                selectedPage === page.id ? "bg-accent" : "bg-background"
              )}
            >
              {/* Page Thumbnail */}
              <div className="aspect-[8.5/11] w-full mb-2 rounded border bg-white shadow-sm overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                  Page {page.id}
                </div>
              </div>
              
              {/* Page Title */}
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-medium">Page {page.id}</span>
                {selectedPage === page.id && (
                  <span className="text-xs text-muted-foreground">Current</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}