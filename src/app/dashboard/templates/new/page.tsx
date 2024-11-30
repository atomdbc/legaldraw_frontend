// src/app/dashboard/templates/new/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTemplates } from '@/context/TemplateContext';
import { CreateTemplateForm } from '@/components/templates/CreateTemplateForm';
import { TemplateCategory, DocumentType } from '@/types/template';

export default function NewTemplatePage() {
  const router = useRouter();
  const { createTemplate } = useTemplates();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (templateData: any) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await createTemplate(templateData);
      router.push('/dashboard/templates');
    } catch (err) {
      setError('Failed to create template');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Template</h1>
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}
      <CreateTemplateForm 
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}