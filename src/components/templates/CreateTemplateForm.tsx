// src/components/templates/CreateTemplateForm.tsx
'use client';
import { useState } from 'react';
import { DocumentType, TemplateCategory } from '@/types/template';

interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'rich-text';
  required: boolean;
  defaultValue?: any;
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: { label: string; value: string }[];
  };
  description?: string;
}

interface TemplateSection {
  id: string;
  title: string;
  order: number;
  content: string;
  fields: TemplateField[];
  isRequired: boolean;
}

interface CreateTemplateFormProps {
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export function CreateTemplateForm({ onSubmit, isSubmitting }: CreateTemplateFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as TemplateCategory,
    documentType: '' as DocumentType,
    jurisdictions: [''],
    supportedLanguages: ['en'],
    sections: [
      {
        id: crypto.randomUUID(),
        title: 'Main Section',
        order: 0,
        content: '',
        fields: [],
        isRequired: true
      }
    ] as TemplateSection[],
    variables: [] as Array<{
      name: string;
      type: string;
      description: string;
      defaultValue?: any;
    }>,
    styles: {
      fontFamily: 'Arial',
      fontSize: '12pt',
      lineHeight: '1.5',
      margins: {
        top: '1in',
        bottom: '1in',
        left: '1in',
        right: '1in'
      }
    },
    settings: {
      requireSignature: false,
      allowCustomization: true,
      allowSharing: true,
      allowExport: true,
      validityDuration: 365 // days
    },
    tags: [] as string[]
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.documentType) {
      newErrors.documentType = 'Document type is required';
    }

    if (formData.jurisdictions.length === 0 || !formData.jurisdictions[0]) {
      newErrors.jurisdictions = 'At least one jurisdiction is required';
    }

    if (formData.sections.length === 0) {
      newErrors.sections = 'At least one section is required';
    }

    formData.sections.forEach((section, index) => {
      if (!section.title.trim()) {
        newErrors[`section_${index}_title`] = 'Section title is required';
      }
    });

