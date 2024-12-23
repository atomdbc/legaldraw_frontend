// src/app/documents/create/[type]/details/page.tsx
'use server';

import { DocumentDetailsClient } from './DocumentDetailsClient';
import { isValidDocumentType } from '@/lib/utils/documentTypes';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    type: string;
  }
}

export default async function DocumentDetailsPage({ params }: PageProps) {
  const { type } = await params;
  
  if (!isValidDocumentType(type)) {
    notFound();
  }

  return <DocumentDetailsClient initialType={type} />;
}