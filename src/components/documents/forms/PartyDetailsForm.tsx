'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Party, PartyType, PARTY_TYPES } from "@/types/party";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import { AlertCircle, Trash2, Mail, MapPin, Phone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from '@/hooks/useLocation';
import { cn } from "@/lib/utils";
import { isValidEmail, formatPhone, isValidPhone } from "@/lib/utils/form";
import { JURISDICTION_GROUPS } from '@/lib/config/jurisdictions';
import { getJurisdictionById, createCustomJurisdiction } from '@/lib/config/jurisdictions';
import { DEFAULT_LOCATION } from '@/lib/api/locationService';

interface ValidationError {
  field: string;
  message: string;
}

interface PartyDetailsFormProps {
  party: Party;
  onUpdate: (updates: Partial<Party>) => void;
  onRemove: () => void;
  canRemove: boolean;
  validationErrors: ValidationError[];
  touchedFields: Set<string>;
  onFieldTouch: (field: string) => void;
}

// Field label component for consistent label rendering
const FieldLabel = ({ 
  label, 
  field, 
  required = true,
  error,
  touched
}: { 
  label: string;
  field: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
}) => (
  <div className="flex flex-wrap items-center gap-2">
    <Label>{label}</Label>
    {required ? (
      <Badge 
        variant={error && touched ? "destructive" : "secondary"}
        className="font-normal"
      >
        Required
      </Badge>
    ) : (
      <Badge variant="secondary" className="font-normal">Optional</Badge>
    )}
    {error && touched && (
      <span className="text-sm text-destructive">{error}</span>
    )}
  </div>
);

export function PartyDetailsForm({
  party,
  onUpdate,
  onRemove,
  canRemove,
  validationErrors,
  touchedFields,
  onFieldTouch
}: PartyDetailsFormProps) {
  const [showCustomJurisdiction, setShowCustomJurisdiction] = useState(false);
  const [customJurisdiction, setCustomJurisdiction] = useState('');
  const initialSetupDone = useRef(false);

  const {
    locationState,
    updateLocation,
    countries,
    states,
    isLoadingCountries,
    isLoadingStates,
    isInitialized
  } = useLocation({
    persistKey: party.id,
    initialCountry: party.address?.country || DEFAULT_LOCATION.COUNTRY_NAME,
    initialState: party.address?.state || DEFAULT_LOCATION.STATE
  });

  const getFieldError = (field: string): string | undefined => {
    const error = validationErrors.find(err => err.field === field);
    return error?.message;
  };

  const isFieldTouched = (field: string): boolean => {
    return touchedFields.has(`${party.id}-${field}`);
  };

  const handleFieldBlur = (field: string) => {
    onFieldTouch(`${party.id}-${field}`);
  };

  // Memoized address update function
  const updateAddress = useCallback((updates: Partial<Party['address']>) => {
    onUpdate({
      address: {
        ...party.address,
        ...updates
      }
    });
  }, [party.address, onUpdate]);

  // Country/State handling useEffects...
  useEffect(() => {
    if (isInitialized && !party.address?.country) {
      updateAddress({
        country: DEFAULT_LOCATION.COUNTRY_NAME,
        state: DEFAULT_LOCATION.STATE
      });
    }
  }, [isInitialized, party.address?.country, updateAddress]);

  useEffect(() => {
    if (!initialSetupDone.current && isInitialized && countries?.length > 0) {
      const setupLocation = async () => {
        const countryToUse = party.address?.country || DEFAULT_LOCATION.COUNTRY_NAME;
        const selectedCountry = countries.find(c => c.countryName === countryToUse);
        
        if (selectedCountry?.geonameId) {
          await updateLocation({
            country: selectedCountry.countryName,
            geonameId: String(selectedCountry.geonameId),
            state: party.address?.state || (countryToUse === DEFAULT_LOCATION.COUNTRY_NAME ? DEFAULT_LOCATION.STATE : '')
          });
        }
      };
      
      setupLocation();
      initialSetupDone.current = true;
    }
  }, [isInitialized, countries, party.address?.country, party.address?.state, updateLocation]);

  const handleCountryChange = async (countryName: string) => {
    const selectedCountry = countries.find(c => c.countryName === countryName);
    if (selectedCountry) {
      updateAddress({
        country: selectedCountry.countryName,
        state: countryName === DEFAULT_LOCATION.COUNTRY_NAME ? DEFAULT_LOCATION.STATE : ''
      });

      await updateLocation({
        country: selectedCountry.countryName,
        geonameId: String(selectedCountry.geonameId),
        state: countryName === DEFAULT_LOCATION.COUNTRY_NAME ? DEFAULT_LOCATION.STATE : ''
      });
      
      handleFieldBlur('address.country');
    }
  };

  const handleStateChange = (stateName: string) => {
    updateAddress({ state: stateName });
    updateLocation({ state: stateName });
    handleFieldBlur('address.state');
  };

  if (!isInitialized || isLoadingCountries) {
    return <LoadingSkeleton />;
  }

  return (
    <TooltipProvider>
      <Card className="flex flex-col h-full p-6 overflow-hidden">
        <div className="flex flex-col h-full space-y-6 overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-card z-10 pb-4 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">Party Details</h3>
                <p className="text-sm text-muted-foreground">
                  Enter the details for this party
                </p>
              </div>
              <div className="flex items-center gap-2">
                {party.type !== 'individual' && (
                  <Badge variant="outline" className="font-normal">
                    Organization
                  </Badge>
                )}
                {canRemove && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onRemove}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid gap-6">
              {/* Party Type */}
              <div className="grid gap-2">
                <FieldLabel 
                  label="Party Type"
                  field="type"
                  error={getFieldError('type')}
                  touched={isFieldTouched('type')}
                />
                <Select
                  defaultValue={party.type}
                  onValueChange={(value) => {
                    onUpdate({ type: value as PartyType });
                    handleFieldBlur('type');
                  }}
                >
                  <SelectTrigger 
                    className={cn(
                      "h-[60px]",
                      getFieldError('type') && 
                      isFieldTouched('type') && 
                      "border-destructive"
                    )}
                  >
                    <SelectValue placeholder="Select party type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PARTY_TYPES.map((type) => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.id} value={type.id} className="h-[60px]">
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{type.label}</span>
                                {type.id === 'individual' && (
                                  <Badge variant="secondary">Simple</Badge>
                                )}
                                {type.id === 'corporation' && (
                                  <Badge>Common</Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {type.description}
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Name */}
              <div className="grid gap-2">
                <FieldLabel 
                  label="Name"
                  field="name"
                  error={getFieldError('name')}
                  touched={isFieldTouched('name')}
                />
                <div className="relative">
                  <Input
                    placeholder={party.type === 'individual' ? 
                      "Enter full legal name" : "Enter organization name"
                    }
                    value={party.name}
                    onChange={(e) => onUpdate({ name: e.target.value })}
                    onBlur={() => handleFieldBlur('name')}
                    className={cn(
                      getFieldError('name') && 
                      isFieldTouched('name') && 
                      "border-destructive"
                    )}
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-6 w-6 text-muted-foreground"
                        type="button"
                      >
                        <AlertCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        {party.type === 'individual' 
                          ? "Enter the full legal name as it appears on official documents"
                          : "Enter the complete registered name of the organization"
                        }
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <h4 className="font-medium text-foreground">Contact Information</h4>
                </div>

                {/* Email */}
                <div className="grid gap-2">
                  <FieldLabel 
                    label="Email Address"
                    field="email"
                    error={getFieldError('email')}
                    touched={isFieldTouched('email')}
                  />
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={party.email}
                      onChange={(e) => onUpdate({ email: e.target.value })}
                      onBlur={() => handleFieldBlur('email')}
                      className={cn(
                        getFieldError('email') && 
                        isFieldTouched('email') && 
                        "border-destructive"
                      )}
                    />
                    {party.email && isValidEmail(party.email) && (
                      <div className="absolute right-3 top-2.5 text-green-500">✓</div>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="grid gap-2">
                  <FieldLabel 
                    label="Phone"
                    field="phone"
                    required={false}
                  />
                  <div className="relative">
                    <Input
                      type="tel"
                      placeholder="Enter phone number"
                      value={party.phone || ''}
                      onChange={(e) => onUpdate({ phone: formatPhone(e.target.value) })}
                    />
                    {party.phone && isValidPhone(party.phone) && (
                      <div className="absolute right-3 top-2.5 text-green-500">✓</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <h4 className="font-medium text-foreground">Address</h4>
                </div>

                {/* Country */}
                <div className="grid gap-2">
                  <FieldLabel 
                    label="Country"
                    field="address.country"
                    error={getFieldError('address.country')}
                    touched={isFieldTouched('address.country')}
                  />
                  <Select
                    value={party.address?.country || DEFAULT_LOCATION.COUNTRY_NAME}
                    onValueChange={handleCountryChange}
                  >
                    <SelectTrigger className={cn(
                      "h-[42px]",
                      getFieldError('address.country') && 
                      isFieldTouched('address.country') && 
                      "border-destructive"
                    )}>
                      <SelectValue>
                        {party.address?.country || DEFAULT_LOCATION.COUNTRY_NAME}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {countries && countries.length > 0 ? (
                          countries.map((country) => (
                            <SelectItem 
                              key={country.geonameId} 
                              value={country.countryName}
                            >
                              {country.displayName || country.countryName}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            {isLoadingCountries ? 'Loading...' : 'No countries available'}
                          </SelectItem>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* State/Province */}
                {party.address?.country && (
                  <div className="grid gap-2">
                    <FieldLabel 
                      label="State/Province"
                      field="address.state"
                      error={getFieldError('address.state')}
                      touched={isFieldTouched('address.state')}
                      required={false}
                    />
                    {isLoadingStates ? (
                      <Skeleton className="h-[42px] w-full" />
                    ) : (
                      <Select
                        value={party.address?.state || ''}
                        onValueChange={handleStateChange}
                      >
                        <SelectTrigger className="h-[42px]">
                          <SelectValue>
                            {party.address?.state || "Select state/province"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {states && states.length > 0 ? (
                              states.map((state) => (
                                <SelectItem 
                                  key={state.geonameId} 
                                  value={state.displayName}
                                >
                                  {state.displayName}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="" disabled>
                                No states available
                              </SelectItem>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                )}

                {/* City and Postal Code */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <FieldLabel 
                      label="City"
                      field="address.city"
                      error={getFieldError('address.city')}
                      touched={isFieldTouched('address.city')}
                    />
                    <Input
                      placeholder="Enter city"
                      value={party.address?.city || ''}
                      onChange={(e) => updateAddress({ city: e.target.value })}
                      onBlur={() => handleFieldBlur('address.city')}
                      className={cn(
                        getFieldError('address.city') && 
                        isFieldTouched('address.city') && 
                        "border-destructive"
                      )}
                    />
                  </div>

                  <div className="grid gap-2">
                    <FieldLabel 
                      label="Postal Code"
                      field="address.postalCode"
                      required={false}
                    />
                    <Input
                      placeholder="Enter postal code"
                      value={party.address?.postalCode || ''}
                      onChange={(e) => updateAddress({ postalCode: e.target.value })}
                    />
                  </div>
                </div>

                {/* Street Address */}
                <div className="grid gap-2">
                  <FieldLabel 
                    label="Street Address"
                    field="address.street"
                    error={getFieldError('address.street')}
                    touched={isFieldTouched('address.street')}
                  />
                  <Input
                    placeholder="Enter street address"
                    value={party.address?.street || ''}
                    onChange={(e) => updateAddress({ street: e.target.value })}
                    onBlur={() => handleFieldBlur('address.street')}
                    className={cn(
                      getFieldError('address.street') && 
                      isFieldTouched('address.street') && 
                      "border-destructive"
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
}

function LoadingSkeleton() {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </Card>
  );
}