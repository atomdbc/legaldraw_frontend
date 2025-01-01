import { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Split, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EditorContentProps {
  content: string;
  documentId: string;
  onChange: (content: string, newDocumentId?: string) => void;
}

export function EditorContent({
  content,
  onChange,
}: EditorContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const isInitialized = useRef(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (containerRef.current && !isInitialized.current) {
      const frame = document.createElement('iframe');
      frame.className = 'w-full h-full border-0';
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(frame);
      frameRef.current = frame;

      if (frame.contentWindow) {
        frame.contentWindow.document.open();
        frame.contentWindow.document.write(content);
        frame.contentWindow.document.close();

        // Add editing styles
        const editStyle = document.createElement('style');
        editStyle.textContent = `
          body {
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 2rem;
            color: #18181B;
            background: #ffffff;
          }
          
          [contenteditable=true] { 
            outline: none !important;
            transition: background 0.2s;
          }
          [contenteditable=true]:hover {
            cursor: text;
          }
          [contenteditable=true]:focus {
            background: rgba(0, 0, 0, 0.02);
            border-radius: 4px;
          }

          h1, h2, h3, h4, h5, h6 {
            margin-top: 2rem;
            margin-bottom: 1rem;
          }
          
          p {
            margin: 1rem 0;
          }
        `;
        frame.contentWindow.document.head.appendChild(editStyle);

        // [Keep all existing event listeners and logic exactly the same]
        frame.contentWindow.document.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          if (target && 
              !target.closest('.section-title') && 
              !target.closest('h1, h2')) {
            if (!target.isContentEditable) {
              target.contentEditable = 'true';
              target.focus();
            }
          }
        });

        let debounceTimer: any;
        frame.contentWindow.document.addEventListener('input', () => {
          const saveSelection = () => {
            const sel = frame.contentWindow?.getSelection();
            if (sel && sel.rangeCount > 0) {
              return sel.getRangeAt(0);
            }
            return null;
          };

          const restoreSelection = (range: Range | null) => {
            if (range && frame.contentWindow) {
              const sel = frame.contentWindow.getSelection();
              if (sel) {
                sel.removeAllRanges();
                sel.addRange(range);
              }
            }
          };

          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            const savedRange = saveSelection();
            const currentContent = frame.contentWindow?.document.documentElement.outerHTML || '';
            
            if (currentContent !== content) {
              const newDocumentId = uuid();
              window.history.pushState({}, '', `/documents/${newDocumentId}`);
              onChange(currentContent, newDocumentId);
            }

            if (savedRange) {
              requestAnimationFrame(() => {
                restoreSelection(savedRange);
              });
            }
          }, 100);
        });

        frame.contentWindow.document.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
          }
        });

        isInitialized.current = true;
      }
    }
  }, []);

  useEffect(() => {
    if (frameRef.current?.contentWindow && isInitialized.current) {
      const currentContent = frameRef.current.contentWindow.document.documentElement.outerHTML;
      if (currentContent !== content) {
        const selection = frameRef.current.contentWindow.getSelection();
        const savedRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        
        frameRef.current.contentWindow.document.body.innerHTML = new DOMParser()
          .parseFromString(content, 'text/html')
          .body.innerHTML;

        if (savedRange && selection) {
          requestAnimationFrame(() => {
            selection.removeAllRanges();
            selection.addRange(savedRange);
          });
        }
      }
    }
  }, [content]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none flex items-center justify-end px-4 py-2 border-b bg-gray-50/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsFullScreen(!isFullScreen)}
          className="text-gray-500 hover:text-gray-900"
        >
        </Button>
      </div>

      <div 
        ref={containerRef}
        className={cn(
          "flex-1 relative bg-white",
          isFullScreen && "fixed inset-0 z-50"
        )}
      />
    </div>
  );
}