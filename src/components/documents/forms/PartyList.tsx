'use client';

import { memo } from 'react';
import { Party, PARTY_TYPES } from "@/types/party";
import { Button } from "@/components/ui/button";
import { Plus, Check, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PartyListProps {
  parties: Party[];
  selectedParty: string | null;
  onSelectParty: (id: string) => void;
  onAddParty: () => void;
}

export const PartyList = memo(function PartyList({
  parties,
  selectedParty,
  onSelectParty,
  onAddParty
}: PartyListProps) {
  return (
    <div className="w-72 flex flex-col h-full bg-muted/50 p-3 rounded-l-lg">
      <div className="mb-3">
        <h2 className="text-sm font-medium">Parties</h2>
        <p className="text-xs text-muted-foreground">
          Add all parties involved in this agreement
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="space-y-1">
          {parties.map((party) => {
            const PartyIcon = PARTY_TYPES.find(t => t.id === party.type)?.icon || Building2;
            const isComplete = party.name && party.address.street;
            
            return (
              <button
                key={party.id}
                onClick={() => onSelectParty(party.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1.5 text-left rounded-md transition-all duration-200",
                  selectedParty === party.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-muted"
                )}
              >
                <div className={cn(
                  "rounded-md p-1",
                  selectedParty === party.id
                    ? "bg-primary-foreground/10"
                    : "bg-muted"
                )}>
                  <PartyIcon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="flex-1 truncate text-sm">
                      {party.name || 'Unnamed Party'}
                    </span>
                    {isComplete && (
                      <Check className="h-3 w-3 text-green-500 shrink-0" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground truncate block">
                    {party.type.charAt(0).toUpperCase() + party.type.slice(1)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Button
        onClick={onAddParty}
        className="mt-2"
        variant="outline"
        size="sm"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Party
      </Button>
    </div>
  );
});