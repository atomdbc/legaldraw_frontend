'use client';

import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { PartyList } from './PartyList';
import { PartyDetailsForm } from './PartyDetailsForm';
import { Party, INITIAL_PARTY } from "@/types/party";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus2, Users } from "lucide-react";

interface PartyFormProps {
  parties: Party[];
  onChange: (parties: Party[]) => void;
  onValidationChange?: (isValid: boolean) => void;
  prefilledFirstParty?: boolean;
  validationErrors?: Record<string, any>;
}

export function PartyForm({
  parties,
  onChange,
  onValidationChange,
  prefilledFirstParty = false,
  validationErrors = {}
}: PartyFormProps) {
  const [selectedParty, setSelectedParty] = useState<string | null>(parties[0]?.id || null);
  const { toast } = useToast();

  // Add new party and maintain selection
  const addParty = useCallback(() => {
    const newParty = {
      ...INITIAL_PARTY,
      id: crypto.randomUUID(),
      role: `Party ${parties.length + 1}`
    };
    const updatedParties = [...parties, newParty];
    onChange(updatedParties);
    setSelectedParty(newParty.id); // Set selection to new party
    toast({ title: "New party added" });
  }, [parties, onChange, toast]);

  // Update party while maintaining selection
  const updateParty = useCallback((id: string, updates: Partial<Party>) => {
    const updatedParties = parties.map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    onChange(updatedParties);
    onValidationChange?.(true);
  }, [parties, onChange, onValidationChange]);

  // Remove party with improved selection handling
  const removeParty = useCallback((id: string) => {
    if (prefilledFirstParty && id === parties[0]?.id) {
      toast({
        variant: "destructive",
        title: "Cannot remove first party"
      });
      return;
    }

    const updatedParties = parties.filter(p => p.id !== id);
    onChange(updatedParties);

    // If removing selected party, select the previous one or the first one
    if (selectedParty === id) {
      const currentIndex = parties.findIndex(p => p.id === id);
      const newSelectedId = currentIndex > 0 
        ? parties[currentIndex - 1].id 
        : updatedParties[0]?.id;
      setSelectedParty(newSelectedId);
    }
  }, [parties, selectedParty, prefilledFirstParty, onChange, toast]);

  const currentParty = parties.find(p => p.id === selectedParty);
  const currentErrors = selectedParty ? validationErrors[selectedParty] || {} : {};

  return (
    <div className="flex h-full min-h-0">
      {/* Party List */}
      <PartyList
        parties={parties}
        selectedParty={selectedParty}
        onSelectParty={setSelectedParty}
        onAddParty={addParty}
      />

      {/* Party Details */}
      <div className="flex-1 min-w-0 p-4">
        {currentParty ? (
          <PartyDetailsForm
            party={currentParty}
            onUpdate={(updates) => updateParty(currentParty.id, updates)}
            onRemove={() => removeParty(currentParty.id)}
            canRemove={!prefilledFirstParty || currentParty.id !== parties[0]?.id}
            errors={currentErrors}
            isFirstParty={prefilledFirstParty && currentParty.id === parties[0]?.id}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <p>Select a party to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PartyForm;