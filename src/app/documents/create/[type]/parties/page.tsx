// src/app/documents/create/[type]/parties/page.tsx
import { PartyInformationClient } from './PartyInformationClient';
import { isValidDocumentType } from '@/lib/utils/documentTypes';
import { notFound } from 'next/navigation';
import crypto from 'crypto';

interface PageProps {
  params: { type: string };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const resolvedParams = await params;
  if (!resolvedParams.type || !isValidDocumentType(resolvedParams.type)) {
    return {
      title: 'Invalid Document Type',
    };
  }
  
  return {
    title: `${resolvedParams.type.toUpperCase()} - Party Information`,
  };
}

export default async function PartyInformationPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  // Await the params promise
  const resolvedParams = await params;
  const documentType = resolvedParams.type;

  // Validate document type
  if (!documentType || !isValidDocumentType(documentType)) {
    notFound();
  }

  const initialPartyId = crypto.randomUUID();

  return (
    <div className="min-h-screen bg-background">
      <PartyInformationClient
        documentType={documentType}
        initialPartyId={initialPartyId}
      />
    </div>
  );
}