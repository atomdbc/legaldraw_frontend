// src/components/documents/wizard/DocumentPreview.tsx
'use client';

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface DocumentPreviewProps {
  documentType: string;
  htmlContent: string | null;
  isGenerating: boolean;
  className?: string;
}

export function DocumentPreview({
  documentType,
  htmlContent,
  isGenerating,
  className
}: DocumentPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && htmlContent) {
      const iframe = iframeRef.current;
      iframe.onload = () => {
        try {
          // Add custom styles to the iframe content
          const style = iframe.contentDocument?.createElement('style');
          if (style) {
            style.textContent = `
              body {
                margin: 0;
                padding: 2rem;
                overflow-x: hidden;
                max-width: 100%;
                box-sizing: border-box;
              }
              * {
                max-width: 100%;
                box-sizing: border-box;
              }
            `;
            iframe.contentDocument?.head.appendChild(style);
          }
        } catch (error) {
          console.error('Error injecting styles into iframe:', error);
        }
      };
    }
  }, [htmlContent]);

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent" />
        <span className="ml-3 text-sm text-muted-foreground">Generating document...</span>
      </div>
    );
  }

  if (!htmlContent) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No preview available</p>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full h-full", className)}>
      <iframe 
        ref={iframeRef}
        srcDoc={htmlContent}
        className="absolute inset-0 w-full h-full border-0"
        title="Document Preview"
        sandbox="allow-same-origin"
      />
    </div>
  );
}