'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface PageThumbnail {
  id: number;
  title: string;
  selected: boolean;
  isCoverPage?: boolean;
}

interface DocumentPreviewPanelProps {
  content: string;
  onPageChange?: (pageNumber: number) => void;
  previewIframeRef: React.RefObject<HTMLIFrameElement>;
  hasCoverPage?: boolean;
  coverPageText?: string;
  coverPageLogo?: File | null;
}

export function DocumentPreviewPanel({
  content,
  onPageChange,
  previewIframeRef,
  hasCoverPage,
  coverPageText,
  coverPageLogo
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
      const contentPages = Array.from(pageElements).map((_, index) => {
        const pageNumber = hasCoverPage ? index + 2 : index + 1;
        return {
          id: pageNumber,
          title: `Page ${pageNumber}`,
          selected: false
        };
      });

      if (hasCoverPage) {
        contentPages.unshift({
          id: 1,
          title: 'Cover Page',
          selected: true,
          isCoverPage: true
        });
      }

      setPages(contentPages);
      document.body.removeChild(tempIframe);
    }
  }, [content, hasCoverPage]);

  const handlePageClick = (pageNumber: number) => {
    setSelectedPage(pageNumber);
    onPageChange?.(pageNumber);

    if (previewIframeRef.current?.contentDocument) {
      // If it's not the cover page, adjust the page selection
      const targetPage = hasCoverPage ? `.page:nth-child(${pageNumber})` : `.page:nth-child(${pageNumber})`;
      const pageElement = previewIframeRef.current.contentDocument.querySelector(targetPage);
      
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: 'smooth' });
      }
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
                {page.isCoverPage ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4">
                    {coverPageLogo && (
                      <div className="flex-1 flex items-center justify-center">
                        <img 
                          src={URL.createObjectURL(coverPageLogo)} 
                          alt="Cover Logo" 
                          className="max-w-[150px] max-h-[150px] object-contain mb-4"
                        />
                      </div>
                    )}
                    <div className="text-sm font-medium text-center text-zinc-900">
                      {coverPageText || 'Cover Page'}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                    {page.id}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between px-1 mt-1">
                <span className="text-[10px] font-medium truncate">
                  {page.title}
                </span>
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