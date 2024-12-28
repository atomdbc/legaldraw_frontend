import { useEffect, useCallback, useRef } from 'react';
import { EditorContent as TipTapEditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EditorContentProps {
  content: string;
  onChange: (content: string) => void;
  onEditorReady?: (editor: any) => void;
  settings?: {
    hasCoverPage?: boolean;
    coverPageText?: string;
    hasWatermark?: boolean;
    watermarkText?: string;
    coverPageLogo?: File;
  };
}

export function EditorContent({
  content,
  onChange,
  onEditorReady,
  settings = {}
}: EditorContentProps) {
  const { hasCoverPage, coverPageText, hasWatermark, watermarkText, coverPageLogo } = settings;
  const contentRef = useRef(content);
  const isInitialMount = useRef(true);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      Paragraph,
      Text,
      Heading.configure({
        levels: [1, 2, 3]
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      })
    ],
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none focus:outline-none",
          hasWatermark && "watermark-container"
        )
      }
    },
    onUpdate: ({ editor }) => {
      const mainContent = extractMainContent(editor.getHTML());
      onChange(mainContent);
      contentRef.current = mainContent;
    }
  });

  const extractMainContent = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const mainContent = doc.querySelector('.document-content');
    return mainContent ? mainContent.innerHTML : html;
  };

  const generateFullContent = useCallback(() => {
    const mainContent = contentRef.current;
    const coverPageStyles = `
      <style>
        @page {
          margin: 0;
          size: 8.5in 11in;
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
        }
        .editor-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .cover-page {
          height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: white;
          position: relative;
          page-break-after: always;
          padding: 4rem 2rem;
        }
        .cover-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          max-width: 600px;
          width: 100%;
        }
        .logo-container {
          margin-bottom: 3rem;
          width: 180px;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-container img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .title-section {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }
        .cover-title {
          font-size: 48px;
          font-weight: 700;
          color: #000;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin: 0;
        }
        .document-type {
          font-size: 24px;
          color: #666;
          margin-top: 0.5rem;
          font-weight: 500;
        }
        .document-date {
          font-size: 16px;
          color: #666;
          margin-top: 0.5rem;
        }
        .document-content {
          flex: 1;
          min-height: 100vh;
          padding: 3rem 2rem;
          background: white;
          page-break-before: always;
        }
        ${hasWatermark ? `
          .watermark-container {
            position: relative;
          }
          .watermark-container::before {
            content: "${watermarkText || 'DRAFT'}";
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120px;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.08);
            white-space: nowrap;
            pointer-events: none;
            z-index: 1;
            width: 100%;
            text-align: center;
          }
        ` : ''}
        @media print {
          .cover-page {
            height: 100vh;
            page-break-after: always;
          }
          .document-content {
            page-break-before: always;
          }
        }
      </style>
    `;

    const coverPageHtml = hasCoverPage ? `
      <div class="cover-page">
        <div class="cover-content">
          ${coverPageLogo ? `
            <div class="logo-container">
              <img src="${URL.createObjectURL(coverPageLogo)}" alt="Cover Logo" />
            </div>
          ` : ''}
          <div class="title-section">
            <h1 class="cover-title">${coverPageText || 'Document Title'}</h1>
            <div class="document-type">SERVICE</div>
            <div class="document-date">
              ${format(new Date(), 'MMMM d, yyyy')}
            </div>
          </div>
        </div>
      </div>
    ` : '';

    return `
      <div class="editor-container ${hasWatermark ? 'watermark-container' : ''}">
        ${coverPageStyles}
        ${coverPageHtml}
        <div class="document-content">
          ${mainContent}
        </div>
      </div>
    `;
  }, [hasCoverPage, coverPageText, coverPageLogo, hasWatermark, watermarkText]);

  useEffect(() => {
    if (editor) {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        contentRef.current = content;
        editor.commands.setContent(generateFullContent());
      }
      if (onEditorReady) {
        onEditorReady(editor);
      }
    }
  }, [editor, content, generateFullContent, onEditorReady]);

  useEffect(() => {
    if (editor && !isInitialMount.current) {
      editor.commands.setContent(generateFullContent());
    }
  }, [hasCoverPage, coverPageText, coverPageLogo, hasWatermark, watermarkText, editor, generateFullContent]);

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="mx-auto max-w-4xl h-full">
        <TipTapEditorContent editor={editor} />
      </div>
    </div>
  );
}