'use client';

import { memo } from 'react';
import { Party, PARTY_TYPES } from "@/types/party";
import { Button } from "@/components/ui/button";
import { Plus, Check, Building2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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
    <div className="w-80 flex flex-col border-r bg-card">
      {/* Header with Add Button */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div>
            <h2 className="font-medium">Parties ({parties.length})</h2>
          </div>
        </div>
        <Button
          onClick={onAddParty}
          size="sm"
          className="h-8"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {/* Scrollable Party List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {parties.map((party, index) => {
            const PartyIcon = PARTY_TYPES.find(t => t.id === party.type)?.icon || Building2;
            const isComplete = party.name && party.address.street;

            return (
              <button
                key={party.id}
                onClick={() => onSelectParty(party.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 text-left rounded-md mb-1 transition-all duration-200",
                  selectedParty === party.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                )}
              >
                <div
                  className={cn(
                    "rounded-md p-2",
                    selectedParty === party.id
                      ? "bg-primary-foreground/10"
                      : "bg-muted"
                  )}
                >
                  <PartyIcon className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-medium truncate">
                      {party.name || `Party ${index + 1}`}
                    </span>
                    {isComplete ? (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                        <Check className="h-3 w-3 mr-1" />
                        Complete
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        In Progress
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs opacity-80">
                      {party.type.charAt(0).toUpperCase() + party.type.slice(1)}
                    </span>
                    {party.organization && (
                      <>
                        <span className="text-xs opacity-50">•</span>
                        <span className="text-xs opacity-80 truncate">
                          {party.organization}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Optional Footer */}
      {parties.length === 0 && (
        <div className="p-4 text-center text-sm text-muted-foreground border-t">
          Click "Add" to add your first party
        </div>
      )}
    </div>
  );
});

export default PartyList;