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
  const [isMobileListVisible, setIsMobileListVisible] = useState(false);
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
    setSelectedParty(newParty.id);
    setIsMobileListVisible(false);
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
    <div className="h-full min-h-0">
      {/* Mobile Party Selector - Only visible on mobile */}
      <div className="block md:hidden p-4 border-b">
        <Button 
          variant="outline" 
          className="w-full justify-between"
          onClick={() => setIsMobileListVisible(!isMobileListVisible)}
        >
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {currentParty ? currentParty.role : 'Select Party'}
          </span>
          <UserPlus2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex h-[calc(100%-4rem)] md:h-full">
        {/* Party List - Original desktop version plus mobile overlay */}
        <div className={`
          md:block md:relative md:w-auto md:h-auto md:min-h-0
          ${isMobileListVisible ? 'block' : 'hidden'}
          fixed md:static
          inset-0
          z-50 md:z-0
          bg-background md:bg-transparent
        `}>
          <PartyList
            parties={parties}
            selectedParty={selectedParty}
            onSelectParty={(id) => {
              setSelectedParty(id);
              setIsMobileListVisible(false);
            }}
            onAddParty={addParty}
          />
        </div>

        {/* Party Details - Preserving original desktop layout */}
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
    </div>
  );
}

export default PartyForm;