    formData.variables.forEach((variable, index) => {
      if (!variable.name.trim()) {
        newErrors[`variable_${index}_name`] = 'Variable name is required';
      }
      if (!variable.type) {
        newErrors[`variable_${index}_type`] = 'Variable type is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Existing handlers
  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: crypto.randomUUID(),
          title: `Section ${prev.sections.length + 1}`,
          order: prev.sections.length,
          content: '',
          fields: [],
          isRequired: true
        }
      ]
    }));
  };

  const addField = (sectionId: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            fields: [
              ...section.fields,
              {
                id: crypto.randomUUID(),
                label: `Field ${section.fields.length + 1}`,
                type: 'text',
                required: false,
                placeholder: '',
                description: ''
              }
            ]
          };
        }
        return section;
      })
    }));
  };

  const handleSectionChange = (sectionId: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          return { ...section, [field]: value };
        }
        return section;
      })
    }));
  
    // Clear any section-related errors
    if (errors[`section_${sectionId}_${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`section_${sectionId}_${field}`];
        return newErrors;
      });
    }
  };

  const handleFieldChange = (sectionId: string, fieldId: string, updates: Partial<TemplateField>) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            fields: section.fields.map(field => {
              if (field.id === fieldId) {
                return { ...field, ...updates };
              }
              return field;
            })
          };
        }
        return section;
      })
    }));
  
    // Clear any field-related errors
    if (updates.label && errors[`field_${fieldId}_label`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`field_${fieldId}_label`];
        return newErrors;
      });
    }
  };

  const handleVariableChange = (index: number, updates: Partial<typeof formData.variables[0]>) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.map((variable, i) => {
        if (i === index) {
          return { ...variable, ...updates };
        }
        return variable;
      })
    }));
  
    // Clear any variable-related errors
    if (updates.name && errors[`variable_${index}_name`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`variable_${index}_name`];
        return newErrors;
      });
    }
  };

  
  const addVariable = () => {
    setFormData(prev => ({
      ...prev,
      variables: [
        ...prev.variables,
        {
          name: '',
          type: 'string',
          description: '',
          defaultValue: ''
        }
      ]
    }));
  };

  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const addJurisdiction = () => {
    setFormData(prev => ({
      ...prev,
      jurisdictions: [...prev.jurisdictions, '']
    }));
  };

  const handleJurisdictionChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      jurisdictions: prev.jurisdictions.map((j, i) => i === index ? value : j)
    }));
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const handleTagChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.map((t, i) => i === index ? value : t)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleBasicInfoChange}
            className={`w-full p-2 border rounded ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleBasicInfoChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleBasicInfoChange}
            className={`w-full p-2 border rounded ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select Category</option>
            {Object.values(TemplateCategory).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Document Type *</label>
          <select
            name="documentType"
            value={formData.documentType}
            onChange={handleBasicInfoChange}
            className={`w-full p-2 border rounded ${errors.documentType ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select Document Type</option>
            {Object.values(DocumentType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.documentType && <p className="text-red-500 text-sm mt-1">{errors.documentType}</p>}
        </div>

        {/* Jurisdictions */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium">Jurisdictions *</label>
            <button
              type="button"
              onClick={addJurisdiction}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              + Add Jurisdiction
            </button>
          </div>
          {formData.jurisdictions.map((jurisdiction, index) => (
            <input
              key={index}
              type="text"
              value={jurisdiction}
              onChange={(e) => handleJurisdictionChange(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter jurisdiction"
            />
          ))}
          {errors.jurisdictions && (
            <p className="text-red-500 text-sm">{errors.jurisdictions}</p>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium">Tags</label>
            <button
              type="button"
              onClick={addTag}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              + Add Tag
            </button>
          </div>
          {formData.tags.map((tag, index) => (
            <input
              key={index}
              type="text"
              value={tag}
              onChange={(e) => handleTagChange(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter tag"
            />
          ))}
        </div>

        {/* Document Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Document Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Font Family</label>
              <select
                value={formData.styles.fontFamily}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  styles: { ...prev.styles, fontFamily: e.target.value }
                }))}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Calibri">Calibri</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Font Size</label>
              <select
                value={formData.styles.fontSize}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  styles: { ...prev.styles, fontSize: e.target.value }
                }))}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="10pt">10pt</option>
                <option value="11pt">11pt</option>
                <option value="12pt">12pt</option>
                <option value="14pt">14pt</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Template Sections - Existing Code */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Template Sections</h2>
          <button
            type="button"
            onClick={addSection}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Section
          </button>
        </div>

        {formData.sections.map((section, index) => (
          <div key={section.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <input
                type="text"
                value={section.title}
                onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                className={`w-1/3 p-2 border rounded ${
                  errors[`section_${index}_title`] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Section Title"
              />
              <button
                type="button"
                onClick={() => addField(section.id)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Field
              </button>
            </div>
            {errors[`section_${index}_title`] && (
              <p className="text-red-500 text-sm">{errors[`section_${index}_title`]}</p>
            )}

            <textarea
              value={section.content}
              onChange={(e) => handleSectionChange(section.id, 'content', e.target.value)}
              className="w-full p-2 border rounded"
              rows={4}
              placeholder="Section Content"
            />

            {/* Fields - Existing Code */}
            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.id} className="border-l-4 border-blue-200 pl-4 space-y-2">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => handleFieldChange(section.id, field.id, { label: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Field Label"
                  />
                  <select
                    value={field.type}
                    onChange={(e) => handleFieldChange(section.id, field.id, { type: e.target.value as TemplateField['type'] })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="select">Select</option>
                    <option value="boolean">Boolean</option>
                    <option value="rich-text">Rich Text</option>
                  </select>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => handleFieldChange(section.id, field.id, { required: e.target.checked })}
                      className="mr-2"
                    />
                    Required Field
                  </label>
                  {field.type === 'select' && (
                    <div className="mt-2 space-y-2">
                      <label className="block text-sm font-medium">Options</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={field.validation?.options?.map(o => o.value).join(', ') || ''}
                          onChange={(e) => handleFieldChange(section.id, field.id, {
                            validation: {
                              ...field.validation,
                              options: e.target.value.split(',').map(v => ({
                                label: v.trim(),
                                value: v.trim()
                              }))
                            }
                          })}
                          className="w-full p-2 border rounded"
                          placeholder="Enter options (comma-separated)"
                        />
                      </div>
                    </div>
                  )}
                  <input
                    type="text"
                    value={field.description || ''}
                    onChange={(e) => handleFieldChange(section.id, field.id, { description: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Field Description (optional)"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Variables Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Template Variables</h2>
          <button
            type="button"
            onClick={addVariable}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Variable
          </button>
        </div>

        {formData.variables.map((variable, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-2">
            <input
              type="text"
              value={variable.name}
              onChange={(e) => handleVariableChange(index, { name: e.target.value })}
              className={`w-full p-2 border rounded ${
                errors[`variable_${index}_name`] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Variable Name"
            />
            {errors[`variable_${index}_name`] && (
              <p className="text-red-500 text-sm">{errors[`variable_${index}_name`]}</p>
            )}

            <select
              value={variable.type}
              onChange={(e) => handleVariableChange(index, { type: e.target.value })}
              className={`w-full p-2 border rounded ${
                errors[`variable_${index}_type`] ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Type</option>
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="date">Date</option>
            </select>
            {errors[`variable_${index}_type`] && (
              <p className="text-red-500 text-sm">{errors[`variable_${index}_type`]}</p>
            )}

            <input
              type="text"
              value={variable.description}
              onChange={(e) => handleVariableChange(index, { description: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Variable Description"
            />

            <input
              type="text"
              value={variable.defaultValue || ''}
              onChange={(e) => handleVariableChange(index, { defaultValue: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Default Value (optional)"
            />
          </div>
        ))}
      </div>

      {/* Document Settings */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold">Advanced Settings</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Validity Duration (days)</label>
            <input
              type="number"
              value={formData.settings.validityDuration}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: {
                  ...prev.settings,
                  validityDuration: parseInt(e.target.value) || 0
                }
              }))}
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.settings.requireSignature}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: {
                  ...prev.settings,
                  requireSignature: e.target.checked
                }
              }))}
              className="mr-2"
            />
            Require Signature
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.settings.allowCustomization}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: {
                  ...prev.settings,
                  allowCustomization: e.target.checked
                }
              }))}
              className="mr-2"
            />
            Allow Customization
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.settings.allowSharing}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: {
                  ...prev.settings,
                  allowSharing: e.target.checked
                }
              }))}
              className="mr-2"
            />
            Allow Sharing
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.settings.allowExport}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: {
                  ...prev.settings,
                  allowExport: e.target.checked
                }
              }))}
              className="mr-2"
            />
            Allow Export
          </label>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating Template...' : 'Create Template'}
        </button>
      </div>
    </form>
  );
}