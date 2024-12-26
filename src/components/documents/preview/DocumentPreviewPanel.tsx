'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (!content) return;

    const tempIframe = document.createElement('iframe');
    tempIframe.style.visibility = 'hidden';
    tempIframe.style.position = 'absolute';
    document.body.appendChild(tempIframe);

    if (tempIframe.contentDocument) {
      tempIframe.contentDocument.write(content);
      tempIframe.contentDocument.close();

      const pageElements = tempIframe.contentDocument.querySelectorAll('.page');
      const newPages = Array.from(pageElements).map((_, index) => ({
        id: index + 1,
        title: `Page ${index + 1}`,
        selected: index === 0
      }));

      setPages(newPages);
      document.body.removeChild(tempIframe);
    }
  }, [content]);

  const handlePageClick = (pageNumber: number) => {
    setSelectedPage(pageNumber);
    onPageChange?.(pageNumber);

    if (previewIframeRef.current?.contentDocument) {
      const pageElement = previewIframeRef.current.contentDocument
        .querySelector(`.page:nth-child(${pageNumber})`);
      pageElement?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Card className="h-full bg-muted/5">
      <ScrollArea className="h-full">
        <div className="p-1 space-y-1">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => handlePageClick(page.id)}
              className={cn(
                "w-full text-left p-1 rounded transition-colors",
                "hover:bg-accent/50 group relative",
                selectedPage === page.id ? "bg-accent" : "bg-background"
              )}
            >
              <div className="aspect-[8.5/11] w-full rounded border bg-background shadow-sm overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                  {page.id}
                </div>
              </div>
              
              <div className="flex items-center justify-between px-1 mt-1">
                <span className="text-[10px] font-medium">Page {page.id}</span>
                {selectedPage === page.id && (
                  <span className="text-[8px] bg-primary/10 text-primary px-1 rounded">•</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}