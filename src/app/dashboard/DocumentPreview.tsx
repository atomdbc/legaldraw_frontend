import React, { useRef, useEffect } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { FileText, Calendar, ArrowRight, MousePointerClick } from "lucide-react";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DocumentPreview = ({ document }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!document.content) return; // Skip if no content

    const contentForPreview = document.content
      .replace(/<style>[^<]*<\/style>/g, '')
      .replace(/<script>[^<]*<\/script>/g, '')
      .replace(/@page[^}]*}/g, '');

    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      doc.open();
      doc.write(`
        <html>
          <head>
            <style>
              body {
                margin: 0;
                padding: 16px;
                font-family: system-ui, -apple-system, sans-serif;
                transform-origin: top left;
                transform: scale(0.25);
                width: 400%;
                filter: blur(6px);
                opacity: 0.7;
                background: white;
              }
              * {
                max-width: 100%;
              }
              body::before {
                content: '';
                position: fixed;
                inset: 0;
                background: linear-gradient(45deg, 
                  rgba(255,255,255,0.2) 25%, 
                  transparent 25%, 
                  transparent 75%, 
                  rgba(255,255,255,0.2) 75%);
                background-size: 4px 4px;
                pointer-events: none;
              }
            </style>
          </head>
          <body>${contentForPreview}</body>
        </html>
      `);
      doc.close();
    }
  }, [document.content]);

  const renderPreview = () => {
    if (document.content) {
      return (
        <iframe
          ref={iframeRef}
          title={`Preview of ${document.document_type}`}
          className="w-full h-full border-0 pointer-events-none"
          sandbox="allow-same-origin"
        />
      );
    }

    // Placeholder when no content is available
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <FileText className="h-12 w-12 mb-2 opacity-20" />
        <p className="text-sm text-center opacity-50">
          Preview not available in draft mode
        </p>
      </div>
    );
  };

  const documentStatus = document.status?.toLowerCase() || 'draft';
  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    pending: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700'
  };

  return (
    <Card 
      className="flex flex-col h-[400px] group relative cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={() => window.location.href=`/documents/${document.document_id}`}
    >
      <CardHeader className="flex-shrink-0 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold">{document.document_type}</h3>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(document.generated_at), 'MMM d, yyyy')}
                </p>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full capitalize",
                  statusColors[documentStatus] || statusColors.draft
                )}>
                  {documentStatus.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-gray-50">
          {renderPreview()}
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-transparent to-white/50" />
          
          {/* Icon hover effect */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/5 transition-all">
            <div className="opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all transform duration-200">
              <div className="bg-white/90 rounded-full p-4 shadow-lg">
                <MousePointerClick className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <div className="p-4 border-t mt-auto">
        <Button 
          variant="ghost" 
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            window.location.href=`/documents/${document.document_id}`;
          }}
        >
          View Full Document <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default DocumentPreview;