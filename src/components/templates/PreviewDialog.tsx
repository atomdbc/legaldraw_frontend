// src/components/templates/PreviewDialog.tsx
import { useState } from 'react';
import { Template } from '@/types/template';
import { PreviewPane } from './PreviewPane';
import { useTemplates } from '@/context/TemplateContext';

interface PreviewDialogProps {
  template: Template;
  isOpen: boolean;
  onClose: () => void;
}

export function PreviewDialog({ template, isOpen, onClose }: PreviewDialogProps) {
  const { previewTemplate } = useTemplates();
  const [previewData, setPreviewData] = useState<Record<string, any>>({});
  const [previewContent, setPreviewContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFieldChange = (fieldId: string, value: any) => {
    setPreviewData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handlePreview = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await previewTemplate(template.id, previewData);
      setPreviewContent(response);
    } catch (err) {
      setError('Failed to generate preview');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Preview Template</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 h-[calc(90vh-64px)]">
          {/* Form Fields */}
          <div className="p-4 border-r overflow-y-auto">
            <div className="space-y-4">
              {template.sections.map(section => (
                <div key={section.id} className="space-y-4">
                  <h3 className="font-medium">{section.title}</h3>
                  {section.fields.map(field => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium mb-1">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {field.type === 'text' && (
                        <input
                          type="text"
                          value={previewData[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="w-full p-2 border rounded"
                          placeholder={field.placeholder}
                        />
                      )}
                      {field.type === 'rich-text' && (
                        <textarea
                          value={previewData[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="w-full p-2 border rounded"
                          rows={4}
                          placeholder={field.placeholder}
                        />
                      )}
                      {/* Add other field types as needed */}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-4">
              <button
                onClick={handlePreview}
                disabled={loading}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Generating Preview...' : 'Generate Preview'}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-500 rounded">
                {error}
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="p-4 overflow-y-auto">
            {previewContent ? (
              <PreviewPane content={previewContent} />
            ) : (
              <div className="text-center text-gray-500 mt-8">
                Fill in the fields and click "Generate Preview" to see the result
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}