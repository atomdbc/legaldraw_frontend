import { PartyInformationClient } from './PartyInformationClient';
import { isValidDocumentType } from '@/lib/utils/documentTypes';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import crypto from 'crypto';

type Props = {
  params: Promise<{ type: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params;
  const documentType = resolvedParams.type;
  
  if (!documentType || !isValidDocumentType(documentType)) {
    return {
      title: 'Invalid Document Type',
    };
  }
  
  return {
    title: `${documentType.toUpperCase()} - Party Information`,
  };
}

export default async function PartyInformationPage({ 
  params 
}: Props) {
  const resolvedParams = await params;
  const documentType = resolvedParams.type;

  // Validate document type
  if (!documentType || !isValidDocumentType(documentType)) {
    notFound();
  }

  // Generate a unique ID for the initial party
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