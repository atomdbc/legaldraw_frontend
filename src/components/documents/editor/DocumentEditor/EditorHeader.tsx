// src/components/documents/editor/DocumentEditor/EditorHeader.tsx

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';  // Changed from react-day-picker
import { Loader2 } from 'lucide-react';

interface EditorHeaderProps {
  isDirty: boolean;
  isSaving: boolean;
  documentType: string;
  version: string;
  onSave: () => void;
  onDiscard?: () => void;
}

export function EditorHeader({
  isDirty,
  isSaving,
  documentType,
  version,
  onSave,
  onDiscard
}: EditorHeaderProps) {
  return (
    <div className="flex-none border-b bg-white px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-yellow-50 text-yellow-700">
            Draft
          </Badge>
          {isDirty && (
            <span className="text-sm text-muted-foreground">
              Unsaved changes
            </span>
          )}
          {isSaving && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {documentType} v{version}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onDiscard}
            disabled={isSaving || !isDirty}
          >
            Discard
          </Button>
          <Button
            size="sm"
            onClick={onSave}
            disabled={isSaving || !isDirty}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}