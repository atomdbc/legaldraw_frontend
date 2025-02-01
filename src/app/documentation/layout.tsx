// src/app/documentation/layout.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Documentation - LegalDraw',
  description: 'Learn how to use LegalDraw AI for document generation and management'
};

export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </div>
    </Suspense>
  );
}