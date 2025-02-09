'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, ScrollText } from "lucide-react";
import { useRouter } from "next/navigation";
import { isValidDocumentType, getQuickDocumentType, DocumentTypeId } from "@/lib/utils/documentTypes";

interface DocumentTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: string;
}

export function DocumentTypeDialog({ isOpen, onClose, documentType }: DocumentTypeDialogProps) {
  const router = useRouter();

  const handleQuickGeneration = () => {
    if (isValidDocumentType(documentType as DocumentTypeId)) {
      const quickType = getQuickDocumentType(documentType as DocumentTypeId);
      // Fixed the navigation path to include /create
      router.push(`/quick-documents/create?type=${quickType.toLowerCase()}`);
      onClose();
    } else {
      console.error('Invalid document type:', documentType);
    }
  };

  const handleDetailedGeneration = () => {
    if (isValidDocumentType(documentType as DocumentTypeId)) {
      router.push(`/documents/create/${documentType}/details`);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Choose Generation Type</DialogTitle>
          <DialogDescription>
            Select how you would like to generate your document
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Card
            className="p-4 cursor-pointer hover:border-primary transition-colors"
            onClick={handleQuickGeneration}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Quick Generation</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Fast, simple process with essential fields. Perfect for standard agreements.
                </p>
              </div>
              <div className="text-xs bg-secondary px-2 py-1 rounded">
                ~1 min generation time
              </div>
            </div>
          </Card>

          <Card
            className="p-4 cursor-pointer hover:border-primary transition-colors"
            onClick={handleDetailedGeneration}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <ScrollText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Detailed Generation</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Comprehensive process with advanced legal options. Ideal for legal professionals.
                </p>
              </div>
              <div className="text-xs bg-secondary px-2 py-1 rounded">
                ~2 min generation time
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}