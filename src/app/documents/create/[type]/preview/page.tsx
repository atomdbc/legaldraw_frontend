// src/app/documents/create/[type]/preview/page.tsx
import { PreviewClient } from './PreviewClient';
import { Suspense } from 'react';

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent" />
      </div>
    }>
      <PreviewClient
        documentType={documentType}
        documentId={documentId}
      />
    </Suspense>
  );
}