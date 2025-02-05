'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import DocumentTypeSelector from "@/components/documents/wizard/DocumentTypeSelector";
import { useToast } from "@/hooks/use-toast";
import { useDocumentProgress } from "@/hooks/useDocumentProgress";
import { isValidDocumentType } from "@/lib/utils/documentTypes";
import { Loader2, ArrowLeft, HelpCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function CreateDocumentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { initializeProgress } = useDocumentProgress();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

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
      await initializeProgress({
        type: selectedType,
        step: 1,
        data: {
          created_at: new Date().toISOString(),
          type: selectedType,
        }
      });
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
    router.push('/documents');
  };

  const GuideContent = () => (
    <div className="space-y-4">
      <h3 className="font-medium text-base md:text-lg">Document Creation Guide</h3>
      <p className="text-sm text-muted-foreground">
        Follow these steps to create your document:
      </p>
      <ol className="space-y-4 md:space-y-6">
        {[
          'Select your document type from the available options',
          'Add the parties involved in the agreement',
          'Fill in the required document details',
          'Review and generate your document'
        ].map((step, index) => (
          <li key={index} className="flex gap-3 md:gap-4">
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs
              ${index === 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
              {index + 1}
            </span>
            <span className="text-sm">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col lg:flex-row">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 md:gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleCancel}
                className="lg:hidden flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight truncate">
                  Create New Document
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Choose the type of document you want to create
                </p>
              </div>
              <Sheet open={showGuide} onOpenChange={setShowGuide}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="lg:hidden flex-shrink-0"
                  >
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6">
                  <GuideContent />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-4 py-4 sm:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <DocumentTypeSelector
              onSelect={handleTypeSelect}
              selectedType={selectedType}
            />
          </div>
        </div>

        {/* Floating Action Bar */}
        <div className="sticky bottom-0 border-t px-4 py-4 sm:px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end gap-3 sm:gap-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!selectedType || isLoading}
              className="flex-1 sm:flex-none"
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

      {/* Guide Sidebar - Desktop */}
      <div className="hidden lg:block w-80 xl:w-96 border-l bg-muted/10">
        <div className="sticky top-0 p-6">
          <GuideContent />
        </div>
      </div>
    </div>
  );
}