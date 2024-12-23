'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import  DocumentTypeSelector  from "@/components/documents/wizard/DocumentTypeSelector";
import { useToast } from "@/hooks/use-toast";
import { useDocumentProgress } from "@/hooks/useDocumentProgress";
import { isValidDocumentType } from "@/lib/utils/documentTypes";
import { Loader2 } from "lucide-react";

export default function CreateDocumentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { initializeProgress } = useDocumentProgress();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTypeSelect = (typeId: string) => {
    if (!isValidDocumentType(typeId)) {
      toast({
        title: "Invalid Document Type",
        description: "Please select a valid document type.",
        variant: "destructive"
      });
      return;
    }
    setSelectedType(typeId);
  };

  const handleContinue = async () => {
    if (!selectedType) return;

    setIsLoading(true);
    try {
      // Initialize document progress
      await initializeProgress({
        type: selectedType,
        step: 1,
        data: {
          created_at: new Date().toISOString(),
          type: selectedType,
        }
      });

      // Navigate to parties step directly
      router.push(`/documents/create/${selectedType}/parties`);
    } catch (error) {
      console.error('Error starting document creation:', error);
      toast({
        title: "Error",
        description: "Failed to start document creation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    const returnUrl = '/documents';
    router.push(returnUrl);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <div className="flex-1 flex flex-col">
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-1 mb-6">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create New Document
              </h1>
              <p className="text-muted-foreground">
                Choose the type of document you want to create.
              </p>
            </div>

            <DocumentTypeSelector
              onSelect={handleTypeSelect}
              selectedType={selectedType}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-4xl mx-auto flex items-center justify-end gap-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!selectedType || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Guide Sidebar */}
      <div className="hidden lg:block w-1/3 border-l bg-muted/10 p-6">
        <div className="sticky top-6">
          <h3 className="font-medium">Document Creation Guide</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Follow these steps to create your document:
          </p>
          <ol className="mt-4 space-y-4 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                1
              </span>
              <span>Select your document type from the available options</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">
                2
              </span>
              <span>Add the parties involved in the agreement</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">
                3
              </span>
              <span>Fill in the required document details</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">
                4
              </span>
              <span>Review and generate your document</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}