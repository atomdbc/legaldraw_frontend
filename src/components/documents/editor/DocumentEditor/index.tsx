import { useState, useCallback } from 'react';
import { EditorContent } from './EditorContent';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
 const [publishError, setPublishError] = useState<string | null>(null);
 const { publishDraft } = useDocument();

 const handleContentChange = useCallback((newContent: string, newDocumentId?: string) => {
   setEditorContent(newContent);
   setIsDirty(true);
   setPublishError(null);
 }, []);

 const handlePublish = async () => {
   if (!isDirty) return;
   
   try {
     setIsPublishing(true);
     setPublishError(null);
     
     const publishedDoc = await publishDraft(documentId, editorContent, version);
     
     if (publishedDoc?.document_id) {
       window.location.href = `/documents/${publishedDoc.document_id}`;
     }
     
   } catch (error: any) {
     const errorObj = error.error || error;
     let errorMessage = errorObj.message || 'Failed to publish document';
     
     // Clean up the error message
     errorMessage = errorMessage.replace(/^\d{3}:\s*/, '');
     setPublishError(errorMessage);
     
     toast({
       variant: "destructive",
       title: "Publishing failed", 
       description: "You need an active subscription to publish documents"
     });
   } finally {
     setIsPublishing(false);
   }
 };

 const handleDiscard = useCallback(() => {
   setEditorContent(content);
   setIsDirty(false);
   setPublishError(null);
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

     {publishError && (
  <div className="backdrop-blur-sm bg-white/50 border-y border-gray-200/60">
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white/70 backdrop-blur-md rounded-lg shadow-lg border border-gray-200/60 p-6">
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-black/5 backdrop-blur-sm flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-gray-900" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upgrade to Continue Publishing
          </h3>
          <p className="text-gray-600 mb-6 max-w-md">
            {publishError}
          </p>
          <div className="flex gap-3 items-center">
            <Button
              size="default"
              className="bg-gray-900 hover:bg-gray-800 text-white shadow-sm backdrop-blur-sm"
              onClick={() => window.location.href = '/settings/billing'}
            >
              Upgrade Now
            </Button>
            <Button
              variant="ghost"
              size="default"
              className="text-gray-600 hover:text-gray-800 hover:bg-gray-100/50"
              onClick={() => setPublishError(null)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
     
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