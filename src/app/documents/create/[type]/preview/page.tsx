// src/app/documents/create/[type]/preview/page.tsx
import { Suspense } from 'react';
import { PreviewClient } from './PreviewClient';

interface PageProps {
  params: Promise<{
    type: string;
  }>;
  searchParams: Promise<{
    documentId?: string;
  }>;
}

export default async function DocumentPreviewPage({
  params,
  searchParams,
}: PageProps) {
  const [{ type }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams
  ]);
  
  const documentType = type.toLowerCase();
  const documentId = resolvedSearchParams?.documentId;
  
  return (
    <Suspense fallback={
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-8 w-8 border-3 border-primary rounded-full border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading preview...
          </p>
        </div>
      </div>
    }>
      <PreviewClient
        documentType={documentType}
        documentId={documentId}
      />
    </Suspense>
  );
}