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

    onChange({
      ...variables,
      [field.key]: formattedValue
    });
  };

  const handleCustomJurisdictionSubmit = (field: JurisdictionField) => {
    if (customJurisdiction.trim()) {
      const jurisdiction = createCustomJurisdiction(customJurisdiction);
      setCustomJurisdictions(prev => ({
        ...prev,
        [jurisdiction.id]: jurisdiction.label
      }));
      onChange({
        ...variables,
        [field.key]: jurisdiction.label
      });
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

  const renderJurisdictionField = (field: JurisdictionField) => (
    <div className="w-full">
      {showCustomJurisdiction ? (
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Input
              value={customJurisdiction}
              onChange={(e) => setCustomJurisdiction(e.target.value)}
              placeholder="Enter jurisdiction name"
              className={cn(errors[field.id] && "border-destructive")}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => handleCustomJurisdictionSubmit(field)} size="sm">
              Add
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowCustomJurisdiction(false)}
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Select
          value={(() => {
            const currentValue = variables[field.key as keyof DocumentVariablesType] as string;
            const jurisdiction = JURISDICTIONS.find(j => j.label === currentValue);
            const customEntry = Object.entries(customJurisdictions).find(([_, label]) => label === currentValue);
            return jurisdiction ? jurisdiction.id : (customEntry ? customEntry[0] : '');
          })()}
          onValueChange={(value) => {
            if (value === 'custom') {
              setShowCustomJurisdiction(true);
            } else {
              const jurisdiction = getJurisdictionById(value);
              if (jurisdiction) {
                onChange({
                  ...variables,
                  [field.key]: jurisdiction.label
                });
              }
            }
          }}
        >
          <SelectTrigger className={cn(errors[field.id] && "border-destructive")}>
            <SelectValue>
              {variables[field.key as keyof DocumentVariablesType] || "Select jurisdiction"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(JURISDICTION_GROUPS).map(([group, ids], index) => (
              <SelectGroup key={group}>
                <SelectLabel className="capitalize">
                  {group.replace(/_/g, ' ')}
                </SelectLabel>
                {ids.map(id => {
                  const jurisdiction = getJurisdictionById(id);
                  return jurisdiction && (
                    <SelectItem key={id} value={id}>
                      {jurisdiction.label}
                    </SelectItem>
                  );
                })}
                {index < Object.entries(JURISDICTION_GROUPS).length - 1 && (
                  <SelectSeparator />
                )}
              </SelectGroup>
            ))}

            {Object.keys(customJurisdictions).length > 0 && (
              <>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Custom</SelectLabel>
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

  const renderDateField = (field: DocumentField) => (
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
      <PopoverContent className="w-auto p-0" align="start">
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
  );

  if (fields.length === 0) {
    return (
      <div className="w-full">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm">
            Document type "{documentType}" is not configured. Available types: {Object.keys(DOCUMENT_FIELDS_CONFIG).join(', ')}
          </p>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Card>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-lg font-semibold">Document Variables</h3>
            {PREDEFINED_VALUES[configKey as keyof typeof PREDEFINED_VALUES] && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline"
                    onClick={handleQuickFill}
                    className="w-full sm:w-auto"
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Quick Fill
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Auto-fill with suggested values</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          <div className="space-y-6">
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label 
                  htmlFor={field.id}
                  className="flex items-center gap-2"
                >
                  {field.label}
                  {field.required && (
                    <span className="text-destructive">*</span>
                  )}
                </Label>

                <div className="w-full">
                  {field.type === 'jurisdiction' ? (
                    renderJurisdictionField(field as JurisdictionField)
                  ) : field.type === 'textarea' ? (
                    <Textarea
                      id={field.id}
                      value={variables[field.key as keyof DocumentVariablesType] as string || ''}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      placeholder={field.placeholder}
                      className={cn(
                        "min-h-[100px]",
                        errors[field.id] && "border-destructive"
                      )}
                    />
                  ) : field.type === 'date' ? (
                    renderDateField(field)
                  ) : field.type === 'select' ? (
                    <Select
                      value={variables[field.key as keyof DocumentVariablesType] as string || ''}
                      onValueChange={(value) => handleFieldChange(field, value)}
                    >
                      <SelectTrigger className={cn(errors[field.id] && "border-destructive")}>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                </div>

                {errors[field.id] && (
                  <p className="text-sm text-destructive">
                    {errors[field.id]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <div className="ml-2">
                <p className="font-medium">Please fix the following errors:</p>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  {Object.values(errors).map((error, index) => (
                    <li key={index} className="text-sm">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            </Alert>
          )}
        </div>
      </Card>
    </div>
  );
}