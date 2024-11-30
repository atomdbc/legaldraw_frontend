// src/app/dashboard/templates/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useTemplates } from '@/context/TemplateContext';
import { Template, TemplateCategory, DocumentType } from '@/types/template';
import Link from 'next/link';

export default function TemplatesPage() {
  const { templates, loading, error, pagination, fetchTemplates } = useTemplates();
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | ''>('');
  const [selectedType, setSelectedType] = useState<DocumentType | ''>('');

  useEffect(() => {
    fetchTemplates({
      category: selectedCategory || undefined,
      documentType: selectedType || undefined,
      page: 1,
      limit: 10
    });
  }, [fetchTemplates, selectedCategory, selectedType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Templates</h1>
        <Link
          href="/dashboard/templates/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Template
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as TemplateCategory)}
          className="border rounded-md p-2"
        >
          <option value="">All Categories</option>
          {Object.values(TemplateCategory).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as DocumentType)}
          className="border rounded-md p-2"
        >
          <option value="">All Types</option>
          {Object.values(DocumentType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No templates found
          </h3>
          <p className="text-gray-500">
            Create your first template to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Link
              key={template.id}
              href={`/dashboard/templates/${template.id}`}
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg mb-2">{template.title}</h3>
              {template.description && (
                <p className="text-gray-600 text-sm mb-4">{template.description}</p>
              )}
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {template.category}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                  {template.documentType}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: pagination.totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => fetchTemplates({ page: index + 1, limit: pagination.limit })}
              className={`px-3 py-1 rounded ${
                pagination.page === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}