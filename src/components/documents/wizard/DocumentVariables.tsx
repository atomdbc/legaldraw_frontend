'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CalendarIcon, AlertCircle, Wand2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Alert } from "@/components/ui/alert";
import { 
  DocumentVariables as DocumentVariablesType, 
  DocumentField,
  JurisdictionField,
  DOCUMENT_FIELDS_CONFIG, 
  PREDEFINED_VALUES 
} from "@/types/document";
import {
  JURISDICTIONS,
  JURISDICTION_GROUPS,
  getJurisdictionById,
  createCustomJurisdiction
} from '@/lib/config/jurisdictions';

interface DocumentVariablesProps {
  documentType: string;
  variables: Partial<DocumentVariablesType>;
  onChange: (variables: Partial<DocumentVariablesType>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export function DocumentVariables({
  documentType,
  variables,
  onChange,
  onValidationChange
}: DocumentVariablesProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCustomJurisdiction, setShowCustomJurisdiction] = useState(false);
  const [customJurisdiction, setCustomJurisdiction] = useState('');
  const [customJurisdictions, setCustomJurisdictions] = useState<Record<string, string>>({});
  
  const getConfigKey = (type: string): string => {
    return type.toLowerCase()
      .replace('_agreement', '_agreement')
      .replace('agreement', '_agreement')
      .replace(/^employment$/, 'employment_agreement')
      .replace(/^service$/, 'service')
      .replace(/^nda$/, 'nda');
  };

  const configKey = getConfigKey(documentType);
  const fields = DOCUMENT_FIELDS_CONFIG[configKey] || [];

  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      if (field.required) {
        const value = variables[field.key as keyof DocumentVariablesType];
        if (!value || value === '') {
          newErrors[field.id] = `${field.label} is required`;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    onValidationChange?.(isValid);
  };

  useEffect(() => {
    validateFields();
  }, [variables]);

  const handleFieldChange = (field: DocumentField, value: any) => {
    const formattedValue = field.type === 'date' && value instanceof Date
      ? value.toISOString()
      : value;

    const newVariables = {
      ...variables,
      [field.key]: formattedValue
    };

    onChange(newVariables);
  };

  const getJurisdictionLabel = (value: string) => {
    if (value.startsWith('custom_')) {
      return customJurisdictions[value] || value;
    }
    return getJurisdictionById(value)?.label || value;
  };

  const handleCustomJurisdictionSubmit = () => {
    if (customJurisdiction.trim()) {
      const jurisdiction = createCustomJurisdiction(customJurisdiction);
      setCustomJurisdictions(prev => ({
        ...prev,
        [jurisdiction.id]: customJurisdiction
      }));
      handleFieldChange({ key: 'governing_law' } as DocumentField, jurisdiction.id);
      setShowCustomJurisdiction(false);
      setCustomJurisdiction('');
    }
  };

  const handleQuickFill = () => {
    const docType = configKey as keyof typeof PREDEFINED_VALUES;
    const defaultValues = PREDEFINED_VALUES[docType];
    if (defaultValues) {
      onChange(defaultValues);
    }
  };

  if (fields.length === 0) {
    return (
      <Card className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <p>Document type "{documentType}" is not properly configured. Available types are: {Object.keys(DOCUMENT_FIELDS_CONFIG).join(', ')}</p>
        </Alert>
      </Card>
    );
  }

  const renderJurisdictionField = (field: JurisdictionField) => (
    <div>
      {showCustomJurisdiction ? (
        <div className="flex gap-2">
          <Input
            value={customJurisdiction}
            onChange={(e) => setCustomJurisdiction(e.target.value)}
            placeholder="Enter jurisdiction name"
            className={cn(errors[field.id] && "border-destructive")}
          />
          <Button onClick={handleCustomJurisdictionSubmit}>Add</Button>
          <Button variant="outline" onClick={() => setShowCustomJurisdiction(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Select
          value={variables[field.key as keyof DocumentVariablesType] as string || ''}
          onValueChange={(value) => {
            if (value === 'custom') {
              setShowCustomJurisdiction(true);
            } else {
              handleFieldChange(field, value);
            }
          }}
        >
          <SelectTrigger className={cn(errors[field.id] && "border-destructive")}>
            <SelectValue>
              {variables[field.key as keyof DocumentVariablesType] 
                ? getJurisdictionLabel(variables[field.key as keyof DocumentVariablesType] as string)
                : "Select jurisdiction"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Popular Jurisdictions</SelectLabel>
              {JURISDICTION_GROUPS.popular.map(id => {
                const jurisdiction = getJurisdictionById(id);
                return jurisdiction && (
                  <SelectItem key={id} value={id}>
                    {jurisdiction.label}
                  </SelectItem>
                );
              })}
            </SelectGroup>
            
            <SelectSeparator />
            
            <SelectGroup>
              <SelectLabel>International</SelectLabel>
              {JURISDICTION_GROUPS.international.map(id => {
                const jurisdiction = getJurisdictionById(id);
                return jurisdiction && (
                  <SelectItem key={id} value={id}>
                    {jurisdiction.label}
                  </SelectItem>
                );
              })}
            </SelectGroup>

            {Object.entries(JURISDICTION_GROUPS)
              .filter(([group]) => !['popular', 'international'].includes(group))
              .map(([group, ids]) => (
                <SelectGroup key={group}>
                  <SelectLabel>{group.replace(/([A-Z])/g, ' $1').trim()}</SelectLabel>
                  {ids.map(id => {
                    const jurisdiction = getJurisdictionById(id);
                    return jurisdiction && (
                      <SelectItem key={id} value={id}>
                        {jurisdiction.label}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              ))}

            {Object.keys(customJurisdictions).length > 0 && (
              <>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Custom Jurisdictions</SelectLabel>
                  {Object.entries(customJurisdictions).map(([id, label]) => (
                    <SelectItem key={id} value={id}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </>
            )}

            <SelectSeparator />
            <SelectItem value="custom">+ Add Custom Jurisdiction</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Document Variables</h3>
          {PREDEFINED_VALUES[configKey as keyof typeof PREDEFINED_VALUES] && (
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
          )}
        </div>

        <div className="space-y-4">
          {fields.map(field => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id} className="flex items-center gap-2">
                {field.label}
                {field.required && <span className="text-destructive">*</span>}
              </Label>

              {field.type === 'jurisdiction' ? (
                renderJurisdictionField(field as JurisdictionField)
              ) : field.type === 'textarea' ? (
                <Textarea
                  id={field.id}
                  value={variables[field.key as keyof DocumentVariablesType] as string || ''}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  placeholder={field.placeholder}
                  className={cn(errors[field.id] && "border-destructive")}
                />
              ) : field.type === 'select' ? (
                <Select
                  value={variables[field.key as keyof DocumentVariablesType] as string || ''}
                  onValueChange={(value) => handleFieldChange(field, value)}
                >
                  <SelectTrigger className={cn(errors[field.id] && "border-destructive")}>
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
              ) : field.type === 'date' ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !variables[field.key as keyof DocumentVariablesType] && "text-muted-foreground",
                        errors[field.id] && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {variables[field.key as keyof DocumentVariablesType] 
                        ? format(new Date(variables[field.key as keyof DocumentVariablesType] as string), 'PPP')
                        : "Select date"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={variables[field.key as keyof DocumentVariablesType] 
                        ? new Date(variables[field.key as keyof DocumentVariablesType] as string)
                        : undefined
                      }
                      onSelect={(date) => handleFieldChange(field, date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <Input
                  id={field.id}
                  type="text"
                  value={variables[field.key as keyof DocumentVariablesType] as string || ''}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  placeholder={field.placeholder}
                  className={cn(errors[field.id] && "border-destructive")}
                />
              )}

              {errors[field.id] && (
                <p className="text-sm text-destructive">{errors[field.id]}</p>
              )}
            </div>
          ))}
        </div>

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