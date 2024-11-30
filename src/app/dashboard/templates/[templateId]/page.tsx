// src/app/dashboard/templates/[templateId]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTemplates } from '@/context/TemplateContext';
import { Template } from '@/types/template';
import { PreviewDialog } from '@/components/templates/PreviewDialog';

interface Version {
  id: string;
  version: string;
  changelog: string[];
  createdAt: string;
  deprecated?: boolean;
  deprecationReason?: string;
}

export default function TemplateDetailPage() {
  const router = useRouter();
  const { templateId } = useParams();
  const { 
    getTemplate, 
    getVersionHistory, 
    loading, 
    error 
  } = useTemplates();
  const [template, setTemplate] = useState<Template | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (templateId) {
          const [templateRes, versionsRes] = await Promise.all([
            getTemplate(templateId as string),
            getVersionHistory(templateId as string)
          ]);
          setTemplate(templateRes.data);
          setVersions(versionsRes.data);
        }
      } catch (err) {
        console.error('Failed to fetch template data:', err);
      }
    };

    fetchData();
  }, [templateId, getTemplate, getVersionHistory]);

  const handleEditClick = () => {
    router.push(`/dashboard/templates/${templateId}/edit`);
  };

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

  if (!template) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
        Template not found
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{template.title}</h1>
          {template.description && (
            <p className="text-gray-600 mt-1">{template.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Preview
          </button>
          <button
            onClick={handleEditClick}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Edit
          </button>
        </div>
      </div>



      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow">
        <div>
          <h3 className="font-medium text-gray-700">Category</h3>
          <p>{template.category}</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-700">Document Type</h3>
          <p>{template.documentType}</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-700">Jurisdictions</h3>
          <p>{template.jurisdictions.join(', ')}</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-700">Languages</h3>
          <p>{template.supportedLanguages.join(', ')}</p>
        </div>
      </div>

      {/* Version History */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Version History</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="space-y-4">
            {versions.length === 0 ? (
              <p className="text-gray-500">No versions available</p>
            ) : (
              versions.map((version) => (
                <div
                  key={version.id}
                  className="border p-4 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        Version {version.version}
                        {version.deprecated && (
                          <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            Deprecated
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Created on {new Date(version.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedVersion(version.version);
                          setIsPreviewOpen(true);
                        }}
                        className="text-sm text-blue-500 hover:text-blue-600"
                      >
                        Preview
                      </button>
                      {!version.deprecated && (
                        <button
                          onClick={() => {/* Handle deprecate */}}
                          className="text-sm text-red-500 hover:text-red-600"
                        >
                          Deprecate
                        </button>
                      )}
                    </div>
                  </div>
                  {version.changelog && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium">Changelog:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {version.changelog.map((change, index) => (
                          <li key={index}>{change}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {version.deprecated && version.deprecationReason && (
                    <div className="mt-2 text-sm text-red-600">
                      Deprecation reason: {version.deprecationReason}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Template Sections</h2>
        {template.sections.map((section) => (
          <div key={section.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium mb-2">{section.title}</h3>
            <div className="prose max-w-none">
              {section.content}
            </div>
            {section.fields.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h4 className="font-medium mb-2">Fields</h4>
                <div className="grid grid-cols-2 gap-4">
                  {section.fields.map((field) => (
                    <div key={field.id} className="border p-2 rounded">
                      <p className="font-medium">{field.label}</p>
                      <p className="text-sm text-gray-600">Type: {field.type}</p>
                      {field.required && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          Required
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Variables */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Template Variables</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-3 gap-4">
            {template.variables.map((variable, index) => (
              <div key={index} className="border p-2 rounded">
                <p className="font-medium">{variable.name}</p>
                <p className="text-sm text-gray-600">Type: {variable.type}</p>
                {variable.description && (
                  <p className="text-sm text-gray-500">{variable.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}