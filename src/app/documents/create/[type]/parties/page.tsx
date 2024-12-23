'use server';

import { PartyInformationClient } from './PartyInformationClient';
import { isValidDocumentType } from '@/lib/utils/documentTypes';
import { notFound } from 'next/navigation';
import crypto from 'crypto';

interface PageProps {
  params: {
    type: string;
  }
}

export default async function PartyInformationPage({ params }: PageProps) {
  const { type } = await params;

  if (!isValidDocumentType(type)) {
    notFound();
  }

  const initialPartyId = crypto.randomUUID();

  return <PartyInformationClient 
    documentType={type} 
    initialPartyId={initialPartyId}
  />;
}