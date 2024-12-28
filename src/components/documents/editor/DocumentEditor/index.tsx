import { useState, useCallback, useEffect } from 'react';
import { EditorContent } from './EditorContent';
import { EditorHeader } from './EditorHeader';
import { EditorToolbar } from './EditorToolbar';
import { EditorSettings } from './EditorSettings';
import { useToast } from '@/hooks/use-toast';
import { Editor } from '@tiptap/react';
import debounce from 'lodash/debounce';
import { FileText, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DocumentEditorProps {
  content: string;
  documentId: string;
  documentType: string;
  version: string;
  onSave: (content: string) => Promise<void>;
  settings: {
    hasCoverPage: boolean;
    coverPageText: string;
    hasWatermark: boolean;
    watermarkText: string;
    coverPageLogo?: File | null;
  };
  onSettingsChange: (settings: Partial<DocumentEditorProps['settings']>) => void;
  onLogoUpload: (file: File) => void;
  onLogoRemove: () => void;
  onTabChange?: (tab: string) => void;
}

export function DocumentEditor({
  content,
  documentId,
  documentType,
  version,
  onSave,
  settings: initialSettings,
  onSettingsChange,
  onLogoUpload,
  onLogoRemove,
  onTabChange
}: DocumentEditorProps) {
  const { toast } = useToast();
  const [editorContent, setEditorContent] = useState(content);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState(initialSettings);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [showPreviewAlert, setShowPreviewAlert] = useState(false);

  // Reset alert when document changes
  useEffect(() => {
    setShowPreviewAlert(false);
  }, [documentId]);

  const notifyPreviewNeeded = useCallback(() => {
    // Show toast
    toast({
      title: "Switch to Preview",
      description: (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Click Preview tab to see your changes</span>
        </div>
      ),
      duration: 5000,
    });
    
    // Show alert
    setShowPreviewAlert(true);
    
    // Optionally auto-switch to preview tab
    // if (onTabChange) {
    //   onTabChange('preview');
    // }
  }, [toast]);

  const debouncedContentChange = useCallback(
    debounce((newContent: string) => {
      setEditorContent(newContent);
      setIsDirty(true);
    }, 300),
    []
  );

  const handleSettingsChange = useCallback((changes: Partial<typeof settings>) => {
    requestAnimationFrame(() => {
      setSettings(prev => {
        const newSettings = { ...prev, ...changes };
        setIsDirty(true);
        onSettingsChange(newSettings);
        
        // Show preview notification for relevant changes
        if ('hasCoverPage' in changes || 
            'coverPageText' in changes || 
            'coverPageLogo' in changes ||
            'hasWatermark' in changes || 
            'watermarkText' in changes) {
          notifyPreviewNeeded();
        }
        
        return newSettings;
      });
    });
  }, [onSettingsChange, notifyPreviewNeeded]);

  const handleLogoUpload = useCallback((file: File) => {
    onLogoUpload(file);
    notifyPreviewNeeded();
  }, [onLogoUpload, notifyPreviewNeeded]);

  const handleContentChange = useCallback((newContent: string) => {
    debouncedContentChange(newContent);
  }, [debouncedContentChange]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(editorContent);
      setIsDirty(false);
      setShowPreviewAlert(false);
      toast({
        title: "Changes saved",
        description: "Document updated successfully"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error saving",
        description: "Failed to save changes"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = useCallback(() => {
    setEditorContent(content);
    setSettings(initialSettings);
    onSettingsChange(initialSettings);
    onLogoRemove();
    setIsDirty(false);
    setShowPreviewAlert(false);
    toast({
      title: "Changes discarded"
    });
  }, [content, initialSettings, onSettingsChange, onLogoRemove]);

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col min-w-0">
        <EditorHeader
          isDirty={isDirty}
          isSaving={isSaving}
          documentType={documentType}
          version={version}
          onSave={handleSave}
          onDiscard={handleDiscard}
        />
        <EditorToolbar editor={editor} />
        
        {/* Preview Alert */}
        {showPreviewAlert && (
          <Alert className="mx-4 mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center gap-2">
              <span>Switch to</span>
              <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded">
                <FileText className="h-4 w-4" />
                <span>Preview</span>
              </div>
              <span>tab to see your changes</span>
            </AlertDescription>
          </Alert>
        )}
        
        <EditorContent
          content={editorContent}
          onChange={handleContentChange}
          settings={settings}
          onEditorReady={setEditor}
        />
      </div>
      <div className="w-80 flex-none bg-gray-50/50 border-l">
        <EditorSettings
          {...settings}
          isDirty={isDirty}
          onSave={handleSave}
          onReset={handleDiscard}
          onCoverPageChange={(enabled) => 
            handleSettingsChange({ hasCoverPage: enabled })}
          onCoverPageTextChange={(text) =>
            handleSettingsChange({ coverPageText: text })}
          onLogoUpload={handleLogoUpload}
          onLogoRemove={onLogoRemove}
          onWatermarkChange={(enabled) =>
            handleSettingsChange({ hasWatermark: enabled })}
          onWatermarkTextChange={(text) =>
            handleSettingsChange({ watermarkText: text })}
        />
      </div>
    </div>
  );
}