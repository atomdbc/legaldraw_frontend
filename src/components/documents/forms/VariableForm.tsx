'use client';

import { useEffect, useState } from 'react';
import { NDAVariables } from "@/types/document";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Sparkles, AlertCircle, Wand2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Predefined suggestions for NDA fields
const FIELD_SUGGESTIONS = {
  purpose: [
    "For the evaluation of a potential business partnership or collaboration",
    "To discuss and explore potential investment opportunities",
    "For sharing technical specifications and proprietary information",
    "To facilitate the development of joint technology solutions",
  ],
  jurisdiction: [
    "State of Delaware",
    "State of California",
    "State of New York",
    "State of Texas"
  ],
  duration: [
    "one (1) year",
    "two (2) years",
    "three (3) years",
    "five (5) years",
    "indefinate"
  ],
  confidentiality_scope: [
    "All technical and business information shared during discussions",
    "Product specifications, designs, and technical documentation",
    "Financial information and business strategies",
    "Customer data and market research"
  ]
};

interface FieldConfig {
  id: string;
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select';
  description: string;
  required: boolean;
  suggestions?: string[];
  placeholder?: string;
  aiAssisted?: boolean;
}

const NDA_FIELDS: FieldConfig[] = [
  {
    id: 'purpose',
    key: 'purpose',
    label: 'Purpose of Agreement',
    type: 'select',
    description: 'Describe the main purpose of this NDA',
    required: true,
    suggestions: FIELD_SUGGESTIONS.purpose,
    aiAssisted: true
  },
  {
    id: 'confidentiality_scope',
    key: 'confidentiality_scope',
    label: 'Scope of Confidential Information',
    type: 'select',
    description: 'Define what information is considered confidential',
    required: true,
    suggestions: FIELD_SUGGESTIONS.confidentiality_scope,
    aiAssisted: true
  },
  {
    id: 'duration',
    key: 'duration',
    label: 'Duration',
    type: 'select',
    description: 'How long will this agreement remain in effect?',
    required: true,
    suggestions: FIELD_SUGGESTIONS.duration
  },
  {
    id: 'effective_date',
    key: 'effective_date',
    label: 'Effective Date',
    type: 'date',
    description: 'When does this agreement take effect?',
    required: true
  },
  {
    id: 'jurisdiction',
    key: 'jurisdiction',
    label: 'Governing Law',
    type: 'select',
    description: 'Which jurisdiction\'s laws will govern this agreement?',
    required: true,
    suggestions: FIELD_SUGGESTIONS.jurisdiction
  }
];

interface DocumentVariablesProps {
  documentType: string;
  variables: Partial<NDAVariables>;
  onChange: (variables: Partial<NDAVariables>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export function DocumentVariables({
  documentType,
  variables,
  onChange,
  onValidationChange
}: DocumentVariablesProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuggestions, setShowSuggestions] = useState(false);

  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    NDA_FIELDS.forEach(field => {
      const value = variables[field.key as keyof NDAVariables];
      if (field.required && !value) {
        newErrors[field.id] = `${field.label} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    onValidationChange?.(isValid);
    return isValid;
  };

  useEffect(() => {
    validateFields();
  }, [variables]);

  const handleChange = (field: FieldConfig, value: any) => {
    const formattedValue = field.type === 'date' && value instanceof Date
      ? value.toISOString()
      : value;

    onChange({
      ...variables,
      [field.key]: formattedValue
    });
  };

  const handleQuickFill = () => {
    const suggestedValues = {
      purpose: FIELD_SUGGESTIONS.purpose[0],
      confidentiality_scope: FIELD_SUGGESTIONS.confidentiality_scope[0],
      duration: FIELD_SUGGESTIONS.duration[0],
      jurisdiction: FIELD_SUGGESTIONS.jurisdiction[0],
      effective_date: new Date().toISOString()
    };

    onChange(suggestedValues);
    setShowSuggestions(false);
  };

  const renderField = (field: FieldConfig) => {
    const value = variables[field.key as keyof NDAVariables];
    const error = errors[field.id];

    const commonProps = {
      id: field.id,
      'aria-invalid': !!error,
      className: cn(error && "border-destructive")
    };

    switch (field.type) {
      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={field.id} className="flex items-center gap-2">
                {field.label}
                {field.required && <span className="text-destructive">*</span>}
                {field.aiAssisted && (
                  <Badge variant="secondary" className="ml-2">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Assisted
                  </Badge>
                )}
              </Label>
            </div>
            <Select
              value={value as string || ''}
              onValueChange={(value) => handleChange(field, value)}
            >
              <SelectTrigger {...commonProps}>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.suggestions?.map((suggestion) => (
                  <SelectItem key={suggestion} value={suggestion}>
                    {suggestion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  {...commonProps}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value ? format(new Date(value), 'PPP') : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value ? new Date(value) : undefined}
                  onSelect={(date) => handleChange(field, date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Document Variables</h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={handleQuickFill}>
              <Wand2 className="h-4 w-4 mr-2" />
              Quick Fill
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Auto-fill with AI-suggested values</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="grid gap-6">
        {NDA_FIELDS.map(renderField)}
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="rounded-lg border-destructive/50 border bg-destructive/10 p-4">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm font-medium">Please complete all required fields</p>
          </div>
        </div>
      )}
    </div>
  );
}