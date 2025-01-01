import { useState, useCallback } from 'react';
import { EditorContent } from './EditorContent';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw } from 'lucide-react';
import useDocument from '@/hooks/useDocument';

interface DocumentEditorProps {
  content: string;
  documentId: string;
  documentType: string;
  version: string;
  onSave: (content: string) => Promise<void>;
}

export default function DocumentEditor({
  content,
  documentId,
  documentType,
  version,
  onSave,
}: DocumentEditorProps) {
  const { toast } = useToast();
  const [editorContent, setEditorContent] = useState(content);
  const [isDirty, setIsDirty] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { publishDraft } = useDocument();

  const handleContentChange = useCallback((newContent: string, newDocumentId?: string) => {
    setEditorContent(newContent);
    setIsDirty(true);
  }, []);

  const handlePublish = async () => {
    if (!isDirty) return;
    
    try {
      setIsPublishing(true);
      
      // Call publish instead of save
      const publishedDoc = await publishDraft(documentId, editorContent, version);
      
      // Redirect to the new document
      if (publishedDoc?.document_id) {
        window.location.href = `/documents/${publishedDoc.document_id}`;
      }
      
    } catch (error: any) {
      // Better error logging
      console.error('Publishing failed:', {
        error,
        message: error.message,
        details: error.error,
        content: editorContent.substring(0, 100) // Log first 100 chars of content
      });
      
      toast({
        variant: "destructive",
        title: "Publishing Failed",
        description: error.error?.message || "Failed to publish document changes"
      });
    } finally {
      setIsPublishing(false);
    }
};

  const handleDiscard = useCallback(() => {
    setEditorContent(content);
    setIsDirty(false);
    toast({
      title: "Changes discarded"
    });
  }, [content]);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="w-full border-b bg-white px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{documentType}</h1>
            <span className="text-sm text-muted-foreground">v{version}</span>
            {isDirty && <span className="text-sm text-yellow-600">(Unsaved changes)</span>}
          </div>
          <div className="flex items-center gap-2">
            {isDirty && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDiscard}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Discard Changes
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={isPublishing || !isDirty}
                  size="sm"
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isPublishing ? 'Publishing...' : 'Publish Changes'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <EditorContent
          content={editorContent}
          documentId={documentId}
          onChange={handleContentChange}
        />
      </div>
    </div>
  );
}