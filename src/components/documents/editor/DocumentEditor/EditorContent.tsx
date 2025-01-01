import { useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid';

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
          [contenteditable=true] { 
            outline: none !important;
          }
          [contenteditable=true]:hover {
            cursor: text;
          }
          [contenteditable=true]:focus {
            background: rgba(0, 0, 0, 0.02);
          }
        `;
        frame.contentWindow.document.head.appendChild(editStyle);

        // Make elements editable on click
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

        // Handle content changes
        let debounceTimer: any;
        frame.contentWindow.document.addEventListener('input', () => {
          // Save current selection state
          const saveSelection = () => {
            const sel = frame.contentWindow?.getSelection();
            if (sel && sel.rangeCount > 0) {
              return sel.getRangeAt(0);
            }
            return null;
          };

          // Restore selection state
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
              // Generate new UUID on content change
              const newDocumentId = uuid();
              
              // Update URL with new UUID
              window.history.pushState({}, '', `/documents/${newDocumentId}`);
              
              // Notify parent with new content and UUID
              onChange(currentContent, newDocumentId);
            }

            // Restore the selection after change
            if (savedRange) {
              requestAnimationFrame(() => {
                restoreSelection(savedRange);
              });
            }
          }, 100);
        });

        // Prevent form submission
        frame.contentWindow.document.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
          }
        });

        isInitialized.current = true;
      }
    }
  }, []);

  // Update content only when needed
  useEffect(() => {
    if (frameRef.current?.contentWindow && isInitialized.current) {
      const currentContent = frameRef.current.contentWindow.document.documentElement.outerHTML;
      if (currentContent !== content) {
        // Save the current selection if any
        const selection = frameRef.current.contentWindow.getSelection();
        const savedRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        
        // Update the content
        frameRef.current.contentWindow.document.body.innerHTML = new DOMParser()
          .parseFromString(content, 'text/html')
          .body.innerHTML;

        // Restore selection if it existed
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
    <div
      ref={containerRef}
      className="absolute inset-0 bg-white"
    />
  );
}