// src/components/documents/forms/PartyDetailsForm.tsx

'use client';

import { Party, PartyType, PARTY_TYPES, ValidationErrors } from "@/types/party";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, Trash2, Mail, MapPin, Phone, Building2 } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { usStates, countries, jurisdictions } from "@/lib/data/locations";
import { isValidEmail, formatPhone, isValidPhone } from "@/lib/utils/form";
import { cn } from "@/lib/utils";

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
  const updateAddress = (updates: Partial<Party['address']>) => {
    onUpdate({
      address: { ...party.address, ...updates }
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
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
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6">
          {/* Party Type */}
          <div className="grid gap-4">
            <Label className="flex items-center gap-2">
              Party Type
              {errors.type && (
                <span className="text-xs text-red-500">{errors.type}</span>
              )}
            </Label>
            <Select
              value={party.type}
              onValueChange={(value) => onUpdate({ type: value as PartyType })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select party type" />
              </SelectTrigger>
              <SelectContent>
                {PARTY_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span>{type.label}</span>
                            {type.id === 'individual' && (
                              <Badge variant="secondary" className="ml-2">
                                Simple
                              </Badge>
                            )}
                            {type.id === 'corporation' && (
                              <Badge variant="default" className="ml-2">
                                Common
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {type.description}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Party Name */}
          <div className="grid gap-2">
            <Label className="flex items-center gap-2">
              Name
              {errors.name && (
                <span className="text-xs text-red-500">{errors.name}</span>
              )}
            </Label>
            <div className="relative">
              <Input
                placeholder={party.type === 'individual' ? 
                  "Enter full name" : "Enter organization name"
                }
                value={party.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                className={cn(
                  "pr-8",
                  errors.name && "border-red-500"
                )}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-6 w-6 text-muted-foreground hover:text-primary"
                  >
                    <AlertCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {party.type === 'individual' 
                      ? "Enter the full legal name of the individual"
                      : "Enter the complete registered name of the organization"
                    }
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-medium">Contact Information</h4>
            </div>

            {/* Email field */}
            <div className="grid gap-2">
              <Label>Email Address</Label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={party.email}
                  onChange={(e) => onUpdate({ email: e.target.value })}
                  className={errors.email ? "border-red-500" : ""}
                />
                {party.email && isValidEmail(party.email) && (
                  <div className="absolute right-2 top-2.5">
                    <div className="h-4 w-4 text-green-500">✓</div>
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone (Optional) */}
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                Phone
                <Badge variant="secondary" className="font-normal">
                  Optional
                </Badge>
              </Label>
              <div className="relative">
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  value={party.phone || ''}
                  onChange={(e) => onUpdate({ 
                    phone: formatPhone(e.target.value)
                  })}
                />
                {party.phone && isValidPhone(party.phone) && (
                  <div className="absolute right-2 top-2.5">
                    <div className="h-4 w-4 text-green-500">✓</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Jurisdiction */}
<div className="grid gap-2">
  <Label className="flex items-center gap-2">
    Jurisdiction
    {party.type !== 'individual' && (
      <Badge variant="default" className="font-normal">
        Required for Organizations
      </Badge>
    )}
    {errors.jurisdiction && (
      <span className="text-xs text-red-500">{errors.jurisdiction}</span>
    )}
  </Label>
  <Select
    value={party.jurisdiction}
    onValueChange={(value) => onUpdate({ jurisdiction: value })}
  >
    <SelectTrigger className={errors.jurisdiction ? "border-red-500" : ""}>
      <SelectValue placeholder="Select jurisdiction" />
    </SelectTrigger>
    <SelectContent>
      {jurisdictions.map((jurisdiction) => (
        <SelectItem key={jurisdiction} value={jurisdiction}>
          {jurisdiction}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

          {/* Address Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-medium">Address</h4>
            </div>

            {/* Address fields */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Street Address</Label>
                <Input
                  placeholder="Enter street address"
                  value={party.address.street}
                  onChange={(e) => updateAddress({ street: e.target.value })}
                  className={errors['address.street'] ? "border-red-500" : ""}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>City</Label>
                  <Input
                    placeholder="Enter city"
                    value={party.address.city}
                    onChange={(e) => updateAddress({ city: e.target.value })}
                    className={errors['address.city'] ? "border-red-500" : ""}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>State</Label>
                  <Select
                    value={party.address.state}
                    onValueChange={(value) => updateAddress({ state: value })}
                  >
                    <SelectTrigger
                      className={errors['address.state'] ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {usStates.map((state) => (
                        <SelectItem key={state.code} value={state.code}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>ZIP Code</Label>
                  <Input
                    placeholder="Enter ZIP code"
                    value={party.address.zipCode}
                    onChange={(e) => updateAddress({ zipCode: e.target.value })}
                    className={errors['address.zipCode'] ? "border-red-500" : ""}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Country</Label>
                  <Select
                    value={party.address.country}
                    onValueChange={(value) => updateAddress({ country: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Error Summary */}
{errors && Object.keys(errors).length > 0 && (
  <div className="rounded-lg bg-red-50 p-4">
    <div className="flex items-center gap-2 text-red-600">
      <AlertCircle className="h-4 w-4" />
      <h4 className="text-sm font-medium">Please fix the following errors:</h4>
    </div>
    <ul className="mt-2 list-disc pl-5 text-sm text-red-600">
      {Object.entries(errors).map(([field, error]) => (
        <li key={field}>{error.message}</li>
      ))}
    </ul>
  </div>
)}
          
        </div>
      </div>
    </Card>
  );
}