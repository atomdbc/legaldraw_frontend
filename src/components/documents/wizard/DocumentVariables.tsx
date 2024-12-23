'use client';

import { useEffect, useState, useCallback } from 'react';
import { NDAVariables } from "@/types/document";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CalendarIcon, Sparkles, AlertCircle, Wand2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Alert } from "@/components/ui/alert";

interface DocumentVariablesProps {
  documentType: string;
  variables: Partial<NDAVariables>;
  onChange: (variables: Partial<NDAVariables>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

const PREDEFINED_VALUES = {
  purpose: 'For the purpose of evaluating potential business opportunities and discussing possible collaboration.',
  duration: 'one (1) year',
  governing_law: 'State of Delaware',
  effective_date: new Date().toISOString()
};

const documentFields: { [key: string]: { id: string; key: string; label: string; type: string; description: string; required: boolean; placeholder?: string; options?: string[] }[] } = {
  nda: [
    {
      id: 'purpose',
      key: 'purpose',
      label: 'Purpose of Agreement',
      type: 'textarea' as const,
      description: 'Describe the purpose for sharing confidential information',
      required: true,
      placeholder: 'e.g., For the purpose of evaluating potential business opportunities...'
    },
    {
      id: 'duration',
      key: 'duration',
      label: 'Duration',
      type: 'select' as const,
      description: 'How long will this agreement be in effect?',
      required: true,
      options: [
        'one (1) year',
        'two (2) years',
        'three (3) years',
        'five (5) years'
      ]
    },
    {
      id: 'governing_law',
      key: 'governing_law',
      label: 'Governing Law',
      type: 'text' as const,
      description: 'Which jurisdiction\'s laws will govern this agreement?',
      required: true,
      placeholder: 'e.g., State of Delaware'
    },
    {
      id: 'effective_date',
      key: 'effective_date',
      label: 'Effective Date',
      type: 'date' as const,
      description: 'When does this agreement take effect?',
      required: true
    }
  ]
};

export function DocumentVariables({
  documentType,
  variables,
  onChange,
  onValidationChange
}: DocumentVariablesProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fields = documentFields[documentType.toLowerCase()] || [];

  const validateFields = useCallback(() => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      const value = variables[field.key as keyof NDAVariables];
      if (field.required && (!value || value === '')) {
        newErrors[field.id] = `${field.label} is required`;
        isValid = false;
      }
    });

    console.log('Validation state:', { isValid, fields: variables });
    setErrors(newErrors);
    onValidationChange?.(isValid);
    return isValid;
  }, [fields, variables, onValidationChange]);

  useEffect(() => {
    validateFields();
  }, [validateFields]);

  const handleQuickFill = () => {
    onChange(PREDEFINED_VALUES);
  };

  const handleChange = (field: typeof fields[0], value: any) => {
    const formattedValue = field.type === 'date' && value instanceof Date
      ? value.toISOString()
      : value;

    const newVariables = {
      ...variables,
      [field.key]: formattedValue
    };

    onChange(newVariables);
    validateFields();
  };


  const renderField = (field: typeof fields[0]) => {
    const error = errors[field.id];
    const value = variables[field.key as keyof NDAVariables];

    const commonProps = {
      id: field.id,
      'aria-required': field.required,
      'aria-invalid': !!error,
      className: cn(error && "border-destructive")
    };

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              {...commonProps}
              value={value as string || ''}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={field.placeholder}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
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
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={value ? new Date(value) : undefined}
                  onSelect={date => handleChange(field, date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Select
              value={value as string || ''}
              onValueChange={value => handleChange(field, value)}
            >
              <SelectTrigger {...commonProps}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        );

        default:
          return (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id} className="flex items-center gap-2">
                {field.label}
                {field.required && <span className="text-destructive">*</span>}
              </Label>
              {field.description && (
                <p className="text-sm text-muted-foreground">{field.description}</p>
              )}
              <Input
                {...commonProps}
                type={field.type}
                value={value as string || ''}
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder={field.placeholder}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          );
      }
    };
  
    return (
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Document Variables</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  onClick={handleQuickFill}
                  className="gap-2"
                >
                  <Wand2 className="h-4 w-4" />
                  Quick Fill
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Auto-fill with suggested values</p>
              </TooltipContent>
            </Tooltip>
          </div>
  
          {fields.map(field => (
            <div key={field.id}>
              {renderField(field)}
            </div>
          ))}
  
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <div className="ml-2">
                <h4 className="font-medium">Please fix the following errors:</h4>
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </Alert>
          )}
        </div>
      </Card>
    );
  }