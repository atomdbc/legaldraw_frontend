'use client';

import { useEffect, useState } from 'react';
import { Party, PartyType, PARTY_TYPES, ValidationErrors } from "@/types/party";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, Trash2, Mail, MapPin, Phone, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from '@/hooks/useLocation';
import { cn } from "@/lib/utils";
import { isValidEmail, formatPhone, isValidPhone } from "@/lib/utils/form";
import { JURISDICTION_GROUPS } from '@/lib/config/jurisdictions';
import { 
  getJurisdictionById, 
  createCustomJurisdiction 
} from '@/lib/config/jurisdictions';

interface PartyDetailsFormProps {
  party: Party;
  onUpdate: (updates: Partial<Party>) => void;
  onRemove: () => void;
  canRemove: boolean;
  errors: ValidationErrors;
}

export function PartyDetailsForm({
  party,
  onUpdate,
  onRemove,
  canRemove,
  errors
}: PartyDetailsFormProps) {
  // Load the country immediately if it exists in party.address
  const currentCountry = party.address?.country;
  const currentState = party.address?.state;
  const [showCustomJurisdiction, setShowCustomJurisdiction] = useState(false);
const [customJurisdiction, setCustomJurisdiction] = useState('');

  const {
    locationState,
    updateLocation,
    countries,
    states,
    isLoadingCountries,
    isLoadingStates
  } = useLocation({
    persistKey: party.id,
    initialCountry: currentCountry,
    initialState: currentState
  });

  // Update address helper
  const updateAddress = (updates: Partial<Party['address']>) => {
    onUpdate({
      address: { ...party.address, ...updates }
    });
  };

  // This effect ensures states are loaded when we have a country but no states
  useEffect(() => {
    async function loadStatesForCurrentCountry() {
      if (currentCountry && countries.length > 0) {
        const country = countries.find(c => c.countryName === currentCountry);
        if (country && country.geonameId) {
          // Update location with the country's geonameId to trigger state loading
          await updateLocation({
            country: country.countryName,
            geonameId: String(country.geonameId)
          });
        }
      }
    }

    // Load states if we have a country but states are empty
    if (currentCountry && states.length === 0 && !isLoadingStates) {
      loadStatesForCurrentCountry();
    }
  }, [currentCountry, countries, states.length, isLoadingStates]);

  // Load saved location on mount
  useEffect(() => {
    if (locationState.country && !party.address?.country) {
      updateAddress({ country: locationState.country });
    }
    if (locationState.state && !party.address?.state) {
      updateAddress({ state: locationState.state });
    }
  }, [locationState]);

  if (isLoadingCountries) {
    return <LoadingSkeleton />;
  }

  return (
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
              <Label className="flex items-center gap-2">
                Party Type
                {errors.type && (
                  <span className="text-sm text-destructive">{errors.type}</span>
                )}
              </Label>
              <Select
                value={party.type}
                onValueChange={(value) => onUpdate({ type: value as PartyType })}
              >
                <SelectTrigger className="h-[60px]">
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
              <Label className="flex items-center gap-2">
                Name
                {errors.name && (
                  <span className="text-sm text-destructive">{errors.name}</span>
                )}
              </Label>
              <div className="relative">
                <Input
                  placeholder={party.type === 'individual' ? 
                    "Enter full legal name" : "Enter organization name"
                  }
                  value={party.name}
                  onChange={(e) => onUpdate({ name: e.target.value })}
                  className={cn(errors.name && "border-destructive")}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-6 w-6 text-muted-foreground"
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
                <Label>Email Address</Label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={party.email}
                    onChange={(e) => onUpdate({ email: e.target.value })}
                    className={cn(errors.email && "border-destructive")}
                  />
                  {party.email && isValidEmail(party.email) && (
                    <div className="absolute right-3 top-2.5 text-green-500">✓</div>
                  )}
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Jurisdiction */}
<div className="grid gap-2">
  <Label className="flex items-center gap-2">
    Jurisdiction
    {errors.jurisdiction && (
      <span className="text-sm text-destructive">{errors.jurisdiction}</span>
    )}
  </Label>
  {showCustomJurisdiction ? (
    <div className="flex gap-2">
      <Input
        value={customJurisdiction}
        onChange={(e) => setCustomJurisdiction(e.target.value)}
        placeholder="Enter jurisdiction name"
        className={cn(errors.jurisdiction && "border-destructive")}
      />
      <Button onClick={() => {
        if (customJurisdiction.trim()) {
          const jurisdiction = createCustomJurisdiction(customJurisdiction);
          onUpdate({ jurisdiction: jurisdiction.id });
          setShowCustomJurisdiction(false);
          setCustomJurisdiction('');
        }
      }}>
        Add
      </Button>
      <Button variant="outline" onClick={() => setShowCustomJurisdiction(false)}>
        Cancel
      </Button>
    </div>
  ) : (
    <Select
      value={party.jurisdiction || ''}
      onValueChange={(value) => {
        if (value === 'custom') {
          setShowCustomJurisdiction(true);
        } else {
          onUpdate({ jurisdiction: value });
        }
      }}
    >
      <SelectTrigger className="h-[42px]">
        <SelectValue placeholder="Select jurisdiction">
          {party.jurisdiction ? getJurisdictionById(party.jurisdiction)?.label || party.jurisdiction : "Select jurisdiction"}
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

        <SelectSeparator />
        <SelectItem value="custom">+ Add Custom Jurisdiction</SelectItem>
      </SelectContent>
    </Select>
  )}
</div>

              {/* Phone */}
              <div className="grid gap-2">
                <Label className="flex items-center gap-2">
                  Phone
                  <Badge variant="secondary" className="font-normal">Optional</Badge>
                </Label>
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
                <Label>Country</Label>
                <Select
                  value={currentCountry || locationState.country}
                  onValueChange={(value) => {
                    const selectedCountry = countries.find(c => c.countryName === value);
                    if (selectedCountry) {
                      updateAddress({ 
                        country: selectedCountry.countryName,
                        state: '' // Reset state when country changes
                      });
                      updateLocation({
                        country: selectedCountry.countryName,
                        geonameId: String(selectedCountry.geonameId),
                        state: ''
                      });
                    }
                  }}
                >
                  <SelectTrigger className="h-[42px]">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem 
                        key={country.geonameId} 
                        value={country.countryName}
                      >
                        {country.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* State/Province */}
              {currentCountry && (
                <div className="grid gap-2">
                  <Label>State/Province</Label>
                  {isLoadingStates ? (
                    <Skeleton className="h-[42px] w-full" />
                  ) : (
                    <Select
                      value={currentState || locationState.state}
                      onValueChange={(value) => {
                        updateAddress({ state: value });
                        updateLocation({ state: value });
                      }}
                    >
                      <SelectTrigger className="h-[42px]">
                        <SelectValue placeholder="Select state/province" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem 
                            key={state.geonameId} 
                            value={state.displayName}
                          >
                            {state.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}

              {/* City and Postal Code */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>City</Label>
                  <Input
                    placeholder="Enter city"
                    value={party.address?.city || ''}
                    onChange={(e) => updateAddress({ city: e.target.value })}
                    className={cn(errors['address.city'] && "border-destructive")}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Postal Code</Label>
                  <Input
                    placeholder="Enter postal code"
                    value={party.address?.postalCode || ''}
                    onChange={(e) => updateAddress({ postalCode: e.target.value })}
                    className={cn(errors['address.postalCode'] && "border-destructive")}
                  />
                </div>
              </div>

              {/* Street Address */}
              <div className="grid gap-2">
                <Label>Street Address</Label>
                <Input
                  placeholder="Enter street address"
                  value={party.address?.street || ''}
                  onChange={(e) => updateAddress({ street: e.target.value })}
                  className={cn(errors['address.street'] && "border-destructive")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
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