'use client';

import { useEffect, useState } from 'react';
import { Party, PartyType, PARTY_TYPES, ValidationErrors } from "@/types/party";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, Trash2, Mail, MapPin, Phone, Building2 } from "lucide-react";
import { locationService } from '@/lib/api/locationService';
import { isValidEmail, formatPhone, isValidPhone } from "@/lib/utils/form";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface PartyDetailsFormProps {
  party: Party;
  onUpdate: (updates: Partial<Party>) => void;
  onRemove: () => void;
  canRemove: boolean;
  errors: ValidationErrors;
}

interface GeoLocation {
  geonameId: string;
  toponymName: string;
  countryCode: string;
  countryName?: string;
  adminCode1?: string;
  adminName1?: string;
}

export function PartyDetailsForm({
  party,
  onUpdate,
  onRemove,
  canRemove,
  errors
}: PartyDetailsFormProps) {
  const [countries, setCountries] = useState<GeoLocation[]>([]);
  const [states, setStates] = useState<GeoLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);
  const [selectedGeonameId, setSelectedGeonameId] = useState<number | null>(null);

  // Load states when selectedGeonameId changes
  useEffect(() => {
    async function loadStates() {
      if (selectedGeonameId) {
        setLoadingStates(true);
        try {
          console.log('Fetching states for geonameId:', selectedGeonameId); // Debug
          const data = await locationService.getStatesForCountry(String(selectedGeonameId));
          setStates(data);
        } catch (error) {
          console.error('Error loading states:', error);
          setStates([]);
        } finally {
          setLoadingStates(false);
        }
      } else {
        setStates([]);
      }
    }
    loadStates();
  }, [selectedGeonameId]);
  
  useEffect(() => {
    async function loadCountries() {
      try {
        const data = await locationService.getAllCountries();
        setCountries(data);
      } catch (error) {
        console.error('Error loading countries:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCountries();
  }, []);

  // Load states when country changes


  const updateAddress = (updates: Partial<Party['address']>) => {
    onUpdate({
      address: { ...party.address, ...updates }
    });
  };

  if (loading) {
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

            {/* Country Selection */}
<div className="grid gap-2">
  <Label>Country</Label>
  <Select
    value={party.address.country}
    onValueChange={(value) => {
      // Find the selected country
      const selectedCountry = countries.find(c => c.countryName === value);
      console.log('Selected country:', selectedCountry); // Debug
      if (selectedCountry) {
        // Use the full country name
        updateAddress({ 
          country: selectedCountry.countryName // Use full name instead of code
        });
        // Store geonameId for state lookup
        setSelectedGeonameId(selectedCountry.geonameId);
      }
    }}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select country" />
    </SelectTrigger>
    <SelectContent>
      {countries.map((country) => (
        <SelectItem 
          key={country.geonameId} 
          value={country.countryName}  
        >
          {country.countryName}  
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

{/* State/Province Selection */}
{party.address?.country && (
  <div className="grid gap-2">
    <Label>State/Province</Label>
    {loadingStates ? (
      <Skeleton className="h-10 w-full" />
    ) : (
      <Select
        value={party.address.state}
        onValueChange={(value) => {
          const selectedState = states.find(s => s.displayName === value);
          if (selectedState) {
            updateAddress({ 
              state: selectedState.displayName // Use full state name
            });
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select state/province" />
        </SelectTrigger>
        <SelectContent>
          {states.length > 0 ? (
            states.map((state) => (
              <SelectItem 
                key={state.geonameId} 
                value={state.displayName}
              >
                {state.displayName}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled>No states available</SelectItem>
          )}
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
                    value={party.address.city}
                    onChange={(e) => updateAddress({ city: e.target.value })}
                    className={cn(errors['address.city'] && "border-destructive")}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Postal Code</Label>
                  <Input
                    placeholder="Enter postal code"
                    value={party.address.postalCode}
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
                  value={party.address.street}
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