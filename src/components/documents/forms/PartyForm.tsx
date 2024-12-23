'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { PartyList } from './PartyList';
import { PartyDetailsForm } from './PartyDetailsForm';
import { Party, INITIAL_PARTY, ValidationErrors } from "@/types/party";
import { validateParties } from "@/lib/validations/party";
import Cookies from 'js-cookie';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams } from 'next/navigation';

interface PartyFormProps {
  parties: Party[];
  onChange: (parties: Party[]) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export function PartyForm({
  parties,
  onChange,
  onValidationChange
}: PartyFormProps) {
  const searchParams = useSearchParams();
  const documentType = searchParams.get('type') || '';
  
  const [selectedParty, setSelectedParty] = useState<string | null>(
    parties[0]?.id || null
  );
  const [validationErrors, setValidationErrors] = useState<Record<string, ValidationErrors>>({});
  const { toast } = useToast();

  // Load saved data from cookie on initial mount
  useEffect(() => {
    const savedData = Cookies.get('document_draft');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.type === documentType && parsed.parties?.length > 0) {
          onChange(parsed.parties);
          setSelectedParty(parsed.parties[0].id);
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, [documentType]);

  // Debounced save function
  const saveToStorage = useDebouncedCallback((updatedParties: Party[]) => {
    try {
      const dataToSave = {
        type: documentType,
        parties: updatedParties,
        lastUpdated: new Date().toISOString()
      };
      Cookies.set('document_draft', JSON.stringify(dataToSave), { expires: 7 }); // Expires in 7 days
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        variant: "destructive",
        title: "Autosave Failed",
        description: "Failed to save your changes. Please try again.",
      });
    }
  }, 1000); // 1 second debounce

  const addParty = () => {
    const newParty: Party = {
      ...INITIAL_PARTY,
      id: crypto.randomUUID()
    };
    const updatedParties = [...parties, newParty];
    onChange(updatedParties);
    setSelectedParty(newParty.id);
    saveToStorage(updatedParties);
    toast({
      title: "Party Added",
      description: "New party has been added to the document.",
    });
  };

  const updateParty = useCallback((id: string, updates: Partial<Party>) => {
    const updatedParties = parties.map((party) =>
      party.id === id ? { ...party, ...updates } : party
    );

    // Validate updated party
    const errors = validateParties(updatedParties);
    setValidationErrors(prev => ({
      ...prev,
      [id]: errors
    }));

    onChange(updatedParties);
    saveToStorage(updatedParties);

    // Check if all parties are valid
    const isValid = Object.keys(errors).length === 0;
    onValidationChange?.(isValid);
  }, [parties, onChange, onValidationChange, saveToStorage]);

  const removeParty = (id: string) => {
    const updatedParties = parties.filter((party) => party.id !== id);
    onChange(updatedParties);
    saveToStorage(updatedParties);

    if (selectedParty === id) {
      setSelectedParty(updatedParties[0]?.id || null);
    }

    // Remove validation errors for removed party
    const newErrors = { ...validationErrors };
    delete newErrors[id];
    setValidationErrors(newErrors);

    toast({
      title: "Party Removed",
      description: "Party has been removed from the document.",
    });
  };

  // Get the currently selected party's details
  const currentParty = parties.find(p => p.id === selectedParty);
  const currentErrors = selectedParty ? validationErrors[selectedParty] || {} : {};

  return (
    <div className="flex gap-6 min-h-[600px] h-[calc(100vh-15rem)]">
      {/* Party List */}
      <PartyList
        parties={parties}
        selectedParty={selectedParty}
        onSelectParty={setSelectedParty}
        onAddParty={addParty}
      />

      {/* Party Details */}
      <div className="flex-1">
        {currentParty ? (
          <PartyDetailsForm
            party={currentParty}
            onUpdate={(updates) => updateParty(currentParty.id, updates)}
            onRemove={() => removeParty(currentParty.id)}
            canRemove={parties.length > 1}
            errors={currentErrors}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground">
                Click "Add Party" to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PartyForm